# 결제 규칙

대상: `src/payments/`. 그 외 결제 디렉터리는 DEPRECATED (CLAUDE.md 참조).

## 금액 단위

- 모든 금액은 **전(minor unit) 정수**. 100전 = 1원.
- 소수·부동소수 금액은 어디에도 저장하지 않는다. 비율 계산도 정수 연산으로 한다.
- 외부 입력은 `Number.isInteger()`로 검증한 뒤에만 계산에 넣는다.

## 환불 수수료 계산 원칙

- 수수료율은 `src/payments/refund.js` 상단의 상수 하나로만 정의한다. (현재 정책: 5%)
- 계산은 `Math.floor(amountMinor * RATE_PERCENT / 100)`.
  `* 0.05` 같은 부동소수 곱 금지 — 정수 연산으로 오차를 없앤다.
  내림이므로 1전 미만은 항상 고객에게 유리한 쪽으로 떨어진다.
- 실지급액은 반드시 **빼기로** 구한다: `netMinor = amountMinor - feeMinor`.
  둘을 따로 계산·반올림하면 `net + fee !== amount`가 되어 정산이 깨진다.
- `amountMinor`의 의미는 "환불 요청 원금"으로 고정. 수수료 차감액을 여기에 덮어쓰지 않는다.
  차감 결과는 `feeMinor`, `netMinor`로 별도 필드에 담는다.

## 검증

수수료 차감 **전** 원금(`amountMinor`) 기준으로 검사한다.

| 조건 | 처리 |
|---|---|
| `order.id` 없음 | `Error` |
| `amountMinor`가 정수가 아님 | `TypeError` |
| `amountMinor === 0` | `RangeError` |
| `amountMinor < 0` | `RangeError` |
| `amountMinor > MAX_REFUND_MINOR` | `RangeError` |

통화 기본값은 `KRW`.

## 에러 처리

- 실패는 **던진다**. `{ ok: false, reason }` 같은 반환값이나 에러 우선 콜백을 쓰지 않는다.
  (DEPRECATED 코드의 방식이며, 호출부가 검사를 잊으면 조용히 통과한다.)
- 에러 종류는 위 표대로 구분한다. 전부 `Error`로 뭉뜽그리지 않는다 — 테스트가 종류로 구분한다.
- 메시지에는 실제 받은 값을 포함한다. 예: `` `amountMinor must be an integer, got ${amountMinor}` ``
- 카드번호 등 민감 정보는 메시지에도 로그에도 넣지 않는다.

## 로그

- `lib/logger.js`의 `logPayment()`만 사용한다.
- 환불 한 건은 시작(`refund.start`)과 종료(`refund.done`) 두 줄로 끝낸다.
  수수료용 별도 이벤트를 만들지 않는다 — 결과 객체에 `feeMinor`/`netMinor`가 들어가면 종료 로그에 같이 실린다.
