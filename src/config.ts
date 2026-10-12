/** Engine-level constants (not game content — content lives in /src/data). */
export const GAME_WIDTH = 240;
export const GAME_HEIGHT = 160;
export const TILE_SIZE = 16;

export const SceneKeys = {
  Boot: 'Boot',
  Preload: 'Preload',
  Title: 'Title',
  Field: 'Field',
} as const;

export const TextureKeys = {
  Player: 'placeholder-player',
  Ground: 'placeholder-ground',
  GroundAlt: 'placeholder-ground-alt',
} as const;
