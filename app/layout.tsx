import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pillgram — Product Design Case Study",
  description: "Pillgram 제품 디자인 케이스 스터디"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
