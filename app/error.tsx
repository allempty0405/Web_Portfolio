"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="error-state"><p className="eyebrow">Something went wrong</p><h1>콘텐츠를 표시할 수 없습니다.</h1><p>잠시 후 다시 시도해 주세요.</p><button onClick={reset}>다시 시도</button></main>;
}
