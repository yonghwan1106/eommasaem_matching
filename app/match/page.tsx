'use client';

import { useState } from 'react';
import type { MatchScore, Grade, HomeLanguage, Slot } from '@/lib/types';

const SUBJECTS = ['국어', '수학', '영어', '사회', '과학', '음악', '미술'];
const SLOTS: { v: Slot; label: string }[] = [
  { v: 'weekday-morning', label: '평일 오전' },
  { v: 'weekday-afternoon', label: '평일 오후' },
  { v: 'weekday-evening', label: '평일 저녁' },
  { v: 'weekend-morning', label: '주말 오전' },
  { v: 'weekend-afternoon', label: '주말 오후' },
  { v: 'weekend-evening', label: '주말 저녁' },
];
const LANGUAGES: HomeLanguage[] = ['한국어', '베트남어', '중국어', '필리핀어', '러시아어'];
const GRADES: Grade[] = ['초저', '초고', '중', '고'];

export default function MatchPage() {
  const [grade, setGrade] = useState<Grade>('초저');
  const [subjects, setSubjects] = useState<string[]>(['국어', '수학']);
  const [language, setLanguage] = useState<HomeLanguage>('베트남어');
  const [slots, setSlots] = useState<Slot[]>(['weekday-evening']);
  const [dong, setDong] = useState('경기 안산시 원곡동');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchScore[] | null>(null);
  const [llmUsed, setLlmUsed] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  const toggle = <T,>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setResults(null);
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          child_grade: grade,
          subjects,
          home_language: language,
          slots,
          dong,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || '오류');
      setResults(json.results);
      setLlmUsed(json.llm_used);
    } catch (e) {
      setErr(e instanceof Error ? e.message : '오류');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl font-bold text-[var(--color-primary)] mb-2">
        ❀ 가정 신청
      </h1>
      <p className="text-[var(--color-muted)] mb-8">
        자녀와 가정의 정보를 알려 주시면, AI가 가장 잘 맞는 멘토 3명을 추천해 드립니다.
      </p>

      <form onSubmit={submit} className="card grid gap-6">
        {/* 학년 */}
        <div>
          <label className="text-sm font-semibold text-[var(--color-primary)] block mb-2">
            자녀 학년
          </label>
          <div className="flex gap-2 flex-wrap">
            {GRADES.map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => setGrade(g)}
                aria-pressed={grade === g}
                className={`px-4 py-2 rounded-full border ${
                  grade === g
                    ? 'bg-[var(--color-primary)] text-[var(--color-bg)] border-[var(--color-primary)]'
                    : 'bg-white border-[var(--color-border)]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* 과목 */}
        <div>
          <label className="text-sm font-semibold text-[var(--color-primary)] block mb-2">
            과목 (다중선택)
          </label>
          <div className="flex gap-2 flex-wrap">
            {SUBJECTS.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setSubjects(toggle(subjects, s))}
                aria-pressed={subjects.includes(s)}
                className={`px-3 py-1.5 rounded-full border text-sm ${
                  subjects.includes(s)
                    ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                    : 'bg-white border-[var(--color-border)]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 언어 */}
        <div>
          <label className="text-sm font-semibold text-[var(--color-primary)] block mb-2">
            가정 사용 언어
          </label>
          <select
            className="input max-w-xs"
            value={language}
            onChange={(e) => setLanguage(e.target.value as HomeLanguage)}
            aria-label="가정 사용 언어"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* 시간대 */}
        <div>
          <label className="text-sm font-semibold text-[var(--color-primary)] block mb-2">
            가능 시간대 (다중선택)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {SLOTS.map((s) => (
              <button
                type="button"
                key={s.v}
                onClick={() => setSlots(toggle(slots, s.v))}
                aria-pressed={slots.includes(s.v)}
                className={`px-3 py-2 rounded-lg border text-sm ${
                  slots.includes(s.v)
                    ? 'bg-[var(--color-primary-mid)] text-white border-[var(--color-primary-mid)]'
                    : 'bg-white border-[var(--color-border)]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 거주 동 */}
        <div>
          <label className="text-sm font-semibold text-[var(--color-primary)] block mb-2">
            거주 동 (예: 경기 안산시 원곡동)
          </label>
          <input
            className="input"
            value={dong}
            onChange={(e) => setDong(e.target.value)}
            aria-label="거주 동"
          />
        </div>

        <div>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || subjects.length === 0 || slots.length === 0}
          >
            {loading ? 'AI 매칭 중…' : '멘토 추천받기 →'}
          </button>
          {err && <p className="text-sm text-red-700 mt-3">{err}</p>}
        </div>
      </form>

      {results && (
        <section className="mt-10 animate-in">
          <h2 className="font-serif text-2xl font-bold text-[var(--color-primary)] mb-2">
            ❀ 추천 멘토 Top-{results.length}
          </h2>
          <p className="text-xs text-[var(--color-muted)] mb-4">
            추천 이유 생성: {llmUsed ? 'Claude Haiku 4.5 (LLM)' : '룰 기반 폴백 (ANTHROPIC_API_KEY 미설정)'}
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {results.map((r, i) => (
              <div key={r.mentor.id} className="card">
                <div className="flex items-center justify-between mb-2">
                  <span className="tag">#{i + 1} 추천</span>
                  <span className="font-serif text-2xl font-bold text-[var(--color-primary)]">
                    {(r.score * 100).toFixed(0)}점
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[var(--color-primary)]">
                  {r.mentor.name}
                </h3>
                <p className="text-sm text-[var(--color-muted)] mb-2">{r.mentor.major}</p>
                <p className="text-sm text-[var(--color-ink)] mb-3">
                  {r.mentor.languages.join(' · ')} · {r.mentor.sigungu}
                </p>
                <p className="text-sm text-[var(--color-primary)] bg-[var(--color-soft)] p-3 rounded-lg">
                  ❀ {r.reason}
                </p>
                <div className="mt-3 grid grid-cols-4 gap-1 text-xs text-[var(--color-muted)]">
                  <div>언어 {(r.breakdown.language * 100).toFixed(0)}</div>
                  <div>시간 {(r.breakdown.time * 100).toFixed(0)}</div>
                  <div>과목 {(r.breakdown.subject * 100).toFixed(0)}</div>
                  <div>거리 {(r.breakdown.distance * 100).toFixed(0)}</div>
                </div>
              </div>
            ))}
          </div>
          {results.length === 0 && (
            <div className="card text-center text-[var(--color-muted)]">
              조건에 맞는 멘토가 부족합니다. 시간대를 더 선택하시면 매칭 가능성이 올라갑니다.
            </div>
          )}
        </section>
      )}
    </div>
  );
}
