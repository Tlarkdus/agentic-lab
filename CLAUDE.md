# agentic-lab

절대 위반 금지 규칙: @GOLDEN_RULES.md

규칙이 충돌하면 좁은 범위가 이긴다: `GOLDEN_RULES.md` > 폴더별 `.agent-rules.md` > 이 파일 > 전역 `~/.claude/CLAUDE.md`.

## 행동 원칙

1. **Think Before Coding** — 불확실하면 추측하지 말고 묻는다. 물을 수 없으면 세운 가정을 먼저 적고 시작한다.
2. **Simplicity First** — 요구를 만족하는 최소 코드만 쓴다. "나중에 쓸지도"를 위한 추상화·설정·레이어는 만들지 않는다.
3. **Surgical Changes** — 요청 범위 밖의 코드·주석·포맷은 건드리지 않는다. 리팩터링이 필요해 보이면 하지 말고 말한다.
4. **Goal-Driven** — 작업 전에 "무엇으로 끝났음을 증명할지"를 정한다. 증명은 `npm test` 통과로 확인한다.
5. **Rules in the Commit** — 규칙 문서(`CLAUDE.md`·`GOLDEN_RULES.md`·`.agent-rules.md`) 변경은 같은 커밋에 넣는다. 커밋되지 않은 규칙은 없는 규칙이다.

## 구조

- 활성 결제 코드: `src/payments/` — **여기만 수정한다.**
- `src/billing/`, `src/old/`: DEPRECATED. 수정·import·참고 전부 금지 — 같은 이름의 함수가 있어도 죽은 코드다.
- 로거: `lib/logger.js` / 테스트: `tests/` / 상세 규칙: `docs/payment-rules.md`, `src/payments/.agent-rules.md`
- `.claude/`: 커맨드 `commands/payment-feature.md`, 스킬 `skills/` (wiki-ingest·wiki-query·wiki-lint·lab-onboard) / `/repo-grade`는 `luna-marketplace/`의 `luna-plugin`이 제공

## 명령어

- `npm test` — 코드를 고쳤으면 반드시 돌려 통과를 확인한다.

## 금지사항

- 부동소수 금액. 금액은 항상 전(minor unit) 정수, 필드명은 `amountMinor`처럼 `Minor` 접미사.
- 결제 로그에 `console.log` 직접 호출이나 자체 로거. 출력은 `logPayment()`로만 한다 (`lib/logger.js` 내부가 유일한 예외).
- 실패를 정상 반환값으로 감추기. 결제 실패는 던진다.

## 지식 저장소(_brain) 규칙

- 팀 지식은 `_brain/` 아래 markdown으로만: `index.md`(목차), `log.md`(변경 기록), `decision/`, `meeting/`, `postmortem/`
- 노드 frontmatter에 `status`(stub/draft/solid)와 `sources`(원본 경로 목록). 본문은 `[[다른노드]]`로 잇는다.
- 원본(raw)은 수정 금지. 모순된 정보는 지우지 말고 "모순/주의" 섹션에 병기. 키·개인정보는 `_brain/`에 넣지 않는다.

자세한 환불·검증 규칙: @docs/payment-rules.md / 지식 저장소 목차: @_brain/index.md
