import "server-only";
import { pillgramFallback } from "@/data/pillgram-fallback";
import type { FlowItem, Media, PortfolioResult, Project, RichText, Section } from "@/lib/portfolio";

const API_VERSION = "2026-03-11";
type Obj = Record<string, unknown>;

const env = {
  token: process.env.NOTION_TOKEN,
  projects: process.env.NOTION_PROJECTS_DATA_SOURCE_ID,
  sections: process.env.NOTION_SECTIONS_DATA_SOURCE_ID,
  items: process.env.NOTION_ITEMS_DATA_SOURCE_ID,
  slug: process.env.NOTION_PROJECT_SLUG ?? "pillgram"
};

async function query(dataSourceId: string): Promise<Obj[]> {
  const response = await fetch(`https://api.notion.com/v1/data_sources/${dataSourceId}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.token}`,
      "Notion-Version": API_VERSION,
      "Content-Type": "application/json"
    },
    body: "{}",
    next: { revalidate: 300 }
  });
  if (!response.ok) throw new Error(`Notion request failed (${response.status})`);
  const json = (await response.json()) as { results?: Obj[] };
  return json.results ?? [];
}

function props(page: Obj): Record<string, Obj> { return (page.properties ?? {}) as Record<string, Obj>; }
function id(page: Obj): string { return String(page.id ?? ""); }
function prop(page: Obj, names: string[]): Obj | undefined {
  const all = props(page);
  for (const name of names) if (all[name]) return all[name];
  return undefined;
}
function plain(value?: Obj): string {
  if (!value) return "";
  const list = (value.title ?? value.rich_text) as Obj[] | undefined;
  if (list) return list.map((part) => String(part.plain_text ?? "")).join("");
  return String((value.select as Obj | undefined)?.name ?? value.url ?? "");
}
function rich(value?: Obj): RichText {
  const list = (value?.title ?? value?.rich_text) as Obj[] | undefined;
  return (list ?? []).map((part) => ({
    text: String(part.plain_text ?? ""),
    href: (part.href as string | null) ?? undefined,
    bold: Boolean((part.annotations as Obj | undefined)?.bold),
    italic: Boolean((part.annotations as Obj | undefined)?.italic)
  }));
}
function number(value?: Obj): number | undefined {
  return typeof value?.number === "number" ? value.number : undefined;
}
function relationIds(value?: Obj): string[] {
  return ((value?.relation as Obj[] | undefined) ?? []).map((entry) => String(entry.id));
}
function media(value: Obj | undefined, alt: string): Media | undefined {
  const file = ((value?.files as Obj[] | undefined) ?? [])[0];
  if (!file) return undefined;
  const source = (file.file ?? file.external) as Obj | undefined;
  const url = source?.url;
  return typeof url === "string" ? { url, alt } : undefined;
}

export async function getPortfolio(): Promise<PortfolioResult> {
  if (!env.token || !env.projects || !env.sections || !env.items) {
    return { project: pillgramFallback, source: "fallback" };
  }
  try {
    const [projects, sections, items] = await Promise.all([query(env.projects), query(env.sections), query(env.items)]);
    const page = projects.find((entry) => plain(prop(entry, ["Slug", "slug"])) === env.slug);
    if (!page) throw new Error(`Project “${env.slug}” was not found`);

    const projectSections = sections
      .filter((entry) => relationIds(prop(entry, ["Project", "Projects"])).includes(id(page)))
      .sort((a, b) => (number(prop(a, ["Order"])) ?? 0) - (number(prop(b, ["Order"])) ?? 0));
    const mappedSections: Section[] = projectSections.map((section) => {
      const alt = plain(prop(section, ["Alt", "Alt text"])) || plain(prop(section, ["Title", "Name"]));
      const sectionItems: FlowItem[] = items
        .filter((entry) => relationIds(prop(entry, ["Section", "Sections"])).includes(id(section)))
        .map((entry) => ({
          id: id(entry), label: plain(prop(entry, ["Label", "Name", "Title"])),
          value: number(prop(entry, ["Value", "Metric"])), note: plain(prop(entry, ["Note", "Description"])),
          order: number(prop(entry, ["Order"])) ?? 0
        })).sort((a, b) => a.order - b.order);
      return {
        id: id(section), eyebrow: plain(prop(section, ["Eyebrow", "Kicker"])),
        title: plain(prop(section, ["Title", "Name"])), body: rich(prop(section, ["Body", "Description"])),
        quote: plain(prop(section, ["Quote"])) || undefined,
        media: media(prop(section, ["Image", "Media"]), alt), items: sectionItems
      };
    });
    const heroAlt = plain(prop(page, ["Hero alt", "Alt text"])) || "Pillgram product screen";
    const project: Project = {
      id: id(page), slug: env.slug, title: plain(prop(page, ["Title", "Name"])),
      summary: rich(prop(page, ["Summary", "Description"])), role: plain(prop(page, ["Role"])) || undefined,
      period: plain(prop(page, ["Period", "Year"])) || undefined,
      hero: media(prop(page, ["Hero", "Hero image"]), heroAlt), sections: mappedSections
    };
    return { project, source: "notion" };
  } catch (error) {
    console.error("Notion content unavailable:", error);
    return { project: pillgramFallback, source: "fallback", warning: "Notion 콘텐츠를 불러오지 못해 개발용 콘텐츠를 표시합니다." };
  }
}
