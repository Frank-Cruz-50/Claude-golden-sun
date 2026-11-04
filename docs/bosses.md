# Bosses — Part 1

> **Status: APPROVED by Frank (M1).** Changes from here on need Frank's sign-off.

- **Totals:** 12 story bosses + 4 optional bosses = 16 spirit-dropping bosses.
- **Spirits:** 18 total, because two major bosses drop 2 each.
- **Also:** the Cassius duels (3 linked fights, Acts 3–4), which drop no spirits.
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
| — | *Cassius: Duel 1 + "The Grip"* | 3 | Shelter Below the Pass | Fire (Gripped) | Story duel | 17 | *none* |
| 10 | The Mere Lurker | 3 | Gate of Orvanthal | Shadow | Story | 18 | Gloam (Shadow) |
| 11 | The Hollow Seraph | 3 | The Silent Halls | Light | **Optional** (Ithra) | 20 | Gleam (Light) |
| 12 | Gorrak Blacktusk & the Cave Brute | 3 | Hall of Records | Earth | Story | 20 | Quarry (Earth) |
| 13 | **Uldraeth, the Furnace Below** | 3 | The Chasm Bridge | Fire | Story, **major** | 22 | Bellows (Fire) **+** Vigil (Light) |
| 14 | The Mirror Warden | 4 | The Heartmere | Light | **Optional** (needs Ithra) | 24 | Halo (Light) |
| 15 | Hagra the Pyre-Witch | 4 | The Teeth | Fire | Story | 25 | Brand (Fire) |
| — | *Cassius rematch (1v1)* | 4 | Hollow Hill | Fire → Fire/Shadow | Story duel | 26 | *none (grants the Lamplighter's Legacy)* |
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

**Story-only player:** gets 14 spirits. Doing every optional boss gives the full 18.

**Approved:** all 18 are required for the **true ending**, where everyone is saved. See the Endings section of
[story-bible.md](story-bible.md).

The Act 1–2 optional bosses (Bog Matron, Spymaster Quell) become unreachable after the Gate of
Orvanthal, so the game warns the player before that point of no return.

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

### — The Cassius duels (no spirit drops) — Acts 3 and 4

The Cassius story is three linked fights. None of them drops a spirit (no spirit lives in him), so
they don't count toward the 16 spirit bosses.

#### Duel 1, "The Whisper" — Act 3, Shelter Below the Pass (Wren solo, **unwinnable**)

- **Setup:** after the failed Frostcrown Pass, the stone's grip takes Cassius and he attacks Wren alone at the edge of camp.
- **The fight:** Cassius is far stronger. His hits are huge, and Wren's damage barely scratches him.
- **Ending:** it ends when Wren drops to 25% HP or after 4 rounds. Maelis's lantern floods the clearing, and the cutscene leads straight into the group fight.
- **Purpose:** shows what the Nightglass does to good people.

#### Group fight, "The Grip" — Act 3, Shelter Below the Pass (full party + Maelis, **losable**)

- **Setup:** Maelis plus the active party against "Gripped" Cassius.
  - Maelis is **locked into the active party** for this fight.
  - Wren starts at his duel HP.
- **Grip gauge:** the fight ends when the gauge hits 0, not when his HP does.
  - Normal hits lower it a little.
  - **Light hits do double**, and Cassius takes double damage from Light.
- **Maelis's unique command, Unbind:** a massive cut to the Grip gauge with a 2-turn cooldown. This is her moment to shine.
- **Phases:**
  - **Phase 1:** heavy Fire attacks, aimed at the weakest party members.
  - **Phase 2 (Grip below 50%):** *Halvard's Fury* **telegraph**, a huge hit on the whole party. Maelis's Sanctuary or Defend blunts it.
- **Losing:** a party wipe is a game over. The game retries from the camp before the Shelter.
- **Recommended level:** 17.

#### The rematch, "The Lamplighter's Heir" — Act 4, Hollow Hill (Wren vs. Cassius 1v1, **losable**, two phases)

- **Setup:** after Maelis's death, the grip takes Cassius again. There's nobody to save either of them this time.
- **Phase 1:** Earth Wren vs. Fire Cassius. A straight, hard duel where Cassius has the edge in raw power.
  - *Brandstrike* **telegraph**: a big hit. Wren can Defend to halve it.
- **Transition (at 50% of Cassius's HP):**
  - Cassius drives the stolen **Veilborn shard-splinter** into his sword hand. His fire turns black.
  - The dark lantern-staff ignites in Wren's hands, and Vigil speaks: "She asked me to keep watch over you."
  - **The Lamplighter's Legacy awakens.**
- **Phase 2:** both get a boost.
  - **Cassius becomes Shadowflame Cassius** (Fire + Shadow):
    - Higher ATK.
    - Life-draining black-fire attacks.
    - *Ashen Oath* **telegraph**, a near-lethal hit.
  - **Wren gains the full Legacy:**
    - Permanent stat jump.
    - Lantern Flare and Kindly Light.
    - Lamplighter's Staff equipped.
    - Wren's Light hits Shadowflame Cassius for 1.5x, the same edge Maelis had over him in Act 3.
  - Light and Shadow both hit each other for 1.5x, so Phase 2 is a fast, swingy duel with high stakes on both sides.
- **Losing:** game over. The game retries from the Hollow Hill camp, just before the duel.
- **Rewards:** no spirit. The Legacy is the reward, and it is permanent.
- **Recommended level:** 26.
- **Part 2 seed:** the shard has marked Cassius. In the normal ending, it's how the Crowned Mask finds and claims him as the Eighth Mask. A future Part 2 rematch against the Eighth Mask can follow the normal-ending path.

### 16. The Crowned Mask (Wind) — Act 4 finale, Part 1 final boss

- **What:** the Veilborn leader, riding a winged beast.
- **Phase 1:** the mount. Wind attacks hit all party members.
- **Phase 2:** dismounted. Dark Wind magic, and it summons the spirit of a fallen Veilborn.
- **Phase 3:** *Unmaking Gale*, a multi-turn **telegraph**. The Nightglass reacts and briefly gives Wren a unique command, **Defy**, that cancels the attack.
- **Drops 2:** Tempest (Wind) and Wisp (Wind).

---

## Decisions (approved by Frank)

1. **Stone Ogres:** keep them as written: Grub and Mudge, twin fight, and the "survive until dawn" win.
2. **Cassius:** the three-fight arc above.
