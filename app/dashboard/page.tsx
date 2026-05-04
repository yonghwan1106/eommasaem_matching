'use client';

import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface SidoRow {
  sido: string;
  multicultural_ratio: number;
  grandparent_ratio: number;
  learning_gap: number;
  mentor_supply: number;
  care_gap_index: number;
}
interface PriorityRow {
  sido: string;
  sigungu: string;
  dong: string;
  care_gap_index: number;
  priority: boolean;
}

function colorFor(idx: number): string {
  if (idx >= 80) return '#173d33';
  if (idx >= 65) return '#2d6e5a';
  if (idx >= 50) return '#5fa48e';
  if (idx >= 35) return '#a9cabb';
  return '#e1efe7';
}

export default function DashboardPage() {
  const [sido, setSido] = useState<SidoRow[]>([]);
  const [priority, setPriority] = useState<PriorityRow[]>([]);

  useEffect(() => {
    fetch('/api/care-gap')
      .then((r) => r.json())
      .then((d) => {
        setSido(d.sido);
        setPriority(d.priority_dong);
      });
  }, []);

  const sorted = [...sido].sort((a, b) => b.care_gap_index - a.care_gap_index);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl font-bold text-[var(--color-primary)] mb-2">
        ❀ 돌봄결손지수 (Care-Gap Index)
      </h1>
      <p className="text-[var(--color-muted)] mb-8">
        다문화·조손 비율 × 학습결손 ÷ 멘토공급 — 17개 시도 + 우선매칭 동 Top-20.
      </p>

      {/* 17 sido grid */}
      <section className="mb-10">
        <h2 className="font-serif text-xl font-bold mb-3">17개 시도 격자</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {sido.map((s) => (
            <div
              key={s.sido}
              className="rounded-xl p-3 text-white"
              style={{ background: colorFor(s.care_gap_index) }}
              title={`다문화 ${s.multicultural_ratio}% · 조손 ${s.grandparent_ratio}%`}
            >
              <div className="text-xs opacity-90">{s.sido}</div>
              <div className="font-serif text-2xl font-bold">{s.care_gap_index}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bar chart */}
      <section className="card mb-10">
        <h2 className="font-serif text-xl font-bold mb-3">시도별 결손지수</h2>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={sorted} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
              <CartesianGrid stroke="#e6decf" />
              <XAxis dataKey="sido" interval={0} angle={-30} textAnchor="end" height={50} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="care_gap_index" fill="#2d6e5a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 4 sub indicators */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {[
          ['다문화 비율', 'multicultural_ratio', '%'],
          ['조손 비율', 'grandparent_ratio', '%'],
          ['학습 결손(년)', 'learning_gap', '년'],
          ['멘토 공급(지수)', 'mentor_supply', ''],
        ].map(([label, key, unit]) => {
          const top3 = [...sido]
            .sort((a, b) => {
              const av = a[key as keyof SidoRow] as number;
              const bv = b[key as keyof SidoRow] as number;
              return key === 'mentor_supply' ? av - bv : bv - av;
            })
            .slice(0, 3);
          return (
            <div key={label} className="card">
              <div className="text-xs text-[var(--color-muted)]">
                {label} {key === 'mentor_supply' ? '하위 3' : '상위 3'}
              </div>
              <ul className="mt-2 space-y-1 text-sm">
                {top3.map((t) => (
                  <li key={t.sido} className="flex justify-between">
                    <span>{t.sido}</span>
                    <span className="font-bold text-[var(--color-primary)]">
                      {String(t[key as keyof SidoRow])}
                      {unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      {/* Priority dong table */}
      <section className="card">
        <h2 className="font-serif text-xl font-bold mb-3">❀ 우선매칭 동 Top-20</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left border-b border-[var(--color-border)]">
              <tr>
                <th className="py-2">순위</th>
                <th>시도</th>
                <th>시군구</th>
                <th>읍·면·동</th>
                <th className="text-right">결손지수</th>
                <th>우선</th>
              </tr>
            </thead>
            <tbody>
              {priority.map((p, i) => (
                <tr key={p.sido + p.sigungu + p.dong} className="border-b border-[var(--color-border)]/40">
                  <td className="py-1.5">{i + 1}</td>
                  <td>{p.sido}</td>
                  <td>{p.sigungu}</td>
                  <td>{p.dong}</td>
                  <td className="text-right font-bold text-[var(--color-primary)]">{p.care_gap_index}</td>
                  <td>{p.priority ? '❀' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
