import type { Project } from "@/lib/portfolio";

/** Development-only content. Replace every editable field through Notion in production. */
export const pillgramFallback: Project = {
  id: "fallback-pillgram",
  slug: "pillgram",
  title: "Pillgram",
  summary: [{ text: "복약 경험의 병목을 발견하고, 더 나은 제품 흐름을 설계한 과정" }],
  role: "Product Design",
  period: "Case study",
  sections: [
    {
      id: "p1",
      eyebrow: "P1 · Overview",
      title: "Pillgram",
      body: [{ text: "Notion에 프로젝트 소개와 실제 제품 이미지를 연결해 주세요." }],
      items: []
    },
    {
      id: "p2",
      eyebrow: "P2 · Bottleneck",
      title: "79.6%에서 멈춘 흐름",
      body: [{ text: "공통 기준선에서 각 단계를 비교해 가장 큰 병목을 즉시 확인합니다." }],
      items: [
        { id: "entry", label: "진입", value: 100, note: "비교 기준", order: 1 },
        { id: "bottleneck", label: "병목 구간", value: 79.6, note: "핵심 병목", order: 2 }
      ]
    }
  ]
};
