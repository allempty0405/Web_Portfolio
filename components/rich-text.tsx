import type { RichText as RichTextValue } from "@/lib/portfolio";

export function RichText({ value }: { value: RichTextValue }) {
  return value.map((part, index) => {
    const text = part.bold ? <strong>{part.text}</strong> : part.italic ? <em>{part.text}</em> : part.text;
    return part.href ? <a key={index} href={part.href}>{text}</a> : <span key={index}>{text}</span>;
  });
}
