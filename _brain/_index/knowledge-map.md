# 지식 지도

입력: `.claude/ci/sources.yaml` (2026-09-08 기준). 로컬 소스만 훑었고 `external`은 fetch하지 않았다.
신선도는 파일 mtime 기준 — 7일 이내 `최근` / 30일 이내 `보통` / 그 이상 `오래됨`.

| 주제 | 관련 파일·노드 | 한 줄 요약 | 신선도 |
|---|---|---|---|
| 환불 계산·검증 | `src/payments/refund.js`, `tests/refund.test.js` | 유일한 활성 결제 코드. 전 단위 정수 + `Math.floor` 수수료, 실패는 예외로 던진다 | 보통 (2026-08-12) |
| 죽은 결제 코드 (함정) | `src/billing/refund.js`, `src/old/legacy.js` | 같은 이름 `refund()`의 옛 구현. 원 단위·콜백·`console.log`. 읽지도 고치지도 않는다 | 보통 (2026-08-12) |
| 실행 환경 | `package.json` | `npm test` = `node --test`, `"type": "module"`. 의존성 없음 | 보통 (2026-08-12) |
| 헌법·절대 규칙 | `CLAUDE.md`, `GOLDEN_RULES.md` | 행동 원칙 5·구조·명령어·금지사항·_brain 규칙 / 예외 없는 5개조 | 최근 (2026-09-08) |
| 팀 결정 | `_brain/index.md`, `[[repo-standards]]`, `[[team-toolchain]]`, `[[audit-log]]` | 게이트 `npm test` 통일, 배포 `luna-plugin`(main 추종), 기본 훅 채택. audit log는 미결 | 최근 (2026-09-08) |
| 실습 기록 | `report-week6.md` | LAB별 산출물·증거·관찰. LAB 01~03 완료 | 최근 (2026-09-08) |
| 외부 참고 (fetch 안 함) | 예시-플러그인 — `github.com/jha0313/agentic-eng-plugin` | 팀 플러그인 구조 참고 | — |

## 자주 묻는 질문 → 어디를 봐야 하나

1. **환불 수수료는 어떻게 계산하나?** → `src/payments/refund.js:30` (`Math.floor(amountMinor * 5 / 100)`), 규칙은 `docs/payment-rules.md`
2. **이 폴더 고쳐도 되나?** → `CLAUDE.md`의 `## 구조`, `GOLDEN_RULES.md:5`. `src/payments/`만 수정 가능
3. **우리 검증 게이트가 뭐지?** → `_brain/decision/repo-standards.md:10` (근거 원본 `_brain/raw/2026-08-06-week5.md:2`)
4. **테스트는 어떻게 돌리나?** → `package.json` `scripts.test`, `CLAUDE.md`의 `## 명령어`
5. **이번 주에 뭘 했나?** → `report-week6.md` LAB 01~03 칸

## 목록 누락 의심

`sources.yaml`에 없지만 답을 찾을 때 실제로 필요한 곳 (스킬 금지사항에 따라 지도에만 보고, `sources.yaml`은 고치지 않음):

- `lib/logger.js` — 결제 로그의 유일한 출구. `code:`에 `src/`, `tests/`, `package.json`만 있어 빠짐
- `docs/payment-rules.md` — 환불·검증 상세 규칙. `CLAUDE.md`가 `@`로 불러오지만 `rules:`에는 없음
- `_brain/postmortem/`, `_brain/raw/`, `_brain/log.md` — 관찰 노드·원본·변경 기록. `knowledge:`에 미기재
