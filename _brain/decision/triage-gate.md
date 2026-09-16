---
status: draft
sources: [.claude/skills/triage/SKILL.md, _incident/incident-A.log, _incident/incident-B.log]
---

# 에스컬레이션 게이트 — 누구를 깨울 것인가

장애 1차 진단 후 사람을 부를지 판정하는 규칙. 구현은 `.claude/skills/triage/SKILL.md`의 ⑥ 섹션.

## 2×2

| | Blast: Small | Blast: Large |
|---|---|---|
| Confidence: High | 알림만 | 알림 + on-call 호출 |
| Confidence: Low | on-call 호출 | on-call + 책임자 |

Blast는 셋 중 하나라도 해당하면 `Large` — 핵심 경로 차단 / 영향 건수 세 자리 이상 / 악화 추세.

## 왜 이렇게 정했나

- **원칙은 "불확실하면 깨운다".** Low는 Blast와 무관하게 사람을 부른다 —
  확신이 없다는 건 "별일 아니다"라고 말할 근거도 없다는 뜻이다.
- 액션 열은 연구실 현실로 번역했다. 🟠 이상은 교수님까지 올라가는 [[repo-standards]]의
  리뷰 관행과 같은 계단을 쓴다.

## 대조 결과 (2026-09-16)

- `incident-A` → High/Large → 알림 + on-call. 근거는 [[payment-pool-exhaustion]]
- `incident-B` → Low/Small → on-call. 사용자 영향 0건인데도 호출로 간 케이스

## 모순/주의

- Blast 추정은 **로그에 세어지는 숫자에만** 의존한다. 관측되지 않은 영향은 Small로 떨어진다 —
  incident-B가 그 경우이고, 판정이 Low여서 사람을 부른 것이지 Blast가 잡아낸 게 아니다.
- 임계를 아직 한 번도 조정해 보지 않았다. "세 자리 이상"은 첫 제안값이다.
