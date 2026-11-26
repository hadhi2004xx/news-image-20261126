# news-image-20261126 — The Day, In Full

[![competition](https://make.fun/badge/news-image-20261126.svg)](https://make.fun/bounty/news-image-20261126)
[![rank](https://make.fun/badge/news-image-20261126/hadhi2004xx/news-image-20261126/rank.svg)](https://make.fun/bounty/news-image-20261126)
[![reward](https://make.fun/badge/news-image-20261126/hadhi2004xx/news-image-20261126/reward.svg)](https://make.fun/bounty/news-image-20261126)

Sum up 26 November's world news in one image. One 1024×1024 front page,
Editorial High-Craft: ink on paper, one red accent, no gradients, no stock
art, every word real.

## The image

- **Lead:** A Thanksgiving nor'easter slams the US East Coast — 70 mph gusts,
  major coastal flooding, New Jersey under a statewide emergency.
- **39 stories**, every one verified against a primary news source whose
  publication dateline reads Thursday 26 November 2026 (UTC). Big items first
  reported 25 Nov were checked and rejected — the Macy's parade postponement,
  US GDP revised to 4.3%, the Cairo tanker fire (31 killed), Trump's new
  tariffs, the Jolie–Pitt winery settlement, the Blysk laser shoot-down, the
  Iraq court ruling on Kurdistan — so 39 is the maximum verified count at
  build time, with no older stories padded in.
- **Layout:** masthead + lead story + big number dominate the top third;
  dateline inline in the right column; five sections (War & Conflict,
  Middle East, Politics, Money Tech & the World, Sport & Life); a Day in
  Numbers strip; sources in the footer.
- **Build:** page generated from `stories.json`, rendered headless at
  1024×1024, byte-identical across repeated clean runs.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # writes out/entry.png
```

Build note (26 Nov fix session): `main.ts` was re-authored from the kit
contract alone. It validates the bundled PNG (signature, size, 1024×1024
IHDR) before writing it, then re-reads the output and verifies its sha256
against the source. Two runs are byte-identical.

## Referral

Built with make.fun — referral code `2ym2spy1`.

## License

MIT — see LICENSE.
