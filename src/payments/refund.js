import { logPayment } from "../../lib/logger.js";

// 금액은 minor unit(전) 정수. 100전 = 1원.
const MAX_REFUND_MINOR = 1_000_000_000;
// 환불 수수료율(%). 정책 변경 시 이 상수 하나만 고친다.
const REFUND_FEE_PERCENT = 5;

export function refund(order) {
  const { id, amountMinor, currency = "KRW" } = order ?? {};

  logPayment({ event: "refund.start", order_id: id, amount_minor: amountMinor, currency, status: "started" });

  if (!id) {
    throw new Error("order.id is required");
  }
  if (!Number.isInteger(amountMinor)) {
    throw new TypeError(`amountMinor must be an integer, got ${amountMinor}`);
  }
  if (amountMinor === 0) {
    throw new RangeError("refund amount must be greater than zero");
  }
  if (amountMinor < 0) {
    throw new RangeError("refund amount must not be negative");
  }
  if (amountMinor > MAX_REFUND_MINOR) {
    throw new RangeError("refund amount exceeds limit");
  }

  // 정수 연산 + 내림. 실지급액은 빼기로 구해 net + fee === amount 를 보장한다.
  const feeMinor = Math.floor((amountMinor * REFUND_FEE_PERCENT) / 100);
  const netMinor = amountMinor - feeMinor;

  const result = { status: "refunded", orderId: id, amountMinor, currency, feeMinor, netMinor };
  logPayment({
    event: "refund.done", order_id: id, amount_minor: amountMinor, currency,
    status: result.status, fee_minor: feeMinor, net_minor: netMinor,
  });
  return result;
}
