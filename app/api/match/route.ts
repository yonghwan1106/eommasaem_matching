// POST /api/match — 가정 프로필을 받아 멘토 Top-3 추천. LLM이 추천 이유 한 문장 생성.
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import mentorPool from '@/data/mentor_pool.json';
import { rankMentors } from '@/lib/match';
import { generateMatchReason, hasApiKey } from '@/lib/anthropic';
import type { Mentor } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Body = z.object({
  child_grade: z.enum(['초저', '초고', '중', '고']),
  subjects: z.array(z.string()).min(1).max(6),
  home_language: z.enum(['한국어', '베트남어', '중국어', '필리핀어', '러시아어']),
  slots: z
    .array(
      z.enum([
        'weekday-morning',
        'weekday-afternoon',
        'weekday-evening',
        'weekend-morning',
        'weekend-afternoon',
        'weekend-evening',
      ]),
    )
    .min(1),
  dong: z.string().min(1).max(60),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = Body.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: '입력 형식 오류', detail: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const family = parsed.data;
    const top = rankMentors(mentorPool as Mentor[], family, 3);

    // LLM 추천 이유 생성 (병렬). KEY 없으면 폴백 문구.
    const reasons = await Promise.all(
      top.map((s) => generateMatchReason(s.mentor, family)),
    );
    const enriched = top.map((s, i) => ({ ...s, reason: reasons[i] }));

    return NextResponse.json({
      family,
      results: enriched,
      llm_used: hasApiKey(),
    });
  } catch (e) {
    console.error('match error', e);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
