# 검증 기록 — 2026-10-22

작업 경로: `/workspace/Craftsman-Korean-Cuisine-CBT`.

- `npm ci --cache /tmp/korean-cbt-npm-cache --no-audit --no-fund`: 성공, lockfile 무결성 검증 유지.
- `npm run check`: 종료 0. Vitest 17개 통과, TypeScript 및 Vite 프로덕션 빌드 통과.
- 최종 Chromium E2E 실행 결과는 아래에 추가 기록.
- 문제 JSON 재생성 전후 바이트 동일. SHA256: `524c21c88f4717619bdfea717cad55948997c5e3fe68f9bb9606c26f84b28914`.
- 최신 표준 스킬 폴더의 전체 파일을 원본과 바이트 비교, 일치.
- ID 중복 0, 정규화 본문·정렬 보기 중복 0. 위생/재료/조리 각 20문항의 의미 중복 및 문장·보기·정답·해설 내부 대조. 외부 전문가와 독립 사실 검증 없음.
- PC/모바일 스크린샷을 직접 확인. 네이비/청록 표준 화면과 두 모드, 가로 넘침 없음 확인.
- 작은 높이 390×480, 가로 740×360 메뉴 실제 mouse wheel 아래/위 입력, 하단 초기화 열기/취소, 상단 대시보드 클릭.
- Pixel 7 Chromium 에뮬레이션에서 CDP touchStart/touchMove/touchEnd로 아래/위 스와이프. 글자 확대 후 하단 학습 기록 백업 실제 다운로드와 상단 대시보드 탭 확인. scrollTop 강제 설정은 사용하지 않음.
- 실제 keydown/keyup Space: 실전·랜덤의 미응답 보호, 답변/채점 뒤 이동, 본문 포커스, 길게 누르기·수정키·컨트롤·대화상자 보호, 마지막 시험 문제 미제출 확인.
- 60문항 시험, 답안 변경, 35/36개 합격 경계, 제출 취소/확인, 미응답, 새로고침 복원, 절대 시간 만료와 중복 제출 방지 확인.
- 랜덤 순회 ID 중복 방지, 정답 재학습의 오답 제거, 북마크·통계, JSON/CSV 등록/중복/검수 대기/로컬 승인, 원자적 오류 처리, 초기화 확인.
- 손상 저장소 원본 보존, 저장 quota 실패 경고 확인.
- 안내 배너 검사 초기 실패: 통계 화면의 보관 범위 설명을 안내 배너로 잘못 분류했던 테스트 조건 수정. 금지 대상인 비공식·잠정·검증 대기 안내만 검사하며 통계 범위 설명과 실제 오류 경고는 유지.
- 공식 Q-Net 요청: curl 종료 56, `CONNECT tunnel failed, response 403`, HTTP 응답 없음(000). 공식 규칙/기출 이용 조건 확인 차단. 읽지 않은 문서를 출처로 주장하지 않음.
- 실기기·Safari·Firefox·블로그 iframe 검증은 미실행. 외부 전문가 검수·공식 출제기준 대조 미완료.
- 실제 문항 60(자체 제작 개념형 60, 기출/복원/변형 0), 목표 부족 940. 최종 1,000문항 기준 미충족.

## 최종 실행 결과 및 배포 차단

- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx --cache /tmp/korean-cbt-npm-cache playwright test`: 종료 0, **28개 통과·2개 의도적 건너뜀**. 건너뜀은 데스크톱 프로젝트의 터치 전용 두 케이스이며 모바일 프로젝트에서는 두 케이스 모두 실행·통과.
- `npm run check`: 종료 0, 단위 17개 통과 및 타입 검사/프로덕션 빌드 성공.
- 배포 사전 확인 1회: `GET https://api.github.com/repos/YunSangYeong/Craftsman-Korean-Cuisine-CBT`, curl 종료 56, `CONNECT tunnel failed, response 403`.
- 첫 차단 뒤 API 재요청·다른 API 도구·Pages 설정 변경·workflow 수동 실행·main push·배포 유발 추가 push 없음.
- 권한/Pages Source/기존 공개 상태는 API 차단 때문에 미확인. CI·Pages 파이프라인은 이 작업에서 시작하지 않았으며 배포 성공·공개 화면 확인을 주장하지 않음.
- 구현은 main push 트리거가 실행되지 않는 `feat/korean-cuisine-cbt` 브랜치에 보존. 원격 커밋은 최종 보고서에서 제시.
- 지금 필요한 최소 사용자 동작: 클라우드 환경의 네트워크 설정에 `api.github.com` 허용. 공식 자료 확인에는 `www.q-net.or.kr`도 필요. 설정 후에도 이 작업은 자동 재시도하지 않으며 이후 마무리는 사용자에게 맡김.
- Vite 개발 서버 `npm run dev -- --port 5173 --strictPort`의 HTML과 변환 React 모듈 HTTP 요청 성공.
- 클라우드 재사용 설정 초안에 install_script/start_skill 및 사용자 정의 허용 도메인 `api.github.com`, `www.q-net.or.kr` 추가 저장. 기존 package_managers 프리셋 보존. 초안 저장은 런타임 적용·게시·Pages 배포가 아니며 차단된 요청은 재시도하지 않음.
