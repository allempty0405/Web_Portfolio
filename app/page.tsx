import { Bottleneck } from "@/components/bottleneck";
import { Hero } from "@/components/hero";
import { getPortfolio } from "@/lib/notion";

export default async function Page() {
  const { project, source, warning } = await getPortfolio();
  const [heroSection, bottleneckSection] = project.sections;
  return <main>
    <nav className="topbar wrap" aria-label="케이스 스터디 탐색"><a href="#hero-title" className="wordmark">PILLGRAM</a><span>Product design case study</span></nav>
    {warning && <p className="cms-warning" role="status">{warning}</p>}
    <Hero project={project} section={heroSection} />
    {bottleneckSection && <Bottleneck section={bottleneckSection} />}
    <footer className="footer wrap"><span>Pillgram</span><span>Content · {source === "notion" ? "Notion" : "Development fallback"}</span></footer>
  </main>;
}
