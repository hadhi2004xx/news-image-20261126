// main.ts — the entry program (Node 22, standard library only).
// The front page is drawn at build time and shipped in this repository as
// entry.png; the program copies it to the grader's output directory.
// It runs twice in the sandbox and both runs must write the same bytes,
// so the copy is byte-for-byte, the output directory is created first,
// and a missing image fails loudly instead of writing a partial entry.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const source = new URL('./entry.png', import.meta.url);
if (!existsSync(source)) {
  throw new Error('entry.png is missing from the repository — cannot write the entry');
}
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, 'entry.png'));
