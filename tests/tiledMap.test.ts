import { describe, expect, it } from 'vitest';
import { buildCollisionGrid, isTileBlocked, parseFieldObjects, type TiledMap } from '../src/systems/field/tiledMap';

function makeMap(objects: TiledMap['layers'][number][] = []): TiledMap {
  return {
    width: 3,
    height: 2,
    tilewidth: 16,
    tileheight: 16,
    tilesets: [{ firstgid: 1, name: 't', tiles: [{ id: 1, properties: [{ name: 'collides', value: true }] }] }],
    layers: [
      { type: 'tilelayer', name: 'ground', data: [1, 2, 1, 1, 1, 1] },
      // a flipped gid (high bit set) for a colliding tile still collides
      { type: 'tilelayer', name: 'above', data: [0, 0, 0, 0, 0, (2 | 0x80000000) >>> 0] },
      ...objects,
    ],
  };
}

describe('buildCollisionGrid', () => {
  it('marks tiles whose tileset entry collides, across layers', () => {
    const map = makeMap();
    const grid = buildCollisionGrid(map);
    expect(grid).toEqual([false, true, false, false, false, true]);
    expect(isTileBlocked(map, grid, 0, 0)).toBe(false);
    expect(isTileBlocked(map, grid, 1, 0)).toBe(true);
  });

  it('treats out-of-bounds as blocked', () => {
    const map = makeMap();
    const grid = buildCollisionGrid(map);
    expect(isTileBlocked(map, grid, -1, 0)).toBe(true);
    expect(isTileBlocked(map, grid, 3, 0)).toBe(true);
    expect(isTileBlocked(map, grid, 0, 2)).toBe(true);
  });
});

describe('parseFieldObjects', () => {
  it('converts pixel positions to tiles and reads typed properties', () => {
    const map = makeMap([
      {
        type: 'objectgroup',
        name: 'objects',
        objects: [
          { id: 1, name: 's', type: 'spawn', x: 32, y: 16, properties: [{ name: 'facing', value: 'left' }] },
          { id: 2, name: 'c', class: 'chest', x: 16, y: 0, properties: [{ name: 'chestId', value: 'a' }, { name: 'item', value: 'herb' }] },
        ],
      },
    ]);
    expect(parseFieldObjects(map)).toEqual([
      { kind: 'spawn', name: 's', x: 2, y: 1, facing: 'left' },
      { kind: 'chest', name: 'c', x: 1, y: 0, chestId: 'a', item: 'herb', qty: 1 },
    ]);
  });

  it('rejects unknown types and missing properties', () => {
    const bad = (obj: object) =>
      makeMap([{ type: 'objectgroup', name: 'objects', objects: [{ id: 1, name: 'x', x: 0, y: 0, ...obj }] }]);
    expect(() => parseFieldObjects(bad({ type: 'dragon' }))).toThrow(/unknown type/);
    expect(() => parseFieldObjects(bad({ type: 'warp' }))).toThrow(/"map"/);
    expect(() => parseFieldObjects(bad({ type: 'spawn', properties: [{ name: 'facing', value: 'north' }] }))).toThrow();
  });
});
