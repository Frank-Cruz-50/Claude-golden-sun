# Field maps

Maps are Tiled `.tmj` files with 16x16 tiles, using the embedded `field` tileset (`../tilesets/field.png`).

- **How they're made:** they're **generated** by `tools/art/maps.mjs`, painted with the helpers in `tools/art/mapgen.mjs` (houses, fences, paths, rugs, and so on). Edit the layout there and run `node tools/art/build.mjs`. Edits made in Tiled are overwritten on the next build.
- **Registering:** list each map in `src/data/maps.json`.
- **Checks:** `tests/content.test.ts` verifies that every reference below resolves.

## Layers

| Layer | Type | Purpose |
|-------|------|---------|
| `ground` | Tile layer | Floor, walls, and props. Drawn under characters |
| `above` | Tile layer | Drawn over characters (tree canopies, roofs) |
| `objects` | Object layer | Everything interactive (see below) |

**Collision:** any tile whose tileset entry has the bool property `collides = true` blocks movement, on any tile layer.

## Object types

Set an object's **Class** (Type) to one of these, and snap it to the tile grid.

| Type | Properties | Behaviour |
|------|------------|-----------|
| `spawn` | `facing` (up/down/left/right) | Where the player appears. Warps and `field.json` refer to it by object **name** |
| `warp` | `map`, `spawn` | Stepping on it loads `map` at its spawn named `spawn` |
| `npc` | `npc` (id in `npcs.json`) | Character with dialogue. Blocks movement |
| `sign` | `dialogue` (id in `dialogue.json`), `hidden` (bool) | Readable. `hidden` = no signpost sprite (letters, shelves, locked doors) |
| `chest` | `chestId` (unique), `item` (id in `items.json`), `qty` | Opens once; remembered by `chestId` |

Map display names come from the map property `displayName`.
