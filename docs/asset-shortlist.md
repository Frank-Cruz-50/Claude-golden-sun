# M3 Asset Shortlist (draft)

> **Status: SUPERSEDED.** Frank chose custom art drawn by Claude (see CLAUDE.md → Art). Kept only for
> reference in case packs are needed for enemies, music, or sound.
>
> **Original status: RESEARCH DRAFT.** Licenses below come from search results, **not yet confirmed on the download
> pages**. This session's network blocks itch.io and opengameart.org. Every license must be read on the
> actual page before anything goes into `/assets/raw` (CLAUDE.md rule).

**Goal:** a look as close as practical to a GBA Golden Sun style: lush 16x16 tiles, 3/4 view, warm palette.
Frank's choice: **free only**, with one paid option for comparison.

## Free candidates

| Pack | Covers | License (per search, unverified) | Fit vs. Golden Sun look |
|------|--------|----------------------------------|-------------------------|
| **Ninja Adventure** — Pixel-boy & AAA ([itch.io](https://pixel-boy.itch.io/ninja-adventure-asset-pack)) | Tiles, characters, monsters, bosses, UI, fonts, SFX, music | CC0; creator confirmed commercial use | **Most complete free pack.** Simpler, cuter style. Characters are small (~16x16, below our 16x24 spec) |
| **Zelda-like tilesets and sprites** — ArMM1998 ([OpenGameArt](https://opengameart.org/content/zelda-like-tilesets-and-sprites)) | 16x16 overworld, cave, and indoor tiles, a hero, a few enemies | CC0 according to community comments; license field not seen | **Closest free match for lush GBA field tiles.** Too few characters to cover a 10-person roster alone |
| **Willibab's Free Pixel Battle Backgrounds** ([itch.io](https://willibab.itch.io/willibabs-free-pixel-battle-backgrounds)) | Battle backgrounds, forest included | "Free to use in personal and commercial projects", no resale | Pixel battle backdrops. Simpler than Golden Sun's painted ones |
| **"free batt"** — Raharl ([itch.io](https://raharlpixel.itch.io/free-batt)) | Monster battlers | Commercial use OK, no resale | Front-facing enemies. Need to check scale and style |

**Rejected:**

| Pack | Reason |
|------|--------|
| Battle RPG Backgrounds (arexxuru), free version | Non-commercial only |
| Forest images (nabrappy) | Non-commercial only |
| Fat Cat Games warriors, free sample | Non-commercial only |
| Painterly Battle Backgrounds (kalponic) | Tagged AI-generated, and not pixel art |
| tiopalada RPG Battle 2D | CC-BY-SA, which CLAUDE.md avoids without approval |

**Biggest gap:** no free pack found with **back-view party battle sprites**, the party-seen-from-behind look in
Golden Sun battles, at a consistent style for 10 characters.

## Paid comparison

| Pack | Covers | License (per search, unverified) | Notes |
|------|--------|----------------------------------|-------|
| **Time Fantasy** — finalbossblues ([itch.io](https://finalbossblues.itch.io/time-fantasy-rpg-assets)) | Large 16x16 tile and character family with many add-on tilesets | Commercial use OK, edits OK, no engine limits, no redistribution. Credit not required on at least some packs. **Avoid the RPG Maker DLC version** (RPG Maker only) | A classic 16-bit JRPG look with one consistent family. Price not confirmed in search |
| **Time Fantasy monster battlers** — Tyler Warren ([itch.io](https://tylerjwarren.itch.io/7th-50-time-fantasy-tribute)) | Front-facing enemy battlers matched to Time Fantasy | Royalty-free, any engine | About $15 per set (was on sale for $3.75); a 23-pack bundle for $49.99 |

## Next steps

1. Read each license on its real page. This needs network access, or Frank sends the pages.
2. Download into `/assets/raw/<pack>/` untouched, and log each pack in `assets/CREDITS.md`.
3. Build mock-ups of the Brindlewick village in the top free option and in Time Fantasy for side-by-side comparison.
