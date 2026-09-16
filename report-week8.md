# 출항 보고서 — 의장 공사 완료

**대상 저장소**: `agentic-lab` (7주차 미니 SaaS 진행 중이라 6주차 저장소에 장착)
**계급**: ⚓⚓⚓⚓ 풀 의장 함장 — 장비 1·2·3·4 전부 장착
**검증**: `npm test` 16/16 pass · 훅 4종 로드 확인 · 모든 산출물 `main`에 커밋·푸시 완료

---

## 장비 점검표

| 장비 | 상태 | 산출물 | 작동 증거 |
|---|---|---|---|
| 0. 자동 항법장치 (하네스) | ⬜ 미장착 | — | 7주차 `execute.py`로 갈음되는 항목. 7주차 슬라이드 미확보로 보류 |
| 1. 연료계 (토큰 + cost gate) | ⚓ | `scripts/token-report.js`, `scripts/hooks/cost-report.sh`, Stop 훅 | 10세션 1,001 turns 집계표 / 게이트 임계 120,000에서 ⚠ 발동 |
| 2. 입항 검문소 (리뷰 + Risk) | ⚓ | `.claude/commands/review.md`, `risk-score.md` | 위반 diff에서 5항목 전부 ❌ / 평시 15점 🟢 vs 위반 78점 🔴 |
| 3. 구명장비 (Prevent·Detect·Contain) | ⚓ | `scripts/hooks/bash-guard.sh`, `.claude/audit.log`, `../lab-exp` worktree | `BLOCKED`(exit 2) 실발동 / audit.log 75줄 / `feat-exp` 격리, 본진 무결 |
| 4. 야간 당직 로봇 (온콜) | ⚓ | `.claude/skills/triage/SKILL.md`, `_incident/` 2종, `_brain` 노드 2개 | A = High/Large → 알림+on-call, B = Low/Small → on-call |

장비 3은 6주차 LAB 10의 산출물이다. 이번 주 확인 과정에서 **Contain 층이 이미 완료돼 있었다는 걸
발견**했다 — `report-week6.md`에 "10-5 미실시"로 적혀 있었으나 `git worktree list`에
`lab-exp [feat-exp]`가 살아 있었다. 기록이 실물보다 낡아 있었던 셈이고, 같은 커밋에서 정정했다.

---

## 장비 1 — 연료계

**산출물**: `scripts/token-report.js`(106줄, node 표준 모듈만) · `scripts/hooks/cost-report.sh` ·
`.claude/settings.json` Stop 훅 · `tests/token-report.test.js`(3케이스)

**작동 증거**

```
파일        turns  input   output  cache_write   cache_read     히트율   실히트율
--------  -----  -----  -------  -----------  -----------  ------  -----
5710b4bf      5     10    2,329       40,025      206,829  100.0%  83.8%
94ab5cd0    311    622  197,573      645,407   49,221,078  100.0%  98.7%
--------  -----  -----  ------- ...
합계        1,001  2,002  806,686    1,981,599  110,413,962  100.0%  98.2%

총 113,204,249 tokens · 출력 806,686 · 입력 112,397,563(캐시 포함) · 출력:입력 = 1 : 139.3
캐시 히트율 100.0% (실질 98.2%) · turns 1,001 · usage 없는 줄 2,645
```

게이트 발동:
```
캐시 히트율 100.0% (실질 98.5%) · turns 175 · usage 없는 줄 377  ⚠ output 141,588 > gate 120,000
```

**관찰** — **지표가 100%면 지표가 아니다.** 슬라이드 공식 `cache_read/(input+cache_read)`를 그대로 썼더니
10개 세션이 전부 100.0%였다. Claude Code가 `input_tokens`를 turn당 2 정도로만 보고하고 나머지를
캐시 필드로 넘겨서 분모가 사실상 하나뿐이었다. 캐시 쓰기를 분모에 넣은 칸을 따로 다니 83.8%~98.7%로
갈라졌다. 그리고 비싼 건 말의 길이가 아니라 **세션을 여는 순간**이었다 — 출력은 전체의 0.7%고,
굵은 항목은 캐시 쓰기 1,981,599 토큰이었다. 이번 주 훅을 고칠 때마다 강제로 한 `/exit` 재시작이
청구서에 그대로 찍혀 있었다. **가드를 만드는 비용이 토큰으로 계산됐다.**

## 장비 2 — 입항 검문소

**산출물**: `.claude/commands/review.md`(5항목 대조) · `.claude/commands/risk-score.md`(5축 · 4등급)

**작동 증거** — 위반을 일부러 심고 잡았다. `experiment.js`에 하드코딩 시크릿 + 결제 금액 `console.log`,
`src/payments/coupon.js`에 이유 없는 리네임(`applyCoupon` → `calcCouponDiscount`).

| 항목 | 판정 | 근거 |
|---|---|---|
| ① 헌법 4원칙 | ❌ | `coupon.js:6` Surgical 위반 |
| ② 금지사항 | ❌ | `experiment.js:2` 시크릿, `:6` `console.log` |
| ③ 테스트 동반 | ❌ | `npm test` 14 tests / **1 fail** |
| ④ 범위 밖 | ❌ | 호출부 `tests/coupon.test.js:3,6,10,11,15` 미갱신 |
| ⑤ 문서 갱신 | ❌ | 공개 API 변경인데 문서 무변경 |

같은 자로 잰 등급: **평시 diff 15점 🟢 셀프 머지** vs **위반 diff 78점 🔴 머지 보류**.
복구 후 16/16 pass, `git log --all -S "sk-test-1234"` **0건** — 시크릿은 이력에 넣지 않았다.

**관찰** — **거울은 자기부터 비췄다.** `/review`를 만들자마자 첫 대상이 내가 방금 쓴 커밋이었고 ❌ 3건이
나왔다. 새 코드 119줄에 테스트 0, `CLAUDE.md` 구조 섹션이 스킬 5개 중 1개만 알고 있었다. 둘 다 고쳐
`npm test` 13 → 16이 됐다. 그리고 **한 글자가 세 항목이 됐다** — 함수명 하나를 바꿨을 뿐인데
Surgical·테스트·범위 밖·문서가 동시에 ❌였다. 위험은 파일 수가 아니라 **연결 수**를 따라 번진다.

## 장비 3 — 구명장비 3층

**산출물**: `scripts/hooks/bash-guard.sh`(4패턴, exit 2) · PostToolUse audit 훅 · `../lab-exp` worktree

**작동 증거**
```
PreToolUse:Bash hook error: [bash "$CLAUDE_PROJECT_DIR/scripts/hooks/bash-guard.sh"]:
BLOCKED: 위험한 명령어가 감지되었습니다
```
```
$ git worktree list
C:/Users/sgy46/agentic-lab  8a0eb38 [main]
C:/Users/sgy46/lab-exp      9cd5c16 [feat-exp]
```
실험 커밋 `9cd5c16`의 `src/wild-idea.js`는 `feat-exp`에만 있고 `main`에는 없다.
worktree에도 `.claude/settings.json`과 `scripts/hooks/`가 따라온다.

**관찰** — **격리는 됐지만 무법지대는 아니었다.** 실험 공간에도 헌법과 훅이 그대로 따라왔다.
그리고 Prevent와 Detect는 서로를 못 본다 — 차단당한 `git reset --hard`는 `audit.log`에 **0건**이다.
PostToolUse는 이름 그대로 실행 *후*에 돌기 때문에, **차단당한 시도는 통계에서 통째로 사라진다.**
사고 조사를 로그로만 하면 "무엇을 막았는가"를 영원히 못 본다.

## 장비 4 — 야간 당직 로봇

**산출물**: `.claude/skills/triage/SKILL.md`(①요약 ②원인후보 ③영향 ④조치제안 ⑤Confidence ⑥게이트) ·
`_incident/incident-A.log`·`incident-B.log` · `_brain/postmortem/payment-pool-exhaustion.md` ·
`_brain/decision/triage-gate.md`

**작동 증거** — 같은 스킬, 같은 표, 다른 판정

| | incident-A | incident-B |
|---|---|---|
| Confidence | **High** — 배포 03:10 → pool 82% 03:11 → 100% 03:13 → 5xx 03:15가 시각 순 연결 | **Low** — 후보 2개가 병존, 연결 근거 없음 |
| Blast Radius | **Large** — 결제 핵심 경로, 실패 1,183건, 5xx 34→41% 악화 중 | **Small** — 사용자 영향 0, 에러율 baseline 복귀 |
| 판정 | **알림 + on-call 호출** | **on-call 호출** |

`wiki-query` "payment 장애 때 뭘 배웠지?" → 교훈 3건을 노드 인용으로 답하고,
노드가 스스로 적어둔 한계 2건과 "교재용 가짜 장애"라는 경고까지 함께 반환했다.

**관찰** — **절제가 명세였다.** 원인이 High confidence로 좁혀졌는데도 스킬은 롤백을 실행하지 않는다.
새벽 3시에 확신에 찬 에이전트가 롤백을 눌러버리는 쪽이 훨씬 무섭다. 그리고 B의 판정이 흥미로웠다 —
사용자 영향 0, 에러율 정상, 악화 추세 없음. 모든 숫자가 "괜찮다"는데 판정은 **사람을 부르는 것**이었다.
확신이 없다는 건 "별일 아니다"라고 말할 근거도 없다는 뜻이기 때문이다.

---

## 8주의 항해를 마치며

**하나 — 이번 주에 새로 배운 기술이 없었다.**
온콜 에이전트는 LAB 03의 `_brain` 스키마, LAB 09의 근거 인용 강제, LAB 02의 등급 판정을 재조립한
것이었다. `[[triage]]`로 링크를 걸었다가 "노드가 아니라 스킬"이라 깨진 링크가 된 것도, 5주 전에 만든
규칙이 아직 살아서 걸어온 것이다. **자산이 자산을 먹인다**는 말의 실체가 이거였다 —
새 도구를 만드는 게 아니라, 있던 도구들이 서로를 호출하기 시작하는 것.

**둘 — 내가 만든 검사기는 전부 나를 먼저 잡았다.**
LAB 02의 루브릭은 내가 방금 추가한 줄 때문에 감점했고, LAB 10의 가드는 내 복구 명령을 막아 우회로를
찾게 했고, 이번 주 `/review`는 만들자마자 내 직전 커밋에 ❌ 3건을 냈다. 예외 없이 제작자가 첫 피해자였다.
규칙을 자산으로 만든다는 건 남 줄 도구를 만드는 게 아니라 **자기에게 먼저 적용되는 걸 감수하는 일**이었다.
불편했지만 한 번도 끄고 싶지 않았다.

**셋 — 8주 내내, 실패는 조용했다.**
`marketplace add`는 없는 경로에 무반응이었고, 인라인 Bash 훅은 안 막으면서 아무 말이 없었고,
`hooks.json`은 유효하지 않은 JSON이라 통째로 버려지면서 "훅 없음"으로만 나타났고, 이번 주에도
패치 스크립트가 `python` 스텁을 만나 조용히 아무것도 하지 않았다. 에러는 시끄럽지만 **미동작은 침묵**이다.
그래서 8주에 걸쳐 배운 검증법은 한 문장으로 줄어든다 — **밖으로 나가서, 없어야 할 것이 없는지 확인한다.**
파서에 넣어보고, 다른 폴더에서 돌려보고, 로그의 *부재*를 읽는다.

**다음 항해** — 7주차 조선소(미니 SaaS)가 남아 있다. 장비 0(하네스)은 그 배에 달린다.
지금은 장비를 실을 배가 6주차 실습 저장소지만, 다음엔 진짜 제품이 될 것이다.
