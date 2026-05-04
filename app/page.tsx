import Link from 'next/link';

const stats = [
  { label: '다문화 가정 자녀', value: '17만 명', sub: '2025 통계청' },
  { label: '조손가정', value: '12만 가구', sub: '여성가족부 가족실태' },
  { label: '현재 매칭률', value: '35%', sub: '자원봉사 학습멘토' },
  { label: '3년 목표', value: '5,000쌍', sub: '엄마샘 매칭' },
];

const flow = [
  ['1', '데이터 융합', '5종 공공데이터 → Care-Gap Index'],
  ['2', '가정 가입', '카카오 인증 · 다국어 폼'],
  ['3', '멘토 가입', '여성새일·교대생·은퇴교사 채널'],
  ['4', 'LLM 매칭', '언어·과목·시간대·거리 가중'],
  ['5', 'AI 코티칭', '학습계획·번역·문화 노트'],
  ['6', '6주 리포트', '멘토·가정·자치구 공유'],
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <p className="tag mb-5">❀ 2026 성평등가족 공공·AI 데이터 융복합 공모</p>
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-[var(--color-primary)] leading-tight">
          AI가 다리를 놓는다.
          <br />
          <span className="text-[var(--color-primary-mid)]">
            다문화·조손가정 1:1 학습돌봄.
          </span>
        </h1>
        <p className="mt-6 text-lg text-[var(--color-muted)] max-w-2xl">
          돌봄이 부족한 곳에, 가르칠 사람이 가도록.
          <br />
          공공데이터 5종을 동(洞) 단위로 융합하고, LLM이 가정과 멘토를 따뜻하게 잇습니다.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/match" className="btn-primary">
            가정 신청하기 →
          </Link>
          <Link href="/mentor" className="btn-soft">
            멘토 등록하기
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card text-center">
            <div className="text-sm text-[var(--color-muted)]">{s.label}</div>
            <div className="font-serif text-3xl font-bold text-[var(--color-primary)] mt-2">
              {s.value}
            </div>
            <div className="text-xs text-[var(--color-muted)] mt-1">{s.sub}</div>
          </div>
        ))}
      </section>

      {/* Flow */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-serif text-3xl font-bold text-[var(--color-primary)] mb-3">
          ❀ 6단계 작동 흐름
        </h2>
        <p className="text-[var(--color-muted)] mb-10">
          분산된 공공데이터를 동 단위로 융합 → LLM 매칭 → AI 코티칭 → 성과 리포트.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {flow.map(([n, t, d]) => (
            <div key={n} className="card flex gap-4">
              <div className="text-3xl font-serif font-bold text-[var(--color-accent)] w-10 shrink-0">
                {n}
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-primary)]">{t}</h3>
                <p className="text-sm text-[var(--color-muted)] mt-1">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Differentiation */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="card bg-[var(--color-soft)] border-[var(--color-soft)]">
          <h2 className="font-serif text-2xl font-bold text-[var(--color-primary)] mb-4">
            ❀ 무엇이 다른가
          </h2>
          <ul className="space-y-2 text-sm text-[var(--color-ink)]">
            <li>• 동(洞) 단위 결손지수로 <b>사각지대를 자동 식별</b>합니다.</li>
            <li>• LLM이 <b>언어·시간대·과목·거리</b>를 종합해 멘토 Top-3를 추천합니다.</li>
            <li>• 멘토에게 <b>다국어 번역 + 문화이해 + 학습계획</b>을 자동 제공합니다.</li>
            <li>• 무료 · 결손가정 우선 · 공공데이터 검증 — 사설 매칭과 다릅니다.</li>
          </ul>
          <Link href="/about" className="inline-block mt-5 text-sm font-semibold text-[var(--color-primary)] underline">
            데이터·기술·차별성 자세히 →
          </Link>
        </div>
      </section>
    </div>
  );
}
