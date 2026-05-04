// GET /api/care-gap — Care-Gap Index 데이터 반환
import { NextResponse } from 'next/server';
import careGap from '@/data/care_gap_index.json';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(careGap);
}
