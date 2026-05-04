// 룰 기반 매칭 점수 계산
// 가중치: 언어 0.4, 시간대 0.3, 과목 0.2, 거리(시군구 키워드) 0.1
import type { Mentor, FamilyProfile, MatchScore } from './types';

function jaccard<T>(a: T[], b: T[]): number {
  const A = new Set(a);
  const B = new Set(b);
  if (A.size === 0 && B.size === 0) return 0;
  let inter = 0;
  A.forEach((x) => {
    if (B.has(x)) inter += 1;
  });
  const union = A.size + B.size - inter;
  return union === 0 ? 0 : inter / union;
}

function languageScore(mentorLangs: string[], homeLanguage: string): number {
  // 한국어는 기본 0.5점, 모국어 일치 시 추가 0.5점
  const hasKorean = mentorLangs.some((l) => l.includes('한국'));
  const hasHome =
    homeLanguage === '한국어'
      ? hasKorean
      : mentorLangs.some(
          (l) =>
            l.includes(homeLanguage.replace('어', '')) ||
            l === homeLanguage,
        );
  if (homeLanguage === '한국어') return hasKorean ? 1 : 0.4;
  return (hasKorean ? 0.4 : 0) + (hasHome ? 0.6 : 0);
}

function subjectScore(mentorSubjects: string[], familySubjects: string[]): number {
  if (familySubjects.length === 0) return 0.5;
  const matched = familySubjects.filter((s) => mentorSubjects.includes(s)).length;
  return matched / familySubjects.length;
}

function distanceScore(mentorSigungu: string, familyDong: string): number {
  // 시군구 문자열에 dong 키워드가 등장하면 가까운 것으로 간주(데모용)
  if (!familyDong) return 0.5;
  const tokens = familyDong.split(/\s+/).filter(Boolean);
  for (const t of tokens) {
    if (mentorSigungu.includes(t)) return 1;
  }
  // 시도 단위만 일치해도 부분 점수
  const sidoMatch = ['서울','부산','대구','인천','광주','대전','울산','세종','경기','강원','충북','충남','전북','전남','경북','경남','제주'];
  for (const sido of sidoMatch) {
    if (mentorSigungu.startsWith(sido) && familyDong.startsWith(sido)) return 0.6;
  }
  return 0.2;
}

export function scoreMentor(mentor: Mentor, family: FamilyProfile): MatchScore {
  const lang = languageScore(mentor.languages, family.home_language);
  const time = jaccard(mentor.slots, family.slots);
  const subj = subjectScore(mentor.subjects, family.subjects);
  const dist = distanceScore(mentor.sigungu, family.dong);
  const score = 0.4 * lang + 0.3 * time + 0.2 * subj + 0.1 * dist;
  return {
    mentor,
    score: Math.round(score * 100) / 100,
    breakdown: {
      language: Math.round(lang * 100) / 100,
      time: Math.round(time * 100) / 100,
      subject: Math.round(subj * 100) / 100,
      distance: Math.round(dist * 100) / 100,
    },
  };
}

export function rankMentors(
  mentors: Mentor[],
  family: FamilyProfile,
  topK: number = 3,
): MatchScore[] {
  return mentors
    .map((m) => scoreMentor(m, family))
    .filter((s) => s.score > 0.15)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
