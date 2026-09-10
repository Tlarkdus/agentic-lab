// 금액은 minor unit(전) 정수. 100전 = 1원.
// rate는 할인 비율(0 < rate <= 1, 1 = 100%). 경계에서만 소수를 받고,
// 금액 계산은 basis point 정수로 환산해서 한다 — 부동소수 곱으로 금액을 만들지 않는다.
const RATE_BASIS = 10_000;

export function applyCoupon(priceMinor, rate) {
  if (!Number.isInteger(priceMinor)) {
    throw new TypeError(`priceMinor must be an integer, got ${priceMinor}`);
  }
  if (priceMinor < 0) {
    throw new RangeError(`priceMinor must not be negative, got ${priceMinor}`);
  }
  if (!Number.isFinite(rate)) {
    throw new TypeError(`rate must be a finite number, got ${rate}`);
  }
  if (rate <= 0) {
    throw new RangeError(`rate must be greater than zero, got ${rate}`);
  }
  if (rate > 1) {
    throw new RangeError(`rate must not exceed 1, got ${rate}`);
  }

  // 정수 연산 + 내림. 실지급액은 빼기로 구해 discount + net === price 를 보장한다.
  // ponytail: 0.01% 단위까지만 반영된다. 더 촘촘한 비율이 필요하면 RATE_BASIS를 키운다.
  const rateBp = Math.round(rate * RATE_BASIS);
  const discountMinor = Math.floor((priceMinor * rateBp) / RATE_BASIS);
  return { priceMinor, discountMinor, netMinor: priceMinor - discountMinor };
}
