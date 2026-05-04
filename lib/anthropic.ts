// Anthropic Claude Haiku wrapper — 매칭 추천 이유 생성, 코티칭 학습계획 스트리밍
import Anthropic from '@anthropic-ai/sdk';
import type { Mentor, FamilyProfile } from './types';

const MODEL = 'claude-haiku-4-5-20251001';

export function hasApiKey(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

function client(): Anthropic {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

const MATCH_SYSTEM = `당신은 다문화·조손가정 학습돌봄 매칭 코디네이터입니다.
가정과 멘토 프로필을 받아 두 사람이 잘 맞는 이유를 한국어 한 문장(40자 이내)으로 따뜻하게 설명합니다.
- 절대 단정·진단·우열 비교 금지. "~하실 수 있어 든든합니다" 같은 표현 권장.
- 가정의 모국어·학년·과목·시간대 중 가장 유의미한 강점 1~2개에 집중.
- 멘토 이름과 가정 학년만 자연스럽게 언급, 나머지는 함의로.`;

export async function generateMatchReason(
  mentor: Mentor,
  family: FamilyProfile,
): Promise<string> {
  if (!hasApiKey()) {
    return `${mentor.name} 멘토님이 ${family.child_grade} ${family.subjects.join('·')} 학습을 도울 수 있어요.`;
  }
  const prompt = `[가정] 자녀 학년 ${family.child_grade}, 과목 ${family.subjects.join('·')}, 가정 사용 언어 ${family.home_language}, 시간대 ${family.slots.join('/')}, 동 ${family.dong}
[멘토] ${mentor.name} (${mentor.major}) · 사용언어 ${mentor.languages.join('·')} · 가능과목 ${mentor.subjects.join('·')} · 시간대 ${mentor.slots.join('/')} · ${mentor.sigungu}
[멘토 한줄] ${mentor.bio}

이 가정과 멘토가 잘 맞는 이유를 한 문장(40자 이내)으로 작성해 주세요.`;
  try {
    const res = await client().messages.create({
      model: MODEL,
      max_tokens: 120,
      system: [
        { type: 'text', text: MATCH_SYSTEM, cache_control: { type: 'ephemeral' } },
      ],
      messages: [{ role: 'user', content: prompt }],
    });
    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();
    return text || `${mentor.name} 멘토와 잘 맞을 거예요.`;
  } catch {
    return `${mentor.name} 멘토님이 ${family.subjects.join('·')} 학습을 함께해요.`;
  }
}

const COTEACH_SYSTEM = `당신은 다문화·조손가정 1:1 학습돌봄 멘토를 돕는 AI 코티칭 코치입니다.
멘토에게 "주간 30분 학습계획 + 가정 모국어 번역 노트 + 문화이해 팁"을 한국어로 작성해 줍니다.

[출력 형식]
## 1. 주간 학습계획 (30분 × 1회)
- 도입 (5분): ...
- 전개 (20분): ...
- 마무리 (5분): ...

## 2. 가정 모국어 번역 노트
- 핵심 학습용어 5개를 모국어와 함께 표로.

## 3. 문화이해 팁 (멘토용)
- 가정 배경을 존중하는 의사소통 팁 2~3가지.

따뜻하고 구체적으로, 잘난 척하지 않게 작성하세요.`;

export async function streamCoteachPlan(args: {
  grade: string;
  subject: string;
  homeLanguage: string;
}): Promise<ReadableStream<Uint8Array>> {
  const { grade, subject, homeLanguage } = args;
  const prompt = `학년: ${grade}\n과목: ${subject}\n가정 모국어: ${homeLanguage}\n\n위 조건으로 이번 주 1회 30분 학습 세션 준비물을 작성해 주세요.`;

  if (!hasApiKey()) {
    // 정적 샘플 스트림 — KEY 미설정 폴백
    const sample = staticSample(grade, subject, homeLanguage);
    return new ReadableStream({
      start(controller) {
        const enc = new TextEncoder();
        let i = 0;
        const chunkSize = 24;
        const tick = () => {
          if (i >= sample.length) {
            controller.close();
            return;
          }
          controller.enqueue(enc.encode(sample.slice(i, i + chunkSize)));
          i += chunkSize;
          setTimeout(tick, 18);
        };
        tick();
      },
    });
  }

  const stream = await client().messages.stream({
    model: MODEL,
    max_tokens: 1200,
    system: [
      { type: 'text', text: COTEACH_SYSTEM, cache_control: { type: 'ephemeral' } },
    ],
    messages: [{ role: 'user', content: prompt }],
  });

  const enc = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(enc.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });
}

function staticSample(grade: string, subject: string, lang: string): string {
  return `## 1. 주간 학습계획 (30분 × 1회)
- 도입 (5분): ${grade} ${subject} 핵심어 3개를 그림카드로 환기. 아동에게 모국어(${lang})로 한 단어를 말해 보게 합니다.
- 전개 (20분): 교과서 1단원 핵심 문장 3개를 한국어→${lang} 짝맞춤. 짧은 문제 4개를 함께 풀고, 멘토가 풀이 과정을 천천히 설명.
- 마무리 (5분): 오늘 배운 단어를 한 줄 일기로 적어 보고 칭찬으로 마무리.

## 2. 가정 모국어 번역 노트 (예시)
| 한국어 | ${lang} |
| --- | --- |
| 안녕하세요 | (현지어) |
| 숙제 | (현지어) |
| 내일 | (현지어) |
| 잘했어요 | (현지어) |
| 함께 | (현지어) |

## 3. 문화이해 팁 (멘토용)
- 아이가 한국어 발음에 자신 없을 때 모국어로 먼저 말하게 한 뒤 함께 한국어로 옮겨 적어 보세요.
- 가정에서는 어른께 직접 학습 진도를 묻기보다 일주일 사진 한 장으로 부드럽게 공유합니다.
- 칭찬은 결과보다 "오늘 한 시도"에 초점을 맞춥니다.

[알림] ANTHROPIC_API_KEY가 설정되지 않아 정적 샘플로 출력되었습니다. 실제 환경에서는 Claude Haiku 4.5가 가정·멘토 프로필 맞춤형으로 매번 새로 생성합니다.`;
}
