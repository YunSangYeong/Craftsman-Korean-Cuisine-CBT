/** Learning assumptions until official Q-Net source can be accessed and compared. */
export const QUALIFICATION = {
  name: "한식조리기능사",
  subject: "한식 재료관리, 음식조리 및 위생관리",
  questionCount: 60,
  durationMinutes: 60,
  choiceCount: 4,
  maxScore: 100,
  passScore: 60,
  hasSubjectCutoff: false,
  rulesVerificationStatus: "pending",
  source: "https://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=7910",
  selectionPolicy: "통합 무작위 추출. 단원별 공식 출제 비율 재현 아님",
  targetReviewedCount: 1000,
  storageNamespace: "korean-cuisine-cbt:v1",
} as const;
