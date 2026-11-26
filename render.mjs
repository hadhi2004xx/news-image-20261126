// render.mjs — screenshots the front page to entry.png at 1024 x 1024.
// Usage: node render.mjs [out-png] [front-html]
// Defaults: entry.png inside entry/ next to this project dir; front.html
// written to the project directory for inspection. The page carries no
// clock, network or randomness, so two runs match byte for byte.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/home/hatch/workspace/ubh/tools/pw/node_modules/playwright-core/index.mjs';
import { buildPage, loadStories } from './build_page.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const CHROME = '/home/hatch/workspace/ubh/tools/pw-browsers/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell';

const outPng = resolve(process.argv[2] ?? join(HERE, 'entry', 'entry.png'));
const frontHtml = resolve(process.argv[3] ?? join(HERE, 'front.html'));

writeFileSync(frontHtml, buildPage(loadStories()), 'utf8');

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });
  await page.goto('file://' + frontHtml, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const metrics = await page.evaluate(() => ({
    scrollH: document.documentElement.scrollHeight,
    bodyH: document.body.scrollHeight,
    scrollW: document.documentElement.scrollWidth,
  }));
  console.log('page metrics:', JSON.stringify(metrics));
  await page.screenshot({ path: outPng, type: 'png' });
} finally {
  await browser.close();
}

const buf = readFileSync(outPng);
console.log('png:', outPng, buf.length, 'bytes, sha256', createHash('sha256').update(buf).digest('hex'));
