'use client';

import { useState } from 'react';

const GRADES = ['초저', '초고', '중', '고'] as const;
const SUBJECTS = ['국어', '수학', '영어', '사회', '과학'];
const LANGS = ['한국어', '베트남어', '중국어', '필리핀어', '러시아어'] as const;

export default function CoteachPage() {
  const [grade, setGrade] = useState<(typeof GRADES)[number]>('초저');
  const [subject, setSubject] = useState('국어');
  const [lang, setLang] = useState<(typeof LANGS)[number]>('베트남어');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  async function generate() {
    setOutput('');
    setLoading(true);
    try {
      const res = await fetch('/api/coteach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, subject, homeLanguage: lang }),
      });
      if (!res.ok || !res.body) {
        setOutput('오류가 발생했습니다.');
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setOutput(acc);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl font-bold text-[var(--color-primary)] mb-2">
        ❀ AI 코티칭 — 30분 학습계획 자동 생성
      </h1>
      <p className="text-[var(--color-muted)] mb-8">
        학년·과목·아동 모국어를 선택하면 Claude Haiku 4.5가 학습계획·번역 노트·문화 팁을 즉시 생성합니다.
      </p>

      <div className="card grid md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold block mb-1">학년</label>
          <select className="input" value={grade} onChange={(e) => setGrade(e.target.value as typeof grade)}>
            {GRADES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold block mb-1">과목</label>
          <select className="input" value={subject} onChange={(e) => setSubject(e.target.value)}>
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold block mb-1">아동 모국어</label>
          <select className="input" value={lang} onChange={(e) => setLang(e.target.value as typeof lang)}>
            {LANGS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={generate} disabled={loading} className="btn-primary mt-5">
        {loading ? '생성 중…' : '주간 학습계획 생성 →'}
      </button>

      {output && (
        <article className="card mt-6 whitespace-pre-wrap font-sans text-sm leading-7 animate-in">
          {output}
        </article>
      )}
    </div>
  );
}
