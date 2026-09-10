#!/usr/bin/env bash
# 미처리 표시 가드 — 스테이징된 파일에 미처리 표시가 남아 있으면 커밋을 막는다.
# stdin: PreToolUse JSON / stderr + exit 2 = 차단 (exit 1은 차단이 아니라 경고다)

input=$(cat)

# 검사 패턴과 메시지 낱말. 인접 인용부호를 이어붙여 만든다 —
# 소스에 낱말이 그대로 있으면 이 파일 자신이 가드에 걸려 커밋되지 않는다.
pattern='TO''DO|FIX''ME'
label='TO''DO/FIX''ME'

# (a) git commit 호출일 때만 동작. jq 없는 환경 — grep으로 tool_input.command를 본다.
# JSON 안의 따옴표는 \" 로 이스케이프되므로 [^"]* 는 인용부호 밖 구간만 훑는다.
# 덕분에 echo "git commit" 같은 인용된 문자열은 걸리지 않는다.
printf '%s' "$input" \
  | grep -qE '"command"[[:space:]]*:[[:space:]]*"[^"]*git[[:space:]]+commit' || exit 0

# Windows 절대경로 대비 — 역슬래시를 슬래시로 (tdd-guard.sh와 같은 처리)
bs=$(printf '\134\134')
root=$(printf '%s' "${CLAUDE_PROJECT_DIR:-.}" | tr "$bs" '/')

# (b) 스테이징된 파일만 검사. 삭제된 파일은 제외(ACM).
files=$(git -C "$root" diff --cached --name-only --diff-filter=ACM 2>/dev/null)
[ -z "$files" ] && exit 0

hits=$(printf '%s\n' "$files" | while IFS= read -r f; do
  [ -f "$root/$f" ] && grep -lIE "$pattern" "$root/$f"
done)

# (c) 처방을 담은 차단
if [ -n "$hits" ]; then
  printf 'BLOCKED: %s가 남아 있습니다. 정리하거나 이슈로 옮기세요\n' "$label" >&2
  printf '%s\n' "$hits" | sed 's|^|  - |' >&2
  exit 2
fi

exit 0
