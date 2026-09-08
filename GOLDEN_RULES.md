# GOLDEN RULES

절대 위반 금지. 예외 없음.

1. **`src/billing/`, `src/old/`는 수정도 참조도 금지.** 활성 결제 코드는 `src/payments/` 뿐이다.
2. **금액은 항상 전(minor unit) 정수.** 부동소수 금액 금지.
3. **결제 로그는 `lib/logger.js`의 `logPayment()`만.** 호출부에서 `console.log` 금지.
4. **코드를 고쳤으면 `npm test` 통과를 확인한다.**
5. **결제 실패는 던진다.** 실패를 정상 반환값으로 감추지 않는다.
