// 공통 타입 정의
export type Grade = '초저' | '초고' | '중' | '고';
export type HomeLanguage = '한국어' | '베트남어' | '중국어' | '필리핀어' | '러시아어';
export type Slot =
  | 'weekday-morning'
  | 'weekday-afternoon'
  | 'weekday-evening'
  | 'weekend-morning'
  | 'weekend-afternoon'
  | 'weekend-evening';

export interface Mentor {
  id: string;
  name: string;
  major: string;
  languages: string[];
  slots: Slot[];
  sigungu: string;
  subjects: string[];
  bio: string;
}

export interface FamilyProfile {
  child_grade: Grade;
  subjects: string[];
  home_language: HomeLanguage;
  slots: Slot[];
  dong: string;
}

export interface MatchScore {
  mentor: Mentor;
  score: number;
  breakdown: {
    language: number;
    time: number;
    subject: number;
    distance: number;
  };
  reason?: string;
}
