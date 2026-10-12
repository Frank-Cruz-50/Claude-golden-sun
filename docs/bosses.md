# Bosses — Part 1

> **Status: DRAFT, waiting for Frank's approval.**

- **Totals:** 12 story bosses + 4 optional bosses = 16 spirit-dropping bosses.
- **Spirits:** 18 total, because two major bosses drop 2 each.
- **Also:** 1 scripted duel (Cassius), which drops no spirit.
- **Levels:** recommended levels assume the ~10h XP curve, tuned in M15.
- **Spirit details:** see [spirits.md](spirits.md).

## Summary

| # | Boss | Act | Location | Element | Type | Rec. Lv | Spirit drop(s) |
|---|------|-----|----------|---------|------|---------|----------------|
| 1 | Old Bristleback | 1 | Thornhedge Lane | Earth | Story | 3 | Burrow (Earth) |
| 2 | The Bog Matron | 1 | The Sedgewood | Water | **Optional** (Isolde) | 5 | Brook (Water) |
| 3 | The Cairn Warden | 1 | The Old Cairns | Shadow | Story | 6 | Murk (Shadow) |
| 4 | The Mask of Gales | 1 | Ferrygate | Wind | Story | 8 | Flit (Wind) |
| 5 | Spymaster Quell | 2 | Harrow's Rest undercity | Shadow | **Optional** (Vesk) | 10 | Hush (Shadow) |
| 6 | The Mask of Embers | 2 | Watchfire Hill | Fire | Story | 11 | Cinder (Fire) |
| 7 | The Stone Ogres | 2 | Trollgate Woods | Earth | Story | 13 | Cobble (Earth) |
| 8 | The Mask of Tides | 2 | Brightwash Ford | Water | Story | 15 | Drizzle (Water) |
| 9 | Skarn, the Mountain's Wrath | 3 | Frostcrown Pass | Water | Story | 17 | Floe (Water) |
| 10 | The Mere Lurker | 3 | Gate of Orvanthal | Shadow | Story | 18 | Gloam (Shadow) |
| 11 | The Hollow Seraph | 3 | The Silent Halls | Light | **Optional** (Ithra) | 20 | Gleam (Light) |
| 12 | Gorrak Blacktusk & the Cave Brute | 3 | Hall of Records | Earth | Story | 20 | Quarry (Earth) |
| 13 | **Uldraeth, the Furnace Below** | 3 | The Chasm Bridge | Fire | Story, **major** | 22 | Bellows (Fire) **+** Vigil (Light) |
| 14 | The Mirror Warden | 4 | The Heartmere | Light | **Optional** (needs Ithra) | 24 | Halo (Light) |
| 15 | Hagra the Pyre-Witch | 4 | The Teeth | Fire | Story | 25 | Brand (Fire) |
| — | *Cassius (duel)* | 4 | Hollow Hill | Fire | Scripted | — | *none* |
| 16 | **The Crowned Mask** | 4 | Hollow Hill | Wind | Story, **major / finale** | 28 | Tempest (Wind) **+** Wisp (Wind) |

### Element check (3 spirits per element)

| Element | Spirits | Sources |
|---------|---------|---------|
| Earth | Burrow, Cobble, Quarry | All story |
| Fire | Cinder, Bellows, Brand | All story |
| Water | Drizzle, Floe, Brook | Brook is optional |
| Wind | Flit, Tempest, Wisp | All story |
| Shadow | Murk, Gloam, Hush | Hush is optional |
| Light | Vigil, Gleam, Halo | Gleam and Halo are optional |

**Story-only player:** gets 14 spirits. Doing every optional boss gives the full 18, so Light tier-2 and
tier-3 summons are rewards for optional content. *(Flagged as a question below.)*

---

## Boss framework

These rules are the target for M8.

- **Phases:** HP thresholds change the action table. Each phase change gets a short line of dialogue and a visual cue.
- **Telegraphs:** a big attack is announced one turn ahead ("The air grows heavy..."). That gives the player a turn to Defend, heal, or swap.
- **No fleeing** from any boss.
- **Spirit sequence after victory:** the boss collapses → a light rises from it → the **Spirit Acquired** screen (spirit name, element, Set bonus, Unleash effect) → the player picks who holds it, defaulting to whoever has the fewest spirits.

---

## Boss details

### 1. Old Bristleback (Earth) — Act 1 tutorial boss

- **What:** a great boar maddened by the waking Nightglass.
- **Phases:**
  - **Phase 1:** gores and stomps.
  - **Phase 2 (below 50% HP):** scrapes the ground. **Telegraph** → *Trample* (hits the whole party).
- **Purpose:** teaches the Defend action on a telegraph.

### 2. The Bog Matron (Water) — optional, Act 1

- **What:** a bloated toad-hag that has been poisoning the Sedgewood.
- **Moves:** poison spit and summoned leech adds.
- **Phases:** **Phase 2:** she submerges, and the adds keep fighting until she resurfaces.
- **Purpose:** teaches status effects and curing.

### 3. The Cairn Warden (Shadow) — Act 1

- **What:** the wight of a dead king who lures travellers into the mounds.
- **Phases:**
  - **Phase 1:** drains HP.
  - **Phase 2:** the *Grave Chant* **telegraph** puts one party member to sleep, and the boss raises skeleton adds.
- **Weakness:** Light. Before the fight, a field hint shows the party a lantern shrine.

### 4. The Mask of Gales (Wind) — Act 1 finale

- **What:** the first Veilborn fought. Fast, with two actions per turn.
- **Phases:** **Phase 2:** *Howling Cut* **telegraph** hits the whole party hard.
- **Setting:** on the ferry dock. The ferry is "leaving" as a flavour countdown, with no real fail state.

### 5. Spymaster Quell (Shadow) — optional, Act 2 (Vesk's quest)

- **What:** the leader of the Hushed in Harrow's Rest.
- **Moves:** smoke bombs (party accuracy down), and hides behind thugs.
- **Phases:** **Phase 2:** Quell vanishes and strikes from hiding. Their **telegraph** is a target marker on one party member.

### 6. The Mask of Embers (Fire) — Act 2

- **What:** a night ambush on Watchfire Hill.
- **Moves:** burn status.
- **Phases:** **Phase 2 telegraph:** *Shard Blade* targets Wren specifically.
- **Story ending:** whatever the player does, the cutscene ends with Wren wounded.

### 7. The Stone Ogres (Earth, twin fight) — Act 2

- **What:** two ogres, **Grub** and **Mudge**. If one dies, the other enrages.
- **Dawn counter:** survive 12 turns and the sun rises. Both turn to stone, which counts as a win with reduced XP.
- **Purpose:** teaches focus fire vs. stalling.

### 8. The Mask of Tides (Water) — Act 2 finale

- **What:** a fight at the river ford with a Thessari envoy assisting as a scripted helper.
- **Rising Flood:** a multi-turn **telegraph**. On the third turn, the flood hits *everyone* on both sides. Defend to halve it.

### 9. Skarn, the Mountain's Wrath (Water/ice) — Act 3

- **What:** a living blizzard.
- **Phases:**
  - **Phase 1:** freezes party members, who lose their turn.
  - **Phase 2:** *Avalanche* **telegraph**.
- **Note:** high defense, so the player needs magic. Fire is the intended answer.

### 10. The Mere Lurker (Shadow) — Act 3

- **What:** a tentacled horror from the black lake.
- **Parts:** the fight is a body plus 4 tentacles. Each tentacle can grab and disable a party member.
- **Phase 2:** below 50% HP the body is exposed.

### 11. The Hollow Seraph (Light) — optional, Act 3 (Ithra's quest)

- **What:** a fallen Thessari star-guardian.
- **Moves:** blinding light attacks.
- **Phases:**
  - **Phase 2:** heals itself.
  - **Phase 3 telegraph:** *Judgement Ray*.
- **Weakness:** Shadow, which gives Vesk a spotlight if recruited.

### 12. Gorrak Blacktusk & the Cave Brute (Earth) — Act 3

- **What:** a goblin warchief and his chained troll.
- **Moves:** Gorrak buffs the Brute.
- **Phases:** kill Gorrak first and the Brute goes berserk but loses its buffs.

### 13. Uldraeth, the Furnace Below (Fire) — Act 3 major

This is the hardest fight so far and a set piece.

- **Phase 1 (100–60% HP):** fire whips and burn.
- **Phase 2 (60–25% HP):** shadow-flame. *Inferno* **telegraph** hits the whole party hard.
- **Phase 3 (25% HP):** Maelis's scripted stand on the bridge. The party can't act, and the cutscene plays.
- **Drops 2:** Bellows (Fire) and Vigil (Light, from Maelis).

### 14. The Mirror Warden (Light) — optional, Act 4

- **What:** a trial at the Heartmere.
- **Mirror Images:** the boss copies the active party's abilities on a one-turn delay.
- **Phases:** **Phase 2:** splits into 2 copies.
- **Unlock:** Ithra must be in the party.

### 15. Hagra the Pyre-Witch (Fire) — Act 4

- **What:** an Iron Brood shaman at the river portage.
- **Moves:** totems that buff her each turn they stand.
- **Phases:** **Phase 2:** *Pyre* **telegraph**.

### — Cassius, scripted duel (Fire) — Act 4

- **Setup:** Wren alone vs. Cassius.
- **Ending:** after 3 rounds, or when either side's HP hits 50%, the cutscene takes over.
- **Rewards:** no rewards and no game over.

### 16. The Crowned Mask (Wind) — Act 4 finale, Part 1 final boss

- **What:** the Veilborn leader, riding a winged beast.
- **Phase 1:** the mount. Wind attacks hit all party members.
- **Phase 2:** dismounted. Dark Wind magic, and it summons the spirit of a fallen Veilborn.
- **Phase 3:** *Unmaking Gale*, a multi-turn **telegraph**. The Nightglass reacts and briefly gives Wren a unique command, **Defy**, that cancels the attack.
- **Drops 2:** Tempest (Wind) and Wisp (Wind).

---

## Open questions for Frank

1. **Optional Light spirits:** two of the three Light spirits (and one Water, one Shadow) are behind optional bosses. Is that OK, or should every element have all 3 spirits on the story path?
2. **Stone Ogres "survive till dawn" win:** keep it, or make it a straight fight?
3. **Cassius duel:** keep it unlosable, or make it a real (winnable/losable) fight with no spirit drop?
4. **Ogre names:** are "Grub" and "Mudge" too goofy for the tone?
