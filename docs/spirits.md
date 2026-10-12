# Elemental Spirits — the 18 of Part 1

> **Status: DRAFT, waiting for Frank's approval.**
> The numbers are first-pass placeholders; they get balanced in M7 and M15.

## Rules recap

- **Source:** spirits drop **only from bosses**. See [bosses.md](bosses.md).
- **Set:** the holder gets the stat bonus, and the spirit counts toward their class.
- **Unleash** (in battle, from Set): a one-time effect. The spirit then moves to **Standby**.
- **Summon:** uses 1, 2, or 3 Standby spirits of an element. Those spirits go to **Recovery** and return to Set after N turns (draft: N = tier + 1).
- **Moving spirits:** they can move freely between any party members, including the bench, outside battle.
- **Lore:** each spirit is a fragment of the world's soul, freed from the creature that trapped it. Each has a tiny personality that shows on the Spirit Acquired screen.

## The 18 spirits

| Spirit | Element | From boss | Set bonus | Unleash effect | Personality line |
|--------|---------|-----------|-----------|----------------|------------------|
| **Burrow** | Earth | Old Bristleback | HP +10, DEF +2 | Earth damage to 1 target; 30% chance to stun | "Dig deep. Hold fast." |
| **Cobble** | Earth | Stone Ogres | HP +8, DEF +3 | Party DEF up for 3 turns | "Stack us up. We won't fall." |
| **Quarry** | Earth | Gorrak & the Cave Brute | HP +8, ATK +3 | Heavy Earth damage to 1 target, ignores half its DEF | "Break the mountain open." |
| **Cinder** | Fire | Mask of Embers | ATK +3, PP +3 | Fire damage to all enemies | "Just a spark. For now." |
| **Bellows** | Fire | Uldraeth | ATK +2, AGI +2 | Party ATK up for 3 turns | "Breathe in. Burn bright." |
| **Brand** | Fire | Hagra the Pyre-Witch | ATK +4, HP +6 | Big Fire hit on 1 target; burns | "Mark them. Let them remember." |
| **Drizzle** | Water | Mask of Tides | HP +8, PP +4 | Heal the whole party (small) | "Soft rain, soft rain." |
| **Floe** | Water | Skarn | DEF +2, PP +4 | Water damage to 1 target; 40% chance to freeze (it loses its turn) | "Still. Cold. Quiet." |
| **Brook** | Water | The Bog Matron | PP +5, HP +6 | Cure all status effects on the party + regen for 3 turns | "Clean water at last!" |
| **Flit** | Wind | Mask of Gales | AGI +3, ATK +1 | Party AGI up for 3 turns | "Faster! Faster!" |
| **Tempest** | Wind | The Crowned Mask | ATK +3, AGI +2 | Wind damage to all enemies; delays their next turn | "Let the sky howl." |
| **Wisp** | Wind | The Crowned Mask | AGI +2, PP +4 | Party evasion up for 2 turns | "Now you see me..." |
| **Murk** | Shadow | The Cairn Warden | ATK +2, AGI +2 | Shadow damage to 1 target; drains HP to the user | "The dark keeps what it takes." |
| **Gloam** | Shadow | The Mere Lurker | PP +4, DEF +2 | Lower all enemies' ATK for 3 turns | "Dim their fire." |
| **Hush** | Shadow | Spymaster Quell | AGI +3, ATK +2 | 25% chance to instantly defeat a non-boss; otherwise Shadow damage | "Shh. Shh. Gone." |
| **Vigil** | Light | Uldraeth (Maelis's last light) | HP +8, PP +5 | Revive one fallen ally at 50% HP (or heal one ally a lot) | "She asked me to keep watch over you." |
| **Gleam** | Light | The Hollow Seraph | PP +4, DEF +2 | Light damage to all enemies; double vs. Shadow | "Shine, little stars." |
| **Halo** | Light | The Mirror Warden | HP +12, DEF +1 | Medium party heal + barrier that halves the next hit | "Nothing gets past me." |

**Count:** 3 Earth, 3 Fire, 3 Water, 3 Wind, 3 Light, 3 Shadow = **18**.

## Summons (draft)

There are 3 tiers per element, needing 1, 2, or 3 Standby spirits of that element, plus 3 hybrid summons.
Names are original. Effects are draft.

| Element | Tier 1 (1 spirit) | Tier 2 (2 spirits) | Tier 3 (3 spirits) |
|---------|-------------------|--------------------|--------------------|
| Earth | **Bramble Hound** | **Tor Golem** | **The Sleeping Hill** |
| Fire | **Ember Salamander** | **Pyre Stag** | **The Sunforge Titan** |
| Water | **Rain Heron** | **Mere Serpent** | **The Tidemother** |
| Wind | **Storm Kestrel** | **Gale Lynx** | **The Sky Leviathan** |
| Light | **Lantern Moth** | **Dawn Hart** | **The Choir of Morning** |
| Shadow | **Night Owl** | **Grave Mare** | **The Unmoon** |

**Hybrid summons:**

| Summon | Cost | Effect |
|--------|------|--------|
| **Steam Wyrm** | 1 Fire + 1 Water | Damage to all enemies + lowers their DEF |
| **Dust Devil** | 1 Earth + 1 Wind | Damage to all enemies + blinds them |
| **The Twilight Sovereign** | 1 Light + 1 Shadow | Heavy non-elemental damage. Late-game, since both elements are scarce |

## Classes (placeholder, a separate doc before M7)

A class is decided by the holder's base element plus the number of Set spirits of each element. The
full class table will be drafted as `docs/classes.md` before M7 and sent for approval separately. It's left
out of M1 so the story and roster get approved first.
