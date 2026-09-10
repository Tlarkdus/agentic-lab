// 결제 로그는 이 함수만 사용한다. JSON line 한 줄 = 이벤트 하나.
export function logPayment({ event, order_id, amount_minor, currency = "KRW", status, fee_minor, net_minor }) {
  console.log(JSON.stringify({
    ts: new Date().toISOString(), event, order_id, amount_minor, currency, status,
    ...(fee_minor === undefined ? {} : { fee_minor }),
    ...(net_minor === undefined ? {} : { net_minor }),
  }));
}
