#!/usr/bin/env bash
# TDD 가드 — 테스트 없는 src/*.js 편집을 막는다.
# 설계 3원칙: 면제가 절반 · 관대한 탐색 · 친절한 deny
# stdin: PreToolUse JSON / stdout: deny JSON 또는 무출력

input=$(cat)

# jq가 없는 환경 — grep/sed로 tool_input.file_path만 뽑는다
path=$(printf '%s' "$input" \
  | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' \
  | head -1 | sed 's/.*:[[:space:]]*"//; s/"$//')

# Windows 절대경로 대비 — 역슬래시를 슬래시로, 중복 슬래시 정리
# (역슬래시는 8진 이스케이프로 만든다. 소스에 직접 쓰면 이스케이프 지옥)
bs=$(printf '\134\134')
path=$(printf '%s' "$path" | tr "$bs" '/' | tr -s '/')

# (a) 면제 — 경로 없음 / 테스트 파일 / 문서·설정 파일
[ -z "$path" ] && exit 0
base=${path##*/}
case "$base" in
  *test*|*.md|*.json|*.yml|*.yaml) exit 0 ;;
esac

# 대상은 src/ 아래 .js 뿐
case "$path" in
  src/*.js|*/src/*.js) ;;
  *) exit 0 ;;
esac

name=${base%.js}
dir=${path%/*}
root=$(printf '%s' "${CLAUDE_PROJECT_DIR:-.}" | tr "$bs" '/')

# (b) 관대한 탐색 — 중앙 tests/ 와 같은 폴더 둘 다 인정
for candidate in "$root/tests/$name.test.js" "tests/$name.test.js" "$dir/$name.test.js"; do
  [ -f "$candidate" ] && exit 0
done

# (c) 친절한 deny — 벌이 아니라 처방
printf '%s\n' "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"deny\",\"permissionDecisionReason\":\"TDD GUARD: $name 테스트가 없습니다. 테스트를 먼저 작성하세요 (예: tests/$name.test.js)\"}}"
exit 0
