/**
 * Pure helpers for Tiled (.tmj) JSON: collision grid and typed field objects.
 * No Phaser dependency, so it can be unit tested.
 */
import { isDirection, type Direction } from './direction';

const GID_MASK = 0x1fffffff; // strips Tiled's flip flags

export interface TiledProperty {
  name: string;
  type?: string;
  value: string | number | boolean;
}

export interface TiledObject {
  id: number;
  name: string;
  type?: string;
  class?: string; // Tiled 1.9 wrote "class" instead of "type"
  x: number;
  y: number;
  properties?: TiledProperty[];
}

export interface TiledTileLayer {
  type: 'tilelayer';
  name: string;
  data: number[];
}

export interface TiledObjectLayer {
  type: 'objectgroup';
  name: string;
  objects: TiledObject[];
}

export interface TiledTileset {
  firstgid: number;
  name: string;
  tiles?: { id: number; properties?: TiledProperty[] }[];
}

export interface TiledMap {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: (TiledTileLayer | TiledObjectLayer | { type: string; name: string })[];
  tilesets: TiledTileset[];
  properties?: TiledProperty[];
}

export type FieldObject =
  | { kind: 'spawn'; name: string; x: number; y: number; facing: Direction }
  | { kind: 'warp'; name: string; x: number; y: number; map: string; spawn: string }
  | { kind: 'sign'; name: string; x: number; y: number; dialogue: string; hidden: boolean }
  | { kind: 'npc'; name: string; x: number; y: number; npc: string }
  | { kind: 'chest'; name: string; x: number; y: number; chestId: string; item: string; qty: number };

export function getProperty(props: TiledProperty[] | undefined, name: string): TiledProperty['value'] | undefined {
  return props?.find((p) => p.name === name)?.value;
}

/** Row-major grid of blocked tiles: any tile layer using a tile with `collides: true` blocks. */
export function buildCollisionGrid(map: TiledMap): boolean[] {
  const collidingGids = new Set<number>();
  for (const ts of map.tilesets) {
    for (const tile of ts.tiles ?? []) {
      if (getProperty(tile.properties, 'collides') === true) collidingGids.add(ts.firstgid + tile.id);
    }
  }
  const blocked = new Array<boolean>(map.width * map.height).fill(false);
  for (const layer of map.layers) {
    if (layer.type !== 'tilelayer') continue;
    (layer as TiledTileLayer).data.forEach((gid, i) => {
      if (collidingGids.has(gid & GID_MASK)) blocked[i] = true;
    });
  }
  return blocked;
}

export function isTileBlocked(map: Pick<TiledMap, 'width' | 'height'>, grid: boolean[], x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return true;
  return grid[y * map.width + x];
}

function requireString(obj: TiledObject, name: string): string {
  const v = getProperty(obj.properties, name);
  if (typeof v !== 'string' || v === '') throw new Error(`Map object "${obj.name}" (#${obj.id}) needs string property "${name}"`);
  return v;
}

/** Converts the "objects" layer into typed field objects with tile coordinates. */
export function parseFieldObjects(map: TiledMap): FieldObject[] {
  const out: FieldObject[] = [];
  for (const layer of map.layers) {
    if (layer.type !== 'objectgroup') continue;
    for (const obj of (layer as TiledObjectLayer).objects) {
      const x = Math.floor(obj.x / map.tilewidth);
      const y = Math.floor(obj.y / map.tileheight);
      const base = { name: obj.name, x, y };
      const kind = obj.type ?? obj.class;
      switch (kind) {
        case 'spawn': {
          const facing = getProperty(obj.properties, 'facing') ?? 'down';
          if (!isDirection(facing)) throw new Error(`Spawn "${obj.name}" has invalid facing "${facing}"`);
          out.push({ kind, ...base, facing });
          break;
        }
        case 'warp':
          out.push({ kind, ...base, map: requireString(obj, 'map'), spawn: requireString(obj, 'spawn') });
          break;
        case 'sign':
          out.push({ kind, ...base, dialogue: requireString(obj, 'dialogue'), hidden: getProperty(obj.properties, 'hidden') === true });
          break;
        case 'npc':
          out.push({ kind, ...base, npc: requireString(obj, 'npc') });
          break;
        case 'chest': {
          const qty = getProperty(obj.properties, 'qty') ?? 1;
          if (typeof qty !== 'number' || qty < 1) throw new Error(`Chest "${obj.name}" has invalid qty`);
          out.push({ kind, ...base, chestId: requireString(obj, 'chestId'), item: requireString(obj, 'item'), qty });
          break;
        }
        default:
          throw new Error(`Map object "${obj.name}" has unknown type "${kind}"`);
      }
    }
  }
  return out;
}
