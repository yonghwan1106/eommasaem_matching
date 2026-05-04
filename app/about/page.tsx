export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-serif text-3xl font-bold text-[var(--color-primary)] mb-2">
        ❀ 엄마샘 매칭 — 데이터·기술·차별성
      </h1>
      <p className="text-[var(--color-muted)] mb-10">
        2026 성평등가족 공공·AI 데이터 융복합 아이디어 및 분석활용 공모 응모작.
      </p>

      <section className="mb-10">
        <h2 className="font-serif text-2xl font-bold text-[var(--color-primary)] mb-3">
          1. 활용 데이터셋 (5종 + 보조)
        </h2>
        <div className="card">
          <table className="w-full text-sm">
            <thead className="text-left border-b border-[var(--color-border)]">
              <tr>
                <th className="py-2">구분</th>
                <th>데이터셋명 (공공데이터포털 공식명)</th>
                <th>ID</th>
                <th>활용</th>
              </tr>
            </thead>
            <tbody className="[&>tr]:border-b [&>tr]:border-[var(--color-border)]/40">
              <tr>
                <td className="py-2">주</td>
                <td>한국건강가정진흥원_아이돌봄서비스 OCR 샘플 데이터</td>
                <td>15156366</td>
                <td>이용·신청 현황 동 단위 추정</td>
              </tr>
              <tr>
                <td className="py-2">주</td>
                <td>여성가족부_아이돌봄서비스제공기관_20241209</td>
                <td>15063160</td>
                <td>제공기관 분포·공급 격차</td>
              </tr>
              <tr>
                <td className="py-2">보조</td>
                <td>여성가족부_가족실태조사_20210901</td>
                <td>15054982</td>
                <td>다문화·한부모·조손 분포</td>
              </tr>
              <tr>
                <td className="py-2">보조</td>
                <td>전국사회복지시설표준데이터</td>
                <td>15096296</td>
                <td>시설 인프라 정규화</td>
              </tr>
              <tr>
                <td className="py-2">보조</td>
                <td>성평등가족부_국가성평등지수_20241220</td>
                <td>3072079</td>
                <td>시도 성평등 환경 가중치</td>
              </tr>
              <tr>
                <td className="py-2">보조</td>
                <td>학교 기초학력 진단평가 결과 (교육부 공개)</td>
                <td>—</td>
                <td>학습결손 동 단위 가중치</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-2xl font-bold text-[var(--color-primary)] mb-3">
          2. 기술 아키텍처
        </h2>
        <div className="card grid md:grid-cols-2 gap-3 text-sm">
          <div>
            <b className="text-[var(--color-primary)]">데이터</b>
            <p className="text-[var(--color-muted)]">
              Python(pandas, geopandas) + DuckDB로 5종 데이터를 행정동 코드로 융합 → Care-Gap Index 월 갱신.
            </p>
          </div>
          <div>
            <b className="text-[var(--color-primary)]">매칭 엔진</b>
            <p className="text-[var(--color-muted)]">
              임베딩 코사인 + 시간대 자카드 + 거리·언어 가중치. 본 데모는 룰 기반 4지표 가중합.
            </p>
          </div>
          <div>
            <b className="text-[var(--color-primary)]">LLM 코티칭</b>
            <p className="text-[var(--color-muted)]">
              Claude Haiku 4.5(현재 데모) 또는 GPT-4o-mini. 학습계획·번역·문화 노트를 멘토에게 즉시 제공.
            </p>
          </div>
          <div>
            <b className="text-[var(--color-primary)]">프런트·배포</b>
            <p className="text-[var(--color-muted)]">
              Next.js 16 + Tailwind v4 + Vercel(icn1). 다국어 PWA 확장 가능.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-2xl font-bold text-[var(--color-primary)] mb-3">
          3. 무엇이 다른가
        </h2>
        <div className="card">
          <table className="w-full text-sm">
            <thead className="text-left border-b border-[var(--color-border)]">
              <tr>
                <th className="py-2">비교 대상</th>
                <th>한계</th>
                <th>엄마샘 매칭 차별점</th>
              </tr>
            </thead>
            <tbody className="[&>tr]:border-b [&>tr]:border-[var(--color-border)]/40">
              <tr>
                <td className="py-2">아이돌봄서비스</td>
                <td>공급 부족·다문화 신청 저조</td>
                <td>공급 부족 동 자동 식별 + 자원봉사 풀 확장</td>
              </tr>
              <tr>
                <td className="py-2">교육부 학습멘토링</td>
                <td>학교 단위 운영, 언어 미지원</td>
                <td>동 단위 + 다국어 + 문화 노트</td>
              </tr>
              <tr>
                <td className="py-2">사설 학습 매칭 앱</td>
                <td>비용 부담</td>
                <td>무료·결손가정 우선·공공데이터 검증</td>
              </tr>
              <tr>
                <td className="py-2">단순 자원봉사 1365</td>
                <td>매칭 알고리즘 부재</td>
                <td>LLM 임베딩 매칭 + AI 코티칭</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-[var(--color-primary)] mb-3">
          4. 기대 효과
        </h2>
        <div className="card text-sm leading-7">
          <p>• 다문화 자녀 학력격차 0.7~0.9년 → <b>3년 내 0.3년 축소</b> 목표</p>
          <p>• 매칭률 35% → <b>75%로 상승</b> (LLM 매칭 효과)</p>
          <p>• 아이돌봄 대기 가구의 <b>20%를 학습돌봄으로 보완</b> (3년 5,000쌍 누적)</p>
          <p className="mt-2 text-[var(--color-muted)]">
            ※ 본 사이트는 프로토타입이며, 데이터·매칭 결과는 시연용입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
