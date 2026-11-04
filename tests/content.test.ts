/**
 * Content integrity: every map and data reference must resolve, so broken
 * links are caught here instead of at runtime.
 */
import { describe, expect, it } from 'vitest';
import dialogue from '../src/data/dialogue.json';
import field from '../src/data/field.json';
import items from '../src/data/items.json';
import maps from '../src/data/maps.json';
import npcs from '../src/data/npcs.json';
import { buildCollisionGrid, isTileBlocked, parseFieldObjects, type FieldObject, type TiledMap } from '../src/systems/field/tiledMap';

const rawMaps = import.meta.glob('../assets/maps/*.tmj', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>;

const loaded = Object.fromEntries(
  Object.entries(maps).map(([id, entry]) => {
    const raw = rawMaps[`../assets/maps/${entry.file}`];
    if (!raw) throw new Error(`maps.json: missing file ${entry.file}`);
    const map = JSON.parse(raw) as TiledMap;
    return [id, { map, objects: parseFieldObjects(map) }];
  }),
) as Record<string, { map: TiledMap; objects: FieldObject[] }>;

describe.each(Object.keys(loaded))('map %s', (id) => {
  const { map, objects } = loaded[id];
  const grid = buildCollisionGrid(map);

  it('uses the placeholder tileset and 16px tiles', () => {
    expect(map.tilewidth).toBe(16);
    expect(map.tileheight).toBe(16);
    expect(map.tilesets.map((t) => t.name)).toContain('placeholder');
  });

  it('places every spawn and warp on a walkable tile', () => {
    for (const o of objects.filter((o) => o.kind === 'spawn' || o.kind === 'warp')) {
      expect(isTileBlocked(map, grid, o.x, o.y), `${o.kind} ${o.name}`).toBe(false);
    }
  });

  it('has warps that lead to existing maps and spawns', () => {
    for (const o of objects) {
      if (o.kind !== 'warp') continue;
      const target = loaded[o.map];
      expect(target, `warp ${o.name} → ${o.map}`).toBeDefined();
      expect(target.objects.some((t) => t.kind === 'spawn' && t.name === o.spawn), `spawn ${o.spawn}`).toBe(true);
    }
  });

  it('references NPCs, dialogue, and items that exist', () => {
    for (const o of objects) {
      if (o.kind === 'npc') {
        const def = (npcs as Record<string, { dialogue: string }>)[o.npc];
        expect(def, `npc ${o.npc}`).toBeDefined();
        expect(dialogue, `dialogue ${def.dialogue}`).toHaveProperty([def.dialogue]);
      }
      if (o.kind === 'sign') expect(dialogue).toHaveProperty([o.dialogue]);
      if (o.kind === 'chest') expect(items).toHaveProperty([o.item]);
    }
  });

  it('has unique chest ids', () => {
    const ids = objects.filter((o) => o.kind === 'chest').map((o) => (o as { chestId: string }).chestId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('field config', () => {
  it('starts on an existing map and spawn', () => {
    const start = loaded[field.startMap];
    expect(start).toBeDefined();
    expect(start.objects.some((o) => o.kind === 'spawn' && o.name === field.startSpawn)).toBe(true);
  });
});
