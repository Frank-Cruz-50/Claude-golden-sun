/** Engine-level constants (not game content — content lives in /src/data). */
export const GAME_WIDTH = 240;
export const GAME_HEIGHT = 160;
export const TILE_SIZE = 16;

export const SceneKeys = {
  Boot: 'Boot',
  Preload: 'Preload',
  Title: 'Title',
  Field: 'Field',
  Dialogue: 'Dialogue',
} as const;

export const TextureKeys = {
  Tiles: 'tiles-placeholder',
  ChestClosed: 'placeholder-chest-closed',
  ChestOpen: 'placeholder-chest-open',
  Sign: 'placeholder-sign',
} as const;

/** Name of the tileset inside the .tmj files. */
export const TILESET_NAME = 'placeholder';

export const mapCacheKey = (mapId: string) => `map:${mapId}`;
