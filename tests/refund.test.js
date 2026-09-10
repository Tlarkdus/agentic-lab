import test from "node:test";
import assert from "node:assert/strict";
import { refund } from "../src/payments/refund.js";

test("정상 환불", () => {
  const result = refund({ id: "ord_1001", amountMinor: 1500000 });

  assert.deepEqual(result, {
    status: "refunded",
    orderId: "ord_1001",
    amountMinor: 1500000,
    currency: "KRW",
    feeMinor: 75000,
    netMinor: 1425000,
  });
});

test("수수료는 내림(floor)으로 계산한다", () => {
  // 99 * 5 / 100 = 4.95 → 4
  const result = refund({ id: "ord_1004", amountMinor: 99 });

  assert.equal(result.feeMinor, 4);
  assert.equal(result.netMinor, 95);
});

test("fee + net === amount (정산이 깨지지 않는다)", () => {
  for (const amountMinor of [1, 7, 19, 99, 100, 12345, 999999999]) {
    const { feeMinor, netMinor } = refund({ id: "ord_sum", amountMinor });
    assert.equal(feeMinor + netMinor, amountMinor, `amountMinor=${amountMinor}`);
    assert.ok(Number.isInteger(feeMinor) && Number.isInteger(netMinor));
  }
});

test("amountMinor는 환불 요청 원금 그대로 유지된다", () => {
  const result = refund({ id: "ord_1005", amountMinor: 10000 });

  assert.equal(result.amountMinor, 10000);
});

test("1전 환불은 수수료 0, 실환불액 1", () => {
  const result = refund({ id: "ord_1006", amountMinor: 1 });

  assert.equal(result.feeMinor, 0);
  assert.equal(result.netMinor, 1);
});

test("order.id 없으면 Error", () => {
  assert.throws(() => refund({ amountMinor: 1000 }), Error);
});

test("정수가 아닌 금액은 TypeError", () => {
  assert.throws(() => refund({ id: "ord_1007", amountMinor: 1000.5 }), TypeError);
});

test("한도 초과는 수수료 차감 전 원금으로 판정한다", () => {
  // 수수료를 뺀 값으로 검사하면 통과해버리는 금액
  assert.throws(() => refund({ id: "ord_1008", amountMinor: 1_000_000_001 }), RangeError);
});

test("0원 환불은 거부한다", () => {
  assert.throws(() => refund({ id: "ord_1002", amountMinor: 0 }), RangeError);
});

test("음수 금액은 거부한다", () => {
  assert.throws(() => refund({ id: "ord_1003", amountMinor: -500 }), RangeError);
});
