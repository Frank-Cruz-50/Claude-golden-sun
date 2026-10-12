# Project: GBA-Style JRPG — Part 1 (working title: TBD)

A top-down, turn-based JRPG in the spirit of Golden Sun (GBA, 2001): elemental magic,
elemental spirits that boost stats, change classes, and power summons, and light
field-ability puzzles. Target: a **~10-hour Part 1** of a larger story.

**IP rule:** all names, characters, places, dialogue, and art must be original. The story
uses The Lord of the Rings as a *structural and tonal baseline only*. Do not use any
Tolkien names, places, races-as-named (e.g. "hobbit"), or quoted text, and do not use
any Golden Sun / Nintendo / Camelot names or assets.

---

## Locked decisions
- **Platform:** browser (Phaser 3). Emulator/ROM is out of scope.
- **Scope:** full Part 1, ~10 hours, 4 acts, ends on a cliffhanger.
- **Setting:** classic high fantasy, LOTR-inspired structure.
- **Party:** 10 recruitable characters, 4 active at a time.
- **Elements:** 6.
- **Spirits:** obtained **only by defeating bosses**.
- **Field puzzles:** nice-to-have, light, never a hard progression gate except for a few simple ones.
- **Art:** free asset packs chosen by Claude (see Assets).

---

## Tech stack
- **Engine:** Phaser 3 + TypeScript, built with Vite
- **Maps:** Tiled editor (.tmj JSON export), 16x16 tiles
- **Tests:** Vitest for damage formulas, element modifiers, the spirit/class system, and XP
- **Resolution:** 240x160 internal (GBA), integer-scaled, pixelArt: true, no smoothing
- **Saves:** localStorage, 3 slots plus an autosave on map transitions
- **Input:** keyboard + gamepad. A = confirm, B = cancel, L/R = field ability shortcuts, Start = menu

## Folder structure
```
/docs          story-bible.md, characters.md, world-map.md, bosses.md (Claude drafts, Frank approves)
/src
  /scenes      Boot, Preload, Title, Field, Battle, Menu, Dialogue (overlay), Camp
  /systems     battle/, party/, spirits/, classes/, inventory/, field-abilities/,
               quests/, save/, audio/
  /entities    Player, NPC, PushableBlock, Interactable
  /ui          text box, menus, HP/PP bars, cursor, portraits
  /data        JSON only: characters, classes, abilities, spirits, summons, enemies,
               bosses, items, equipment, encounters, shops, dialogue, quests, maps index
/assets
  /raw         untouched downloaded packs
  /sprites /tilesets /maps /ui /audio
  CREDITS.md   every asset: source URL, author, license
/tests
```

## Rules for Claude Code
1. **Data-driven.** All stats, abilities, enemies, items, dialogue, and quests live in /data JSON. No hardcoded content.
2. **Every milestone must be playable.** Run `npm run dev` and verify before moving on.
3. **Placeholder art until M3.** After that, use real assets from the chosen packs.
4. **Pure logic.** Battle, spirit, and class logic is plain TypeScript with no Phaser imports, and is unit tested.
5. **Commit at the end of each milestone** with a short summary.
6. **Ask before** adding dependencies beyond Phaser, Vite, TypeScript, and Vitest.
7. **Docs first for content.** Draft story/character/boss docs in /docs and wait for Frank's approval before building that content.

---

## Story framework (Part 1)
LOTR "Fellowship" structure, with original details for Claude to draft in /docs/story-bible.md:
- **Act 1: Homeland (~2h).** A quiet rural village. The protagonist inherits a dangerous artifact tied to a returning dark power. Hunters arrive, and the protagonist flees with 1-2 friends.
- **Act 2: The Road & the Haven (~2.5h).** Wilderness, a frontier town, a mysterious ranger-type ally. They reach a sanctuary city of an ancient race, where a council forms the company.
- **Act 3: The Mountain & the Deep (~3h).** A failed mountain pass forces them into vast underground ruins of a fallen kingdom. An ancient terror wakes. A mentor figure is lost.
- **Act 4: The Golden Wood & the River (~2.5h).** A hidden forest realm, then a river journey. Betrayal and an ambush break the company apart. Part 1 ends on a cliffhanger.

## Party & recruitment
- **10 recruitable characters,** each with an original name, a base element, a role, and a short arc. Suggested element spread: Earth 2, Fire 2, Water 2, Wind 2, Light 1, Shadow 1.
- **Recruitment:** about 7 are story recruits spread across Acts 1-3. About 3 are optional, recruited through side quests.
- **Active party** is 4. Swap freely in the field menu and at camps. In battle, swapping costs that character's turn.
- **Benched members** earn 75% XP to prevent grinding.
- Characters can leave and return temporarily for story beats; the party system must support locking members in or out.

## Elements (6)
Earth, Fire, Water, Wind, Light, Shadow (or original names).
- Cycle: Fire > Wind > Earth > Water > Fire (1.5x damage, 0.5x reversed)
- Light and Shadow deal 1.5x to each other and are neutral to the other four
- Every character, ability, spirit, and enemy has an element

## Elemental spirits (Djinn equivalent): BOSS-ONLY
- **Spirits are obtained only by defeating bosses.** There are no field pickups or random encounters for them.
- Each boss has an element and drops 1 spirit of that element. Some major story bosses drop 2.
- **Target for Part 1: 18 spirits (3 per element),** from ~12 story bosses and ~4 optional bosses (optional bosses are tied to side quests and optional recruits).
- **States:**
  - **Set:** gives a stat boost to the holder and changes their class
  - **Standby:** after being unleashed in battle (one-time effect: attack, buff, heal, etc.), it waits for a summon
  - **Recovery:** after a summon, it returns to Set after N turns
- **Summons:** each element has 3 tiers, needing 1, 2, or 3 Standby spirits of that element. Plus 2-3 hybrid summons for mixed elements.
- **Classes:** determined by the holder's base element combined with the count of Set spirits per element. Each class line has 3-4 tiers with its own ability list.
- Spirits can be moved freely between any party members, including benched ones, outside battle.
- Because spirits are rare, each one should feel like a major reward: show a spirit-acquired cutscene/screen after the boss.

## Battle
- Turn-based. Choose actions for all 4 party members, then everyone acts by Agility order (with slight randomness).
- Actions: Attack, Ability (PP), Spirit, Summon, Item, Defend, Swap, Flee (no fleeing from bosses).
- Front-view layout: enemies in the center, party HP/PP bars at the bottom.
- Random encounters use a step counter with a per-map rate. Add an item/ability that reduces encounters.
- Bosses get multi-phase patterns and telegraphed big attacks.

## Field abilities (light)
- **Push:** move blocks or pillars
- **Gust:** clear leaves and fog, reveal hidden paths
- **Grasp:** pull distant levers or items
- Learned from story progression, not tied to spirits. Most puzzles guard optional chests, side areas, and optional recruits. At most 2-3 simple required puzzles per act.

## Field
- 4-direction tile-grid movement with smooth stepping and a run button
- Collision, NPCs, signs, chests, doors, map transitions, simple overworld map
- Towns: shops, inn, save point. **Camps** in dungeons: swap party and save.
- Side quest log

## Menus
Party (active/bench swap), Abilities, Spirits (assign + Set/Standby per character), Items,
Equipment, Status/Class, Quests, Save, Options

---

## Milestones
- **M0 Scaffold:** Vite + Phaser + TS, scaled canvas, scene flow Boot → Title → Field
- **M1 Docs:** story bible, 10 characters, 18 spirits, boss list, act-by-act map list → **Frank approves**
- **M2 Field:** Tiled map, movement, collision, camera, transitions, NPCs, dialogue, chests
- **M3 Assets:** pick free packs, write CREDITS.md, swap out placeholders → **Frank approves look**
- **M4 Battle core:** encounters, turn order, basic actions, XP/leveling, victory/defeat
- **M5 Party system:** 10-character roster, active/bench, recruitment, swap in battle
- **M6 Abilities, items, equipment, shops, inn**
- **M7 Spirits, classes, summons:** boss drops, all 3 states, class table, summon tiers
- **M8 Bosses:** boss framework (phases, telegraphs, spirit-drop sequence)
- **M9 Field abilities:** Push, Gust, Grasp, plus a puzzle toolkit
- **M10 Save/load, menus polish, audio**
- **M11 Vertical slice:** Act 1 complete and polished → **playtest gate before mass content**
- **M12-M14 Content:** Acts 2, 3, and 4 (one milestone each)
- **M15 Balance & polish:** difficulty curve, XP pacing to hit ~10h, bug pass, ending cliffhanger

---

## Assets (free packs, Claude picks)
- **Licenses:** prefer CC0. Accept CC-BY, and packs whose terms allow free commercial use with credit. **Verify the license on the actual download page** and log it in /assets/CREDITS.md. Avoid CC-BY-SA, GPL, and "non-commercial only" unless Frank approves.
- **Consistency matters more than quality.** Pick ONE main family for tiles and characters at the same scale (16x16 tiles, ~16x24 to 24x32 characters, top-down 3/4 view, RPG Maker/GBA style). Only mix packs if their palettes and scale match.
- Separate packs are fine for battle enemies, UI, sound effects, and music.
- If Claude Code can't download a pack directly, give Frank a list (pack name, URL, license, what it covers) and he'll drop the zips into /assets/raw.
- Specs: tiles 16x16; field characters 4 directions with 3-4 walk frames; battle party 32-48px; enemies 32-96px; portraits 32-48px; PNG with transparency, no anti-aliasing.
