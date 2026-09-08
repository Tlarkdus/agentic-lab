# 6주차 실습 일지 — 자산 공장

## 완료한 LAB 체크리스트

- [x] LAB 01
- [x] LAB 02
- [x] LAB 03
- [x] LAB 04
- [ ] LAB 05
- [ ] LAB 06
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

- **산출물 경로**:
- **핵심 증거**:
- **관찰**:

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
