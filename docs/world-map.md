# World Map & Act-by-Act Map List — Part 1

> **Status: DRAFT, waiting for Frank's approval.**
> Times are first-play estimates that include battles and story. The target is about 10h total.

## Overworld

There is **one continuous overworld** (Golden Sun style): a walkable, scaled-down map with location icons.

- Entering an icon loads that location's Tiled map.
- The overworld has random encounters at a per-region rate.
- Story blockers gate progress:
  - Ferrygate's river (Act 1 → 2)
  - The Brightwash Ford (→ Velmara)
  - The Frostcrown range (Act 3)
  - The Veyra River (Act 4, traveled by boat)

Rough layout (west → east, north at top):

```
 N                                   FROSTCROWN MTNS  ▲▲▲▲▲
                                   ▲▲ Frostcrown Pass ▲▲
  DOWNMEADOWS         GREENWAY     ▲  [Orvanthal Gate]  ▲
 [Brindlewick]──Thornhedge──[Harrow's Rest]──Fenlow──[Watchfire Hill]
      │   \                                  │            \
 [Sedgewood] [Old Cairns]           (undercity)     [Trollgate Woods]
      │                                                      │
  [Ferrygate]~~~~ river ~~~~                         [Brightwash Ford]
                                                             │
                                                        [VELMARA]
                                                             │
                             [Ashvale Ruins]────────────────┘
                                  │      (Orvanthal exits east)
                              [AURWYN, the Gilded Wood]
                                  │
                        ≈≈≈ VEYRA RIVER ≈≈≈ [The Teeth] ≈≈ [Twin Wardens] ≈≈ [Hollow Hill] ≈≈ → Duskreach (Part 2)
```

## Map legend

| Field | Meaning |
|-------|---------|
| **Type** | Town (shops/inn/save), Route (connecting path), Dungeon, Interior, Scene (story-only), Overworld |
| **Enc.** | Random encounter rate: None / Low / Med / High |
| **Puzzles** | **R** = required (progression), **O** = optional (guards chests, side areas, recruits) |
| **Save** | S = save point, C = camp (save + party swap), I = inn |

---

## Act 1: Homeland (~2h)

Region: the Downmeadows. Party level ~1–8.

| Map ID | Name | Type | Enc. | Puzzles | Boss | Save | Est. |
|--------|------|------|------|---------|------|------|------|
| `ow_downmeadows` | Downmeadows (overworld) | Overworld | Low | — | — | — | 5m |
| `brindlewick` | Brindlewick | Town | None | — | — | S, I | 20m |
| `brindlewick_cottage` | Hesper's Cottage | Interior | None | — | — | — | (incl.) |
| `brindlewick_orchard` | The Orchard | Route | Low (tutorial) | — | — | — | 5m |
| `thornhedge_lane` | Thornhedge Lane | Route | Low | — | Old Bristleback | — | 15m |
| `willowbend_road` | Willowbend Road | Route | Low | — | (Veilborn hide scene) | — | 10m |
| `sedgewood` | The Sedgewood | Dungeon | Med | O ×2 (Push) | *Bog Matron (opt)* | C | 20m (opt) |
| `old_cairns_1` / `_2` | The Old Cairns | Dungeon (2F) | Med | **R ×2** (Push blocks) | Cairn Warden | C | 30m |
| `ferrygate` | Ferrygate | Town (small) + dock | None | — | Mask of Gales | S | 15m |

**Required puzzles: 2.** Push is learned at the start of the Old Cairns, and the two required puzzles there teach it.

## Act 2: The Road & the Haven (~2.5h)

Region: the Greenway, the Wildlands, Velmara. Party level ~8–15.

| Map ID | Name | Type | Enc. | Puzzles | Boss | Save | Est. |
|--------|------|------|------|---------|------|------|------|
| `ow_greenway` | Greenway (overworld) | Overworld | Med | — | — | — | 10m |
| `harrows_rest` | Harrow's Rest | Town | None | — | — | S, I | 20m |
| `harrows_rest_inn` | The Lantern Inn | Interior | None | — | — | — | (incl.) |
| `harrows_undercity` | The Undercity | Dungeon | Med | O ×1 (Push) | *Spymaster Quell (opt)* | — | 20m (opt) |
| `fenlow_marshes` | Fenlow Marshes | Route | High | — | — | C | 15m |
| `watchfire_hill` | Watchfire Hill | Dungeon (small) | Med | — | Mask of Embers | C | 15m |
| `trollgate_woods` | Trollgate Woods | Dungeon | Med | **R ×1** (Push) | Stone Ogres | C | 25m |
| `brightwash_ford` | Brightwash Ford | Route (chase) | None | — | Mask of Tides | — | 10m |
| `velmara` / `velmara_council` / `velmara_gardens` | Velmara | Town (city) | None | O ×1 (Gust tutorial) | — | S, I | 30m |

**Required puzzles: 1.** Wren is locked out from Watchfire Hill to Velmara, so Tobin leads those maps.

## Act 3: The Mountain & the Deep (~3h)

Region: the Frostcrown and Orvanthal. Party level ~15–23.

| Map ID | Name | Type | Enc. | Puzzles | Boss | Save | Est. |
|--------|------|------|------|---------|------|------|------|
| `ow_frostcrown` | Frostcrown foothills (overworld) | Overworld | Med | — | — | — | 5m |
| `ashvale_ruins` | Ashvale Ruins | Route | Med | O ×2 (Gust fog, Push) | — | C | 20m |
| `frostcrown_pass` | Frostcrown Pass | Dungeon | High | — | Skarn | C | 30m |
| `orvanthal_gate` | Gate of Orvanthal | Dungeon (small) | Low | **R ×1** (riddle door) | Mere Lurker | — | 15m |
| `orvanthal_upper` | Upper Halls | Dungeon | Med | **R ×1** (Grasp lever) + O ×2 | — | C | 30m |
| `orvanthal_silent` | The Silent Halls | Dungeon (side) | High | O ×2 (Grasp, Gust) | *Hollow Seraph (opt)* | — | 25m (opt) |
| `orvanthal_deep` | Deep Halls | Dungeon | High | O ×1 | — | C | 25m |
| `hall_of_records` | Hall of Records | Dungeon (room) | None | — | Gorrak & Cave Brute | — | 15m |
| `chasm_bridge` | The Chasm Bridge | Scene + Boss | None | — | **Uldraeth** | — | 15m |
| `eastern_slopes` | Eastern Slopes | Scene | None | — | — | S | 5m |

**Required puzzles: 2.** Grasp is learned in the Upper Halls, and the required lever puzzle teaches it.

## Act 4: The Golden Wood & the River (~2.5h)

Region: Aurwyn and the Veyra River. Party level ~23–28.

| Map ID | Name | Type | Enc. | Puzzles | Boss | Save | Est. |
|--------|------|------|------|---------|------|------|------|
| `aurwyn_border` | Aurwyn Border | Route | Low | O ×1 (Gust) | — | — | 10m |
| `aurwyn` / `aurwyn_hall` | Aurwyn, the Gilded Wood | Town | None | — | — | S, I | 25m |
| `heartmere` | The Heartmere | Scene (+ opt trial) | None | — | *Mirror Warden (opt)* | — | 15m (opt) |
| `veyra_river` | The Veyra River | Boat travel (special) | Med (on landings) | — | — | — | 15m |
| `reedbank_landing` | Reedbank Landing | Route | Med | O ×1 (Grasp) | — | C | 15m |
| `the_teeth` | The Teeth (portage) | Dungeon | High | **R ×1** (Grasp rope) | Hagra | C | 25m |
| `twin_wardens` | The Twin Wardens | Scene | None | — | — | — | 5m |
| `hollow_hill` | Hollow Hill | Dungeon (finale) | Waves | — | Cassius duel → **Crowned Mask** | C | 30m |
| `far_shore` | The Far Shore | Scene (ending) | None | — | — | — | 5m |

**Required puzzles: 1.** River travel is a cutscene-style scrolling screen between landings, not free sailing.

---

## Time budget

| Act | Story path | Optional content | Total |
|-----|------------|------------------|-------|
| 1 | ~1h40m | ~20m | ~2h |
| 2 | ~2h10m | ~20m | ~2.5h |
| 3 | ~2h35m | ~25m | ~3h |
| 4 | ~2h15m | ~15m | ~2.5h |
| **Total** | **~8h40m** | **~1h20m** | **~10h** |

## Town services summary

| Town | Shop | Inn | Save | Notes |
|------|------|-----|------|-------|
| Brindlewick | Items, basic gear | ✓ | ✓ | Tutorial hub |
| Ferrygate | Items | — | ✓ | Small |
| Harrow's Rest | Items, weapons, armor | ✓ | ✓ | Side quest hub (Vesk) |
| Velmara | Items, weapons, armor, Thessari specialty | ✓ | ✓ | Ithra quest start |
| Aurwyn | Items, weapons, armor, cloaks | ✓ | ✓ | Last full town in Part 1 |

## Open questions for Frank

1. **One continuous overworld or a region map per act?** Continuous is closer to Golden Sun but costs more map work. Region-per-act is cheaper.
2. **River travel:** a non-interactive scrolling cutscene between landings, as proposed, or a simple steerable boat?
3. **Return trips:** should the player be able to walk back to earlier regions once they've left? Proposed: yes until Act 3 (the Orvanthal door seals behind them), and then no.
