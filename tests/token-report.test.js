import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const SCRIPT = path.join(process.cwd(), 'scripts', 'token-report.js');

// usage 3필드가 든 정상 줄 + 깨진 줄 + usage 없는 줄
const usageLine = (input, output, cw, cr) => JSON.stringify({
  message: { usage: {
    input_tokens: input, output_tokens: output,
    cache_creation_input_tokens: cw, cache_read_input_tokens: cr,
  } },
});

const fixture = (lines) => {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'tr-')), 'session.jsonl');
  fs.writeFileSync(f, lines.join('\n') + '\n');
  return f;
};

const run = (file, env = {}) =>
  execFileSync('node', [SCRIPT, file], { encoding: 'utf8', env: { ...process.env, ...env } });

test('불량 줄에서 죽지 않고 건너뛴 개수를 보고한다', () => {
  const out = run(fixture(['깨진 줄', usageLine(5, 10, 0, 15), '{"no":"usage"}']));
  assert.match(out, /turns 1/);
  assert.match(out, /usage 없는 줄 2/);
});

test('히트율 두 가지를 다르게 계산한다', () => {
  // 슬라이드 공식 cr/(input+cr) = 15/20 = 75%, 실질 cr/(input+cw+cr) = 15/40 = 37.5%
  const out = run(fixture([usageLine(5, 10, 20, 15)]));
  assert.match(out, /캐시 히트율 75\.0% \(실질 37\.5%\)/);
});

test('cost gate는 임계 초과에만 경고를 붙인다', () => {
  const f = fixture([usageLine(5, 1000, 0, 15)]);
  assert.match(run(f, { TOKEN_GATE_OUTPUT: '500' }), /⚠ output 1,000 > gate 500/);
  assert.doesNotMatch(run(f, { TOKEN_GATE_OUTPUT: '5000' }), /⚠/);
});
