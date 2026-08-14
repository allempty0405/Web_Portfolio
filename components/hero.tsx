import Image from "next/image";
import type { Project, Section } from "@/lib/portfolio";
import { RichText } from "./rich-text";

export function Hero({ project, section }: { project: Project; section?: Section }) {
  return <section className="hero" aria-labelledby="hero-title">
    <div className="hero-copy wrap">
      <p className="eyebrow">{section?.eyebrow || "P1 · Overview"}</p>
      <h1 id="hero-title">{project.title}</h1>
      <p className="hero-summary"><RichText value={project.summary} /></p>
      <dl className="meta">
        {project.role && <div><dt>Role</dt><dd>{project.role}</dd></div>}
        {project.period && <div><dt>Period</dt><dd>{project.period}</dd></div>}
      </dl>
    </div>
    <div className={`hero-media ${project.hero ? "has-image" : "placeholder"}`}>
      {project.hero ? <Image src={project.hero.url} alt={project.hero.alt} fill priority sizes="100vw" /> :
        <div className="fallback-art" role="img" aria-label="Notion에서 실제 제품 화면을 추가할 수 있는 자리">
          <span>PILLGRAM</span><div className="pill" /><small>Product screen · Connect in Notion</small>
        </div>}
    </div>
  </section>;
}
