---
status: draft
sources: [_incident/incident-A.log, .claude/skills/triage/SKILL.md]
---

# payment-service 커넥션 풀 고갈 (2026-09-15 03:12)

> 교재용 가짜 장애다. 실제 사고가 아니라 6주차 LAB 11에서 제조한 로그를 진단한 결과다.

## 타임라인

| 시각 | 사건 | 근거 |
|---|---|---|
| 03:10 | `payment-service v2.3.1` 배포 (직전 v2.3.0) | `incident-A.log:2` |
| 03:11 | pool usage 41/50 (82%) | `incident-A.log:4` |
| 03:13 | pool 50/50 (100%), queue depth 214 | `incident-A.log:9` |
| 03:14 | db-primary는 정상 — p99 18ms, slow query 없음 | `incident-A.log:11` |
| 03:15 | checkout API 5xx 34% (baseline 0.2%) | `incident-A.log:12` |
| 03:20 | 5xx 41%, 누적 실패 주문 1,183건 | `incident-A.log:18` |

## 원인

v2.3.1이 DB 커넥션을 반납하지 않는다(누수)로 추정. 풀 사용률이 82% → 100%로 **단조 증가**했고
내려온 지점이 없다 — 트래픽 급증이면 오르내린다. DB가 p99 18ms로 멀쩡한데 커넥션 50개가
물려 있다는 것이 "쿼리가 느린 게 아니라 반납이 안 된다"의 근거다.
같은 DB를 쓰는 `refund-service`가 pool 3/50으로 무사한 것이 범위를 한 서비스로 한정했다.

## 판정

**Confidence High × Blast Large → 알림 + on-call 호출.**
판정 규칙은 [[triage-gate]]의 2×2. 대조군 `incident-B`는 같은 스킬에서 Low/Small → on-call로 갈렸다.

## 교훈

- **배포 직후 30분은 pool 지표를 감시한다.** 이 사고는 배포 45초 뒤 재시작, 3분 뒤 고갈이었다 —
  배포 성공 로그(`:3`)만 보고 창을 닫으면 놓친다.
- **정상 지표가 원인을 좁힌다.** db-primary 정상(`:11`)과 refund-service 정상(`:16`)이
  후보를 지운 줄이었다. 사고 로그에서 "아무 일 없음" 줄을 버리지 않는다.
- pool size 상향은 지혈이 아니다 — 누수면 고갈 시점만 늦춘다.

## 모순/주의

- 커넥션 누수는 **로그만으로 확정되지 않았다.** v2.3.1의 획득·해제 경로 diff를 봐야 확정된다.
  현재 상태는 "가장 유력한 단일 후보"이지 확정 원인이 아니다.
- 검증 게이트([[repo-standards]]의 `npm test`)는 이 사고를 잡지 못한다 — 누수는 테스트 통과 후
  런타임에서 드러나는 종류다. 게이트가 커버하는 범위의 경계를 보여주는 사례.

관련: [[triage-gate]] · [[observations]] · [[repo-standards]]
