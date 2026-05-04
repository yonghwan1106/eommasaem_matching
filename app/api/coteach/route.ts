// POST /api/coteach — 학년·과목·모국어 받아 학습계획을 스트리밍.
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { streamCoteachPlan } from '@/lib/anthropic';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Body = z.object({
  grade: z.enum(['초저', '초고', '중', '고']),
  subject: z.string().min(1).max(20),
  homeLanguage: z.enum(['한국어', '베트남어', '중국어', '필리핀어', '러시아어']),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = Body.safeParse(json);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: '입력 형식 오류' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const stream = await streamCoteachPlan(parsed.data);
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (e) {
    console.error('coteach error', e);
    return new Response(JSON.stringify({ error: '서버 오류' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
