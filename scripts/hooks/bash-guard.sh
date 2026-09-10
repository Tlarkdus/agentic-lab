#!/usr/bin/env bash
# 위험 명령 가드 — 파괴적 Bash 명령을 실행 전에 막는다.
# stdin: PreToolUse JSON / stderr + exit 2 = 차단 (exit 1은 차단이 아니라 경고다)

input=$(cat)

# jq 없는 환경 — grep으로 tool_input.command를 본다.
# JSON 안의 따옴표는 \" 로 이스케이프되므로 [^"]* 는 인용부호 밖 구간만 훑는다.
# 덕분에 echo "rm -rf x" 같은 인용된 문자열은 걸리지 않는다. (todo-guard.sh와 같은 처리)
danger='rm[[:space:]]+-[a-zA-Z]*[rR]|git[[:space:]]+push[[:space:]]+--force|git[[:space:]]+reset[[:space:]]+--hard|DROP[[:space:]]+TABLE'

if printf '%s' "$input" | grep -qE "\"command\"[[:space:]]*:[[:space:]]*\"[^\"]*($danger)"; then
  echo 'BLOCKED: 위험한 명령어가 감지되었습니다' >&2
  exit 2
fi

exit 0
