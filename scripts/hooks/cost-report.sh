#!/usr/bin/env bash
# 세션 비용 리포트 (Stop 훅) — 세션이 끝날 때 총합·히트율 2줄만 찍는다.
# Detect 층의 마찰 0 원칙: 로그를 못 찾으면 조용히 exit 0. 종료를 방해하지 않는다.

root=${CLAUDE_PROJECT_DIR:-.}

# ~/.claude/projects/ 아래 폴더명은 프로젝트 경로에서 : \ / 를 - 로 바꾼 것
bs=$(printf '\134\134')
# /c/Users/... 로 들어와도 C:/Users/... 와 같은 슬러그가 나오게 먼저 정규화한다
norm=$(printf '%s' "$root" | sed 's|^/\([a-zA-Z]\)/|\U\1:/|')
slug=$(printf '%s' "$norm" | tr ':' '-' | tr "$bs" '-' | tr '/' '-')
dir="$HOME/.claude/projects/$slug"

[ -d "$dir" ] || exit 0

latest=$(ls -t "$dir"/*.jsonl 2>/dev/null | head -1)
[ -n "$latest" ] || exit 0

# 게이트 — 총 output이 이 값을 넘으면 리포트에 경고가 붙는다 (이론 88 cost gate의 보고판)
export TOKEN_GATE_OUTPUT=${TOKEN_GATE_OUTPUT:-150000}

node "$root/scripts/token-report.js" "$latest" 2>/dev/null | tail -2
exit 0
