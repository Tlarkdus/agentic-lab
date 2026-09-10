# 6주차 실습 일지 — 자산 공장

## 완료한 LAB 체크리스트

- [x] LAB 01
- [x] LAB 02
- [x] LAB 03
- [x] LAB 04
- [ ] LAB 05
- [x] LAB 06
- [ ] LAB 07
- [ ] LAB 08
- [ ] LAB 09
- [ ] LAB 10
- [ ] LAB 11

## LAB별 기록

### LAB 01

- **산출물 경로**: `CLAUDE.md` (+ `GOLDEN_RULES.md`, `src/payments/.agent-rules.md`)
- **핵심 증거**: 감사 판정표 14행(조항 | 판정 | 근거 파일 | 수정 제안) — 유효 12 / 모순 1 / 낡음 1.
  커밋 `2c20069 docs: audit fix` (모순·낡음 3건 수정), `58b6167`·`3505299 docs: revise from session (week6)`
  (규칙 충돌 우선순위 조항, 행동 원칙 5번 신설). 대조 근거: `npm test` 10/10 pass, `grep console.log` 결과,
  `git show HEAD:CLAUDE.md`
- **관찰**: 헌법을 재구술시키니 "결제 로그에 `console.log` 금지" 한 문장이 두 가지로 읽힌다는 걸 알았다 —
  호출부 금지인지 `lib/logger.js` 구현까지 금지인지. 문자 그대로면 승인된 로거 자체가 규칙 위반이었다.

### LAB 02

- **산출물 경로**: `.claude/skills/repo-grade/SKILL.md` (5카테고리 × 20점 루브릭),
  `CLAUDE.md`, `.claude/settings.local.json` (allow 25건 → 11건, 백업 scratchpad/`settings.local.json.bak`)
- **핵심 증거 (채점·개선)**: 스킬 커밋 `117f52b`. 첫 채점 80/100 (A20 B10 C20 D20 E10),
  최저 카테고리 B·E 동률 10점. ROI 3: ① CLAUDE.md 감량 +10 ② 구조 섹션에 스킬 기재 +10
  ③ 코드 git 추적 +0(방어 — 현재 점수는 워킹트리 기준, 클론에선 A·D가 함께 무너짐) →
  ROI #1 `8774e45` CLAUDE.md 40줄→35줄로 B 10→20 → ROI #2 `4530ac0` 구조 섹션에 스킬 기재로 E 10→20 →
  **100/100**. 매 단계 `npm test` 10/10 pass
- **핵심 증거 (sanity)**: `grep -rn "^import|require("` 전수 조사 — 살아있는 그래프는
  `tests/refund.test.js` → `src/payments/refund.js` → `lib/logger.js` 하나뿐. 후보표 9행,
  제거 14건(타 저장소 9, 위험·1회성 5), 보류 4건. 커밋 `b819270`
- **관찰 1**: 내가 만든 루브릭이 내가 방금 추가한 줄을 잡았다 — 규칙을 더할수록 헌법이 40줄로 불어나
  B가 감점됐다. 채점 기준을 스스로 어긴 걸 스스로 찾는 게 스킬의 값어치였다.
- **관찰 2**: 재검증을 시키니 E 감점 근거 2건이 모두 무너졌다(폴더 규칙은 범위상 옳았고, `ts`는 로거 내부
  생성 필드였다). 점수는 80으로 같았지만 "맞는 점수를 틀린 이유로" 낸 상태였다.
- **관찰 3**: 죽은 코드보다 죽은 **권한**이 위험했다 — `rm -f CLAUDE.md GOLDEN_RULES.md ...`가 allow에 남아
  헌법 파일 삭제가 무승인 통과되는 상태였다. gitignore 대상이라 정리가 커밋으로 증명되지 않는다.

### LAB 03

- **산출물 경로**: `_brain/` (index.md, log.md, raw/ 2건, decision/ 3노드, postmortem/ 1노드),
  `CLAUDE.md` "지식 저장소(_brain) 규칙" 섹션, `.claude/skills/wiki-ingest/SKILL.md`,
  `.claude/skills/wiki-query/SKILL.md`
- **핵심 증거**: `779ae53` 스키마 층(위치·status/sources·[[링크]]·raw 불변·모순 병기·민감정보 배제,
  35줄→38줄 허용치 내) → `a73435a` raw 노트 2건 원본 보관 → `1069dd8` 첫 ingest
  (raw 2건 → 노드 4개: repo-standards/team-toolchain solid, audit-log draft, observations solid;
  index.md·log.md 신설, raw 무수정을 git status로 확인) → `947508e` wiki-query.
  질의 2건 대조: 인용 답변(게이트=npm test, 5주차 8/6 — 노드 + raw 원문 2단 인용) /
  "아직 없음" 답변(luna-plugin 롤백 절차 — `grep -rn` 0건 근거)
- **관찰 1**: 원본을 안 고치니 모순이 사라지지 않고 남았다 — 5주차 "CLAUDE.md 35줄 이내" vs 현재 38줄이
  `repo-standards`의 "모순/주의"에 출처·커밋과 함께 병기됐다. 지웠으면 규정 개정 안건 자체가 증발했다.
- **관찰 2**: 조회 스킬의 값어치는 "없다"고 말할 수 있는 데서 나왔다. `team-toolchain`에 luna-plugin이
  적혀 있는데도 롤백 절차로 넘겨짚지 않은 답변이, 인용 답변 쪽 신뢰의 근거가 된다.
- **관찰 3**: 노드화하자마자 파일 남발 유혹이 바로 왔다. 추출 항목 9개를 노드 4개로 묶고,
  raw가 이미 회의록이라 `meeting/`은 만들지 않았으며, 정의가 없는 용어는 stub 대신 index 한 줄로 남겼다.

### LAB 04

- **산출물 경로**: `.claude/ci/sources.yaml`, `.claude/skills/lab-onboard/SKILL.md`,
  `_brain/_index/knowledge-map.md`, `_brain/log.md`(실행 기록 1줄)
- **핵심 증거**: `0132c80` sources.yaml — code/rules/knowledge/reports/external 5그룹, 항목마다
  한 줄 주석, 12개 경로 `-e` 검증으로 `_brain/meeting/` 1건 제외 → `0d18a1b` lab-onboard +
  첫 지도(주제 7행, 신선도 mtime 기준, FAQ 5문항 전부 경로로 답, "목록 누락 의심" 5건 보고)
- **핵심 증거 (4-3 비교)**: 같은 질문 "커밋 전 반드시 통과해야 하는 검증은?" 2회.
  지도 없이 = `[[repo-standards]]:10` + `raw/2026-08-06-week5.md:2` + 헌법 조항.
  지도와 함께 = 위 전부 + `knowledge-map.md:20-21` FAQ + `package.json:7` `"test": "node --test"`.
  답은 `npm test`로 같고, 차이는 도달 경로와 깊이(결정 → 실제 실행 명령까지)
- **관찰 1**: 신선도 칸이 세션의 실체를 드러냈다 — 코드는 `보통`(2026-08-12), 규칙·지식·보고서는
  `최근`(2026-09-08). 이번 주 내내 문서만 고치고 코드는 손대지 않았다는 사실이 표 한 칸에 남았다.
- **관찰 2**: 출처 목록을 만들자 목록 자체의 구멍이 보였다. `lib/logger.js`(결제 로그의 유일한 출구)와
  `docs/payment-rules.md`가 `sources.yaml`에 없다. 스킬이 자동 수정 대신 "누락 의심"으로 보고하게
  해둔 덕에, 목록을 고칠지 말지는 사람 판단으로 남았다.
- **관찰 3**: 지도가 답을 바꾸지는 않았다. 바꾼 건 답에 닿는 경로다 — 위키만 보면 "무엇을 결정했나"에서
  멈추고, `code:` 그룹까지 내려가야 "그 결정이 어떤 명령으로 구현돼 있나"가 나온다.

### LAB 05

- **산출물 경로**:
- **핵심 증거**:
- **관찰**:

### LAB 06

- **산출물 경로**: `scripts/hooks/tdd-guard.sh`, `scripts/hooks/todo-guard.sh`,
  `.claude/settings.json`(PreToolUse 2건: `Edit|Write` → tdd-guard, `Bash` → todo-guard),
  `src/payments/coupon.js`, `tests/coupon.test.js`
- **핵심 증거 (6-1 설계 3원칙)**: `ff0f9b2 feat: tdd-guard hook` — 세 원칙이 코드 세 블록에 그대로 대응.
  (a) 면제가 절반 — 경로 없음·`*test*`·`.md/.json/.yml/.yaml`·`src/` 밖은 전부 exit 0.
  (b) 관대한 탐색 — `$root/tests/<name>.test.js`, `tests/<name>.test.js`, 같은 폴더 3후보를 모두 인정.
  (c) 친절한 deny — 메시지에 만들 파일 경로까지 박아 넣는다(`예: tests/<name>.test.js`).
  Windows 역슬래시를 8진 이스케이프로 만든 `tr`로 정규화하는 처리도 두 훅이 동일
- **핵심 증거 (6-2 단독 테스트, deny 1 · 통과 1)**: 훅에 PreToolUse JSON을 직접 물려 재확인.
  `src/payments/coupon.js` → 무출력 exit 0(통과) / `tests/coupon.test.js` → 면제로 통과 /
  `src/payments/tax.js` → `{"permissionDecision":"deny", ... "TDD GUARD: tax 테스트가 없습니다.
  테스트를 먼저 작성하세요 (예: tests/tax.test.js)"}`
- **핵심 증거 (6-4 RED→GREEN 한 사이클)**: `fc62d9a feat: coupon with tdd-guard`
  (`src/payments/coupon.js` +28, `tests/coupon.test.js` +16 — 테스트와 구현이 한 커밋).
  3케이스 GREEN: 정상 할인(10000에 10% → `netMinor` 9000) / `rate <= 0` → `RangeError` /
  `rate > 1` → `RangeError`. 전체 `npm test` **13/13 pass**(쿠폰 3 + 환불 10).
  비율은 경계에서만 소수로 받고 `Math.round(rate * 10_000)` basis point 정수로 환산 —
  금액에 부동소수 곱이 닿지 않는다(GOLDEN RULES 2)
- **핵심 증거 (6-5 TODO 커밋 차단)**: `7eceb12 feat: todo commit guard`.
  `coupon.js` 첫 줄에 미처리 표시 주석을 넣고 커밋 시도 →

  ```
  PreToolUse:Bash hook error: [bash "$CLAUDE_PROJECT_DIR/scripts/hooks/todo-guard.sh"]:
  BLOCKED: TODO/FIXME가 남아 있습니다. 정리하거나 이슈로 옮기세요
    - C:/Users/sgy46/agentic-lab/src/payments/coupon.js
  ```

  정리 후 `git restore --staged --worktree`로 원복(주석만 지우면 diff 0 — 커밋할 변경이 남지 않는다)
- **핵심 증거 (6-5 부수 발견: 가드 구멍)**: 같은 변경이 호출 형태에 따라 갈렸다.
  `git add X && git commit -m ...`(한 명령) → **통과**, `git add X` → `git commit -m ...`(분리) → **BLOCKED**.
  PreToolUse는 명령 실행 *전*에 돌아 `git diff --cached`가 비어 있고,
  todo-guard.sh의 `[ -z "$files" ] && exit 0`으로 빠져나간다. `git commit -a`도 같은 경로로 뚫린다
- **핵심 증거 (6-5 부수 발견: 오탐과 수정)**: 이 보고서를 커밋하려 하자 **보고서 자신이 차단**됐다
  (`BLOCKED: ... - report-week6.md`) — 차단 캡처를 증거로 실었기 때문. todo-guard.sh가 자기 소스에서
  낱말을 `'TO''DO'`로 쪼개 쓰는 것과 같은 문제를 문서에서 다시 만난 것이라, tdd-guard의 "면제가 절반"과
  같은 모양으로 `*.md` 면제 1줄을 추가했다(`case "${f##*/}" in *.md) continue ;; esac`).
  검증: 면제 후 훅 exit 0, `.js`·`lib/` 경로는 그대로 검사 대상. 훅 수정과 이 기록은 같은 커밋
- **hard/soft 판단**: 우리 팀이라면 **hard, 단 탈출구를 붙인 hard**. 미처리 표시는 "나중에"가 영원히
  오지 않는 대표 항목이라 soft 경고는 두 번째부터 스크롤에 묻힌다. 대신 순수 차단만 두면 우회 압력이
  생기므로, 이슈 번호가 붙은 형태(`TODO(#123)`)는 통과시키는 예외를 함께 둔다 — 그래야
  "정리하거나 이슈로 옮기세요"라는 처방이 실제로 실행 가능해진다.
  강도는 기술이 아니라 정책 결정이다: 훅 설계의 절반은 "무엇을 막나"가 아니라 **"막힌 사람이 어디로
  갈 수 있나"**이고, 탈출구 없는 hard는 규칙이 아니라 장애물이 된다
- **관찰 1**: 차단 메시지가 처방을 담고 있으니 우회 시도가 나오지 않았다. `--no-verify`나 낱말 바꿔치기
  대신 곧장 "지우거나 이슈로 옮긴다"로 갔다 — deny의 값어치는 막는 힘이 아니라 **다음 한 걸음을
  지정해 주는 데** 있었다.
- **관찰 2**: 가드를 뚫은 건 악의가 아니라 습관이었다. `git add && git commit`을 한 줄로 붙이는 일상적
  편의가 PreToolUse 타이밍과 만나 훅을 무력화했다. 훅의 구멍은 공격이 아니라 **정상적인 사용 습관**에서
  열린다 — 그래서 훅은 "우회 가능한가"보다 "평소 쓰는 형태로도 걸리나"로 시험해야 한다.
- **관찰 3**: 같은 저장소에 강도가 다른 두 훅이 공존한다. tdd-guard는 면제 목록이 본문의 절반이고
  (deny JSON, 되돌릴 수 있음), todo-guard는 면제가 하나도 없다(exit 2, 커밋 자체를 끊음).
  전자는 "쓰면서 배우게" 설계됐고 후자는 "새는 걸 막게" 설계됐다 — 훅마다 목적이 다르면 강도도 달라야
  한다는 게, 두 파일을 나란히 놓고서야 보였다.

### LAB 07

- **산출물 경로**:
- **핵심 증거**:
- **관찰**:

### LAB 08

- **산출물 경로**:
- **핵심 증거**:
- **관찰**:

### LAB 09

- **산출물 경로**:
- **핵심 증거**:
- **관찰**:

### LAB 10

- **산출물 경로**:
- **핵심 증거**:
- **관찰**:

### LAB 11

- **산출물 경로**:
- **핵심 증거**:
- **관찰**:

## 종합 관찰 3줄

1.
2.
3.
