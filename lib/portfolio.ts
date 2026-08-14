export type RichText = { text: string; href?: string; bold?: boolean; italic?: boolean }[];

export type Media = { url: string; alt: string; caption?: string };
export type FlowItem = { id: string; label: string; value?: number; note?: string; order: number };
export type Section = {
  id: string;
  eyebrow: string;
  title: string;
  body: RichText;
  quote?: string;
  media?: Media;
  items: FlowItem[];
};
export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: RichText;
  role?: string;
  period?: string;
  hero?: Media;
  sections: Section[];
};

export type PortfolioResult = { project: Project; source: "notion" | "fallback"; warning?: string };
