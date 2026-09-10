import test from "node:test";
import assert from "node:assert/strict";
import { applyCoupon } from "../src/payments/coupon.js";

test("정상 할인 — 10000에 10%를 적용하면 9000", () => {
  assert.equal(applyCoupon(10_000, 0.1).netMinor, 9_000);
});

test("rate가 0 이하면 RangeError", () => {
  assert.throws(() => applyCoupon(10_000, 0), RangeError);
  assert.throws(() => applyCoupon(10_000, -0.1), RangeError);
});

test("rate가 1(100%)을 넘으면 RangeError", () => {
  assert.throws(() => applyCoupon(10_000, 1.5), RangeError);
});
