'use client';

import { useState, type ReactNode } from 'react';

function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /\*\*([^*]+)\*\*|`([^`]+)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      parts.push(<strong key={key++} className="text-[var(--color-primary)] font-bold">{m[1]}</strong>);
    } else if (m[2] !== undefined) {
      parts.push(<code key={key++} className="px-1.5 py-0.5 rounded bg-[var(--color-accent)]/40 text-[var(--color-primary)] text-[0.9em]">{m[2]}</code>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function renderMarkdown(src: string): ReactNode {
  const lines = src.split('\n');
  const blocks: ReactNode[] = [];
  let listBuf: string[] = [];
  let key = 0;
  const flushList = () => {
    if (listBuf.length === 0) return;
    blocks.push(
      <ul key={key++} className="list-disc pl-6 my-2 space-y-1">
        {listBuf.map((it, i) => (
          <li key={i}>{renderInline(it)}</li>
        ))}
      </ul>,
    );
    listBuf = [];
  };
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    const listMatch = line.match(/^(\s*)[-*]\s+(.+)$/);
    if (listMatch) {
      listBuf.push(listMatch[2]);
      continue;
    }
    flushList();
    if (line.trim() === '') {
      blocks.push(<div key={key++} className="h-2" />);
      continue;
    }
    const h = line.match(/^(#{1,6})\s+(.+)$/);
    if (h) {
      const lvl = h[1].length;
      const txt = h[2].replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]\s*/u, '');
      const sizes = ['text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-base', 'text-base'];
      const margins = ['mt-6 mb-3', 'mt-5 mb-2', 'mt-4 mb-2', 'mt-3 mb-1', 'mt-3 mb-1', 'mt-3 mb-1'];
      blocks.push(
        <div
          key={key++}
          className={`font-serif font-bold text-[var(--color-primary)] ${sizes[lvl - 1]} ${margins[lvl - 1]}`}
        >
          {renderInline(txt)}
        </div>,
      );
      continue;
    }
    blocks.push(
      <p key={key++} className="leading-7 text-[var(--color-text)]">
        {renderInline(line)}
      </p>,
    );
  }
  flushList();
  return blocks;
}

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
        <article className="card mt-6 font-sans text-[15px] animate-in">
          {renderMarkdown(output)}
        </article>
      )}
    </div>
  );
}
