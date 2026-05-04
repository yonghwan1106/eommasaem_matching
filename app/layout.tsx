import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: '엄마샘 매칭 — 다문화·조손가정 1:1 학습돌봄 LLM 매칭',
  description:
    '공공데이터 융합 + LLM 매칭 + AI 코티칭. 돌봄이 부족한 곳에, 가르칠 사람이 가도록.',
  openGraph: {
    title: '엄마샘 매칭',
    description: 'AI가 다리를 놓는다 — 다문화·조손가정 1:1 학습돌봄 LLM 매칭 플랫폼',
    type: 'website',
  },
};

function Header() {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[var(--color-accent)] text-2xl">❀</span>
          <span className="font-serif text-xl font-bold text-[var(--color-primary)]">
            엄마샘 매칭
          </span>
        </Link>
        <nav className="flex gap-1 text-sm">
          {[
            ['/match', '가정신청'],
            ['/mentor', '멘토등록'],
            ['/coteach', 'AI 코티칭'],
            ['/dashboard', '결손지수'],
            ['/about', '소개'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-full text-[var(--color-ink)] hover:bg-[var(--color-soft)] transition"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-20 py-8 text-sm text-[var(--color-muted)]">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-3">
        <div>
          <span className="text-[var(--color-accent)]">❀</span> 엄마샘 매칭 프로토타입 · 2026 성평등가족 공공·AI 데이터 융복합 공모
        </div>
        <div>응모자 김현실 · 데이터: 공공데이터포털·교육부 공개데이터</div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=Gowun+Batang:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
