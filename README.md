# 엄마샘 매칭 (Eommasaem Matching) — 프로토타입

> 다문화·조손가정 1:1 학습돌봄 LLM 매칭 플랫폼
> 2026 성평등가족 공공·AI 데이터 융복합 아이디어 및 분석활용 공모 — 응모자 김현실

## 핵심 기능
- **/match** — 가정 신청 → LLM 매칭 → 추천 멘토 Top-3
- **/mentor** — 멘토 등록 (mock)
- **/coteach** — Claude Haiku 4.5 스트리밍 학습계획·번역·문화 팁
- **/dashboard** — 17개 시도 Care-Gap Index 시각화
- **/about** — 데이터·기술·차별성

## 실행

```bash
npm install
cp .env.local.example .env.local   # 또는 직접 작성
# .env.local에 ANTHROPIC_API_KEY=sk-ant-... 입력 (없어도 폴백 동작)
npm run dev
```

`http://localhost:3000` 접속.

## 환경변수

| 변수 | 필수 | 설명 |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | 선택 | 미설정 시 룰 기반/정적 샘플 폴백 |

## Vercel 배포

```bash
vercel link
vercel env add ANTHROPIC_API_KEY production
vercel --prod
```

리전은 `vercel.json`에서 `icn1` 고정.

## 활용 데이터 (공공데이터포털 ID)
- 15156366 한국건강가정진흥원_아이돌봄서비스 OCR 샘플
- 15063160 여성가족부_아이돌봄서비스제공기관_20241209
- 15054982 여성가족부_가족실태조사_20210901
- 15096296 전국사회복지시설표준데이터
- 3072079 성평등가족부_국가성평등지수_20241220
- (보조) 학교 기초학력 진단평가 결과 (교육부 공개)

## 디렉터리

```
app/           Next.js App Router 페이지·API
data/          mentor_pool / care_gap_index / family_sample
lib/           anthropic.ts (LLM), match.ts (룰), types.ts
public/        favicon
```

## 기술 스택
- Next.js 16 + React 19 + TypeScript (strict)
- Tailwind CSS v4
- @anthropic-ai/sdk ^0.92.0 — `claude-haiku-4-5-20251001`
- recharts, zod, lucide-react

본 사이트는 프로토타입이며 실제 매칭은 본 운영 단계에서 신원확인(범죄경력 조회) 등을 거칩니다.
