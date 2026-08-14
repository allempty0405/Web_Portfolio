import Image from "next/image";
import type { Section } from "@/lib/portfolio";
import { RichText } from "./rich-text";

export function Bottleneck({ section }: { section: Section }) {
  const values = section.items.map((item) => item.value).filter((value): value is number => value !== undefined);
  const bottleneck = values.length ? Math.min(...values) : undefined;
  return <section className="bottleneck wrap" aria-labelledby="bottleneck-title">
    <header className="section-intro">
      <p className="eyebrow">{section.eyebrow || "P2 · Bottleneck"}</p>
      <h2 id="bottleneck-title">{section.title}</h2>
      <p><RichText value={section.body} /></p>
    </header>
    {section.items.length > 0 && <div className="flow-layout">
      <ol className="flow" aria-label="제품 흐름">
        {section.items.map((item, index) => <li key={item.id}>
          <span className="flow-index">{String(index + 1).padStart(2, "0")}</span><span>{item.label}</span>
        </li>)}
      </ol>
      <figure className="chart" aria-labelledby="chart-caption">
        <figcaption id="chart-caption">Shared baseline · 100%</figcaption>
        <div className="axis" aria-hidden="true"><span>0</span><span>50</span><span>100%</span></div>
        {section.items.map((item) => {
          const isBottleneck = item.value === bottleneck && item.value !== 100;
          return <div className={`bar-row ${isBottleneck ? "is-bottleneck" : ""}`} key={item.id}>
            <div className="bar-label"><span>{item.label}</span>{item.note && <small>{item.note}</small>}</div>
            <div className="bar-track"><div className="bar-fill" style={{ "--bar": `${Math.max(0, Math.min(100, item.value ?? 0))}%` } as React.CSSProperties} /></div>
            <strong>{item.value === undefined ? "—" : `${item.value}%`}</strong>
          </div>;
        })}
      </figure>
    </div>}
    {section.quote && <blockquote>“{section.quote}”</blockquote>}
    {section.media && <figure className="section-media"><Image src={section.media.url} alt={section.media.alt} width={1600} height={1000} sizes="(max-width: 760px) 100vw, 1200px" /></figure>}
  </section>;
}
