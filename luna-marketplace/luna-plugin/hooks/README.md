# hooks (슬롯)

팀 기본 훅 자리. 아직 비어 있다 — TDD 가드는 LAB 06, Bash 가드레일은 LAB 10에서 만들고
여기 `hooks.json`으로 이식한다. 스크립트 경로는 반드시 `${CLAUDE_PLUGIN_ROOT}` 기준으로 쓴다
(설치 위치가 저장소마다 다르므로 상대경로·절대경로는 깨진다).

    { "hooks": { "PreToolUse": [ { "matcher": "Edit|Write",
      "hooks": [ { "type": "command", "command": "${CLAUDE_PLUGIN_ROOT}/hooks/tdd-guard.sh" } ] } ] } }

근거: `_brain/decision/team-toolchain.md` — TDD 가드·Bash 가드레일을 기본 훅으로 채택.
