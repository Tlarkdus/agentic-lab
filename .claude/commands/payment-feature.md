---
description: 결제 기능 추가 워크플로우 (읽기 → 구현 → 테스트 통과까지)
argument-hint: <추가할 기능 설명>
---

추가할 기능: $ARGUMENTS

아래 순서를 그대로 따른다.

1. 먼저 읽는다: `CLAUDE.md`, @GOLDEN_RULES.md, @docs/payment-rules.md
2. `src/payments/` 안에서만 작업한다. `src/billing/`, `src/old/`는 열지도 않는다.
3. 금액은 전(minor unit) 정수로 다룬다. 부동소수 금지, 비율은 정수 연산.
4. 로그는 `lib/logger.js`의 `logPayment()`만 쓴다.
5. `tests/`에 새 테스트를 추가한다. 정상 케이스 + 실패해야 하는 경계 케이스.
6. `npm test`를 실행한다.
7. 실패하면 traceback을 읽고 원인을 고친 뒤 다시 실행한다. 통과할 때까지 반복한다.
   테스트를 느슨하게 고쳐서 통과시키지 않는다.
8. 통과하면 변경 사항을 요약해 보고한다: 고친 파일, 추가한 테스트, `npm test` 결과.
