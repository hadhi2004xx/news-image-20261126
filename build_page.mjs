// build_page.mjs — builds the 1024x1024 front page for THE DAY, IN FULL.
// Reads stories.json next to this file and returns one self-contained HTML
// document. No network, no clock, no randomness: the same stories file
// always produces the same bytes, so the screenshot is reproducible.
// Run directly to write front.html beside this file.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

export function loadStories() {
  return JSON.parse(readFileSync(join(HERE, 'stories.json'), 'utf8'));
}

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// One story row. Roomy rows (left column) put the dateline on its own line
// and show the deck on the section's first story; compact rows (right
// column) fold the dateline inline so 30 stories fit the page.
function row(story, roomy, withDeck) {
  const num = `<span class="n">${String(story.n).padStart(2, '0')}</span>`;
  if (roomy) {
    return `<div class="row roomy">${num}<div class="rb">
      <div class="place">${esc(story.place)}</div>
      <div class="h">${esc(story.headline)}</div>
      ${withDeck ? `<div class="d">${esc(story.deck)}</div>` : ''}
    </div></div>`;
  }
  return `<div class="row">${num}<div class="rb">
    <div class="h"><span class="pi">${esc(story.place)} &mdash; </span>${esc(story.headline)}</div>
  </div></div>`;
}

function section(sec, roomy) {
  const rows = sec.stories.map((s, i) => row(s, roomy, i === 0)).join('\n');
  return `<div class="sec">
    <div class="sh"><span class="sq"></span><span class="sn">${esc(sec.name)}</span>
    <span class="sc">${sec.stories.length} STORIES</span></div>
    ${rows}
  </div>`;
}

export function buildPage(d) {
  const left = d.sections.slice(0, 2).map((s) => section(s, true)).join('\n');
  const right = d.sections.slice(2).map((s) => section(s, false)).join('\n');
  const stats = d.numbers
    .map((n) => `<div class="stat"><div class="sv">${esc(n.value)}</div><div class="sl">${esc(n.label)}</div></div>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(d.masthead)} — ${esc(d.edition)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1024px; height: 1024px; overflow: hidden; }
  body { background: #FAF8F5; color: #16130F; font-family: "DejaVu Sans", "Noto Sans", sans-serif; padding: 16px 30px 10px 30px; }
  .tb { display: flex; justify-content: space-between; font-family: "DejaVu Sans Mono", monospace; font-size: 11px; letter-spacing: 2.5px; border-bottom: 3px solid #16130F; padding-bottom: 4px; }
  .tb b { color: #B3122E; }
  .mh { font-family: "Noto Serif", "DejaVu Serif", Georgia, serif; font-weight: 900; font-size: 58px; line-height: .98; letter-spacing: -1px; text-align: center; padding: 6px 0 2px; }
  .mh i { font-style: normal; color: #B3122E; }
  .sm { text-align: center; font-family: "DejaVu Sans Mono", monospace; font-size: 11.5px; letter-spacing: 4px; color: #4A443C; border-bottom: 1px solid #16130F; padding-bottom: 5px; }
  .lz { display: flex; gap: 22px; padding: 7px 0 5px; border-bottom: 3px solid #16130F; }
  .lm { flex: 1 1 640px; }
  .lk { font-family: "DejaVu Sans Mono", monospace; font-size: 11px; letter-spacing: 3px; color: #B3122E; font-weight: bold; margin-bottom: 5px; }
  .lh { font-family: "Noto Serif", "DejaVu Serif", Georgia, serif; font-weight: 900; font-size: 33px; line-height: 1.02; letter-spacing: -.5px; }
  .ls { font-family: "Noto Serif", "DejaVu Serif", Georgia, serif; font-size: 14.5px; line-height: 1.32; color: #3A352E; margin-top: 7px; }
  .ld { flex: 0 0 258px; border-left: 1px solid #C9C2B6; padding-left: 18px; }
  .bn { font-family: "Noto Serif", "DejaVu Serif", Georgia, serif; font-weight: 900; font-size: 66px; line-height: .9; color: #B3122E; }
  .bl { font-family: "DejaVu Sans Mono", monospace; font-size: 10.5px; letter-spacing: 2px; margin-top: 2px; font-weight: bold; }
  .sl2 { margin-top: 6px; border-top: 1px solid #C9C2B6; padding-top: 7px; }
  .sl2 .k { font-family: "DejaVu Sans Mono", monospace; font-size: 10px; letter-spacing: 3px; color: #B3122E; font-weight: bold; }
  .sl2 .h { font-family: "Noto Serif", "DejaVu Serif", Georgia, serif; font-weight: 700; font-size: 18px; line-height: 1.12; margin-top: 3px; }
  .sl2 .s { font-size: 11.5px; line-height: 1.35; color: #3A352E; margin-top: 4px; }
  .bg { display: flex; gap: 26px; padding-top: 5px; }
  .cl, .cr { flex: 1 1 0; }
  .sec { margin-bottom: 6px; }
  .sh { display: flex; align-items: baseline; gap: 8px; border-bottom: 2px solid #16130F; padding-bottom: 3px; margin-bottom: 3px; }
  .sq { width: 10px; height: 10px; background: #B3122E; flex: 0 0 auto; }
  .sn { font-family: "DejaVu Sans Mono", monospace; font-size: 12px; font-weight: bold; letter-spacing: 2.5px; }
  .sc { margin-left: auto; font-family: "DejaVu Sans Mono", monospace; font-size: 9.5px; letter-spacing: 1.5px; color: #6B645A; }
  .row { display: flex; gap: 8px; padding: 1px 0; border-bottom: 1px solid #E4DED2; }
  .row:last-child { border-bottom: none; }
  .n { font-family: "DejaVu Sans Mono", monospace; font-size: 10px; font-weight: bold; color: #B3122E; padding-top: 2px; flex: 0 0 20px; }
  .place { font-family: "DejaVu Sans Mono", monospace; font-size: 9px; letter-spacing: 1.8px; color: #6B645A; margin-bottom: 1px; }
  .pi { font-family: "DejaVu Sans Mono", monospace; font-size: 9px; letter-spacing: 1.2px; color: #B3122E; font-weight: bold; }
  .h { font-family: "Noto Serif", "DejaVu Serif", Georgia, serif; font-weight: 700; font-size: 12.5px; line-height: 1.15; }
  .cr .h { font-size: 11.5px; line-height: 1.12; }
  .d { font-size: 11px; line-height: 1.3; color: #4A443C; margin-top: 2px; }
  .nums { display: flex; border-top: 3px solid #16130F; border-bottom: 1px solid #16130F; margin-top: 4px; padding: 5px 0 4px; }
  .stat { flex: 1 1 0; text-align: center; padding: 0 6px; border-left: 1px solid #E4DED2; }
  .stat:first-child { border-left: none; }
  .sv { font-family: "Noto Serif", "DejaVu Serif", Georgia, serif; font-weight: 900; font-size: 19px; line-height: 1; color: #B3122E; }
  .sl { font-family: "DejaVu Sans Mono", monospace; font-size: 8.5px; letter-spacing: 1px; line-height: 1.3; color: #4A443C; margin-top: 4px; text-transform: uppercase; }
  .ft { display: flex; justify-content: space-between; font-family: "DejaVu Sans Mono", monospace; font-size: 9px; letter-spacing: 1px; color: #6B645A; padding-top: 4px; }
</style></head>
<body>
  <div class="tb"><span>THURSDAY &middot; 26 NOVEMBER 2026 &middot; UTC</span><b>39 STORIES &middot; ONE PAGE</b></div>
  <div class="mh">THE DAY<i>,</i> IN FULL</div>
  <div class="sm">${esc(d.kicker)}</div>
  <div class="lz">
    <div class="lm">
      <div class="lk">${esc(d.lead.kicker)}</div>
      <div class="lh">${esc(d.lead.headline)}</div>
      <div class="ls">${esc(d.lead.standfirst)}</div>
    </div>
    <div class="ld">
      <div class="bn">${esc(d.lead.numeral)}</div>
      <div class="bl">${esc(d.lead.numeralLabel)}</div>
      <div class="sl2">
        <div class="k">${esc(d.secondLead.kicker)}</div>
        <div class="h">${esc(d.secondLead.headline)}</div>
        <div class="s">${esc(d.secondLead.standfirst)}</div>
      </div>
    </div>
  </div>
  <div class="bg">
    <div class="cl">${left}</div>
    <div class="cr">${right}</div>
  </div>
  <div class="nums">${stats}</div>
  <div class="ft"><span>${esc(d.sources)}</span><span>THE DAY, IN FULL</span></div>
</body></html>
`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  writeFileSync(join(HERE, 'front.html'), buildPage(loadStories()), 'utf8');
  console.log('front.html written');
}
