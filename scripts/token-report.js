#!/usr/bin/env node
// 세션 토큰 리포트 — .jsonl 로그에서 usage를 뽑아 표 한 장으로.
// node 표준 모듈만. 사용법: node scripts/token-report.js <a.jsonl> [b.jsonl ...]

import fs from 'node:fs';
import path from 'node:path';

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('usage: node scripts/token-report.js <session.jsonl> [...]');
  process.exit(1);
}

const COLS = ['파일', 'turns', 'input', 'output', 'cache_write', 'cache_read', '히트율', '실히트율'];
const rows = [];
const total = { turns: 0, input: 0, output: 0, cw: 0, cr: 0 };
let skipped = 0;

// 슬라이드 공식. Claude Code는 input_tokens를 turn당 2 정도로만 보고하고 나머지를
// 캐시 필드로 넘기므로, 이 값은 사실상 항상 100%가 나온다.
const hitRate = (input, cacheRead) => {
  const denom = input + cacheRead;
  return denom === 0 ? null : cacheRead / denom;
};

// 캐시 쓰기(×1.25 구간)까지 분모에 넣은 실질 히트율 — 세션 간 차이는 이쪽에만 보인다.
const realHitRate = (input, cacheWrite, cacheRead) => {
  const denom = input + cacheWrite + cacheRead;
  return denom === 0 ? null : cacheRead / denom;
};

for (const file of files) {
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (e) {
    console.error(`! 읽기 실패: ${file} (${e.code})`);
    continue;
  }

  const acc = { turns: 0, input: 0, output: 0, cw: 0, cr: 0 };
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    let obj;
    try {
      obj = JSON.parse(line);
    } catch {
      skipped++;
      continue;
    }
    const u = obj && obj.message && obj.message.usage;
    if (!u) { skipped++; continue; }

    acc.turns++;
    acc.input += u.input_tokens || 0;
    acc.output += u.output_tokens || 0;
    acc.cw += u.cache_creation_input_tokens || 0;
    acc.cr += u.cache_read_input_tokens || 0;
  }

  rows.push([
    path.basename(file).slice(0, 8),
    acc.turns, acc.input, acc.output, acc.cw, acc.cr,
    hitRate(acc.input, acc.cr),
    realHitRate(acc.input, acc.cw, acc.cr),
  ]);
  for (const k of Object.keys(total)) total[k] += acc[k];
}

rows.push(['합계', total.turns, total.input, total.output, total.cw, total.cr,
  hitRate(total.input, total.cr), realHitRate(total.input, total.cw, total.cr)]);

// 출력
const fmt = (v, i) => {
  if (i >= 6) return v === null ? '-' : (v * 100).toFixed(1) + '%';
  return typeof v === 'number' ? v.toLocaleString('en-US') : String(v);
};
const body = rows.map((r) => r.map(fmt));
const width = COLS.map((c, i) =>
  Math.max(c.length, ...body.map((r) => r[i].length)));
const line = (cells) =>
  cells.map((c, i) => (i === 0 ? c.padEnd(width[i]) : c.padStart(width[i]))).join('  ');

console.log(line(COLS));
console.log(width.map((w) => '-'.repeat(w)).join('  '));
for (const r of body.slice(0, -1)) console.log(line(r));
console.log(width.map((w) => '-'.repeat(w)).join('  '));
console.log(line(body[body.length - 1]));

// 총합 2줄 — Stop 훅이 이 마지막 2줄만 떠 간다
const inTotal = total.input + total.cw + total.cr;
const ratio = total.output === 0 ? '-' : `1 : ${(inTotal / total.output).toFixed(1)}`;
const hr = hitRate(total.input, total.cr);
const rhr = realHitRate(total.input, total.cw, total.cr);
const pct = (v) => (v === null ? '-' : (v * 100).toFixed(1) + '%');

console.log(`\n총 ${(inTotal + total.output).toLocaleString('en-US')} tokens · ` +
  `출력 ${total.output.toLocaleString('en-US')} · 입력 ${inTotal.toLocaleString('en-US')}(캐시 포함) · ` +
  `출력:입력 = ${ratio}`);
// cost gate — 임계 초과면 경고를 같은 줄에 붙인다 (중단이 아니라 보고)
const gate = Number(process.env.TOKEN_GATE_OUTPUT) || 0;
const overGate = gate > 0 && total.output > gate;

console.log(`캐시 히트율 ${pct(hr)} (실질 ${pct(rhr)}) · ` +
  `turns ${total.turns.toLocaleString('en-US')} · usage 없는 줄 ${skipped.toLocaleString('en-US')}` +
  (overGate ? `  ⚠ output ${total.output.toLocaleString('en-US')} > gate ${gate.toLocaleString('en-US')}` : ''));
