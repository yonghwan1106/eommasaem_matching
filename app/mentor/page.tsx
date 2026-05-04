'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MentorPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [bio, setBio] = useState('');
  const [languages, setLanguages] = useState<string[]>(['한국어']);
  const [slots, setSlots] = useState<string[]>(['weekday-evening']);

  const toggle = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl font-bold text-[var(--color-primary)] mb-2">
        ❀ 멘토 등록
      </h1>
      <p className="text-[var(--color-muted)] mb-8">
        은퇴교사·교대생·경력단절여성·이주여성 등 누구든 환영합니다. 등록 후 AI 코티칭 도구를 미리 체험해 보실 수 있습니다.
      </p>

      {!submitted ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
            setTimeout(() => {
              const el = document.getElementById('demo');
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 80);
          }}
          className="card grid gap-5"
        >
          <div>
            <label className="text-sm font-semibold text-[var(--color-primary)] block mb-1">
              이름
            </label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required aria-label="이름" />
          </div>
          <div>
            <label className="text-sm font-semibold text-[var(--color-primary)] block mb-1">
              전공·경력
            </label>
            <input
              className="input"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="예: 초등교육 (은퇴교사 35년)"
              required
              aria-label="전공 경력"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[var(--color-primary)] block mb-2">
              가능 언어
            </label>
            <div className="flex gap-2 flex-wrap">
              {['한국어', '영어', '베트남어', '중국어', '필리핀어', '러시아어'].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLanguages(toggle(languages, l))}
                  aria-pressed={languages.includes(l)}
                  className={`px-3 py-1.5 rounded-full border text-sm ${
                    languages.includes(l)
                      ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                      : 'bg-white border-[var(--color-border)]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-[var(--color-primary)] block mb-2">
              가능 시간대
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                ['weekday-morning', '평일 오전'],
                ['weekday-afternoon', '평일 오후'],
                ['weekday-evening', '평일 저녁'],
                ['weekend-morning', '주말 오전'],
                ['weekend-afternoon', '주말 오후'],
                ['weekend-evening', '주말 저녁'],
              ].map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSlots(toggle(slots, v))}
                  aria-pressed={slots.includes(v)}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    slots.includes(v)
                      ? 'bg-[var(--color-primary-mid)] text-white border-[var(--color-primary-mid)]'
                      : 'bg-white border-[var(--color-border)]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-[var(--color-primary)] block mb-1">
              자기소개 (선택)
            </label>
            <textarea
              className="input"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              aria-label="자기소개"
            />
          </div>
          <button type="submit" className="btn-primary w-fit">
            등록하고 AI 코티칭 체험 →
          </button>
        </form>
      ) : (
        <div className="card bg-[var(--color-soft)] border-[var(--color-soft)]">
          <h2 className="font-serif text-xl font-bold text-[var(--color-primary)]">
            ❀ {name || '멘토'}님, 등록이 완료되었습니다 (데모)
          </h2>
          <p className="text-sm text-[var(--color-ink)] mt-2">
            실제 운영에서는 신원확인(범죄경력 조회)과 오리엔테이션을 거쳐 첫 매칭이 시작됩니다.
          </p>
        </div>
      )}

      <section id="demo" className="mt-12">
        <div className="card">
          <h2 className="font-serif text-2xl font-bold text-[var(--color-primary)]">
            ❀ AI 코티칭 도구 — 멘토를 위한 5분 준비
          </h2>
          <p className="text-sm text-[var(--color-muted)] mt-2">
            학년·과목·아동의 모국어를 입력하면 30분 학습계획·번역 노트·문화 팁이 자동 생성됩니다.
          </p>
          <Link href="/coteach" className="btn-primary mt-4">
            지금 체험해 보기 →
          </Link>
        </div>
      </section>
    </div>
  );
}
