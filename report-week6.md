# 6주차 실습 일지 — 자산 공장

## 완료한 LAB 체크리스트

- [x] LAB 01
- [x] LAB 02
- [ ] LAB 03
- [ ] LAB 04
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

- **산출물 경로**: `.claude/settings.local.json` (allow 25건 → 11건). 백업: scratchpad/`settings.local.json.bak`
- **핵심 증거**: `grep -rn "^import|require("` 전수 조사 — 살아있는 그래프는 `tests/refund.test.js` →
  `src/payments/refund.js` → `lib/logger.js` 하나뿐. 후보표 9행(제거 3 / 보류 4 / 해당없음·오탐 2),
  제거 14건(타 저장소 9, 위험·1회성 5), `npm test` 10/10 pass
- **관찰**: 죽은 코드보다 죽은 **권한**이 위험했다 — `rm -f CLAUDE.md GOLDEN_RULES.md ...`가 allow 목록에
  남아 헌법 파일 삭제가 무승인 통과되는 상태였다. 그런데 이 파일은 gitignore라 정리 사실이 커밋으로
  증명되지 않는다. git 밖 자산은 일지에 적어야만 남는다.

### LAB 03

- **산출물 경로**:
- **핵심 증거**:
- **관찰**:

### LAB 04

- **산출물 경로**:
- **핵심 증거**:
- **관찰**:

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
