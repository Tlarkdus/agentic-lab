# agentic-lab

절대 위반 금지 규칙: @GOLDEN_RULES.md

## 결제 코드 규칙

1. **활성 결제 코드는 `src/payments/` 뿐이다.**
   `src/billing/`, `src/old/`는 DEPRECATED — 수정하지도, import 하지도, 참고하지도 말 것.
   같은 이름의 함수가 거기 있어도 그건 죽은 코드다.

2. **금액은 항상 전(minor unit) 정수로 다룬다.**
   100전 = 1원. 부동소수 금액 금지. 필드명은 `amountMinor`처럼 `Minor` 접미사를 붙인다.

3. **결제 관련 로그는 `lib/logger.js`의 `logPayment()`만 사용한다.**
   `console.log`, 직접 만든 로거 금지.

4. **코드를 고쳤으면 반드시 `npm test`를 돌려 통과를 확인한다.**

5. 자세한 환불·검증 규칙은 @docs/payment-rules.md 참조.
