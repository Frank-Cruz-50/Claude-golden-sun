export const DIRECTIONS = ['up', 'down', 'left', 'right'] as const;
export type Direction = (typeof DIRECTIONS)[number];

export const DIRECTION_DELTA: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function isDirection(value: unknown): value is Direction {
  return typeof value === 'string' && (DIRECTIONS as readonly string[]).includes(value);
}

export function opposite(dir: Direction): Direction {
  return { up: 'down', down: 'up', left: 'right', right: 'left' }[dir] as Direction;
}

/** Direction pointing from (fromX, fromY) toward an orthogonally adjacent tile, if any. */
export function directionToward(fromX: number, fromY: number, toX: number, toY: number): Direction | undefined {
  return DIRECTIONS.find((d) => fromX + DIRECTION_DELTA[d].x === toX && fromY + DIRECTION_DELTA[d].y === toY);
}
