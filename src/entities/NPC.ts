import Phaser from 'phaser';
import { DIRECTIONS, DIRECTION_DELTA, isDirection } from '../systems/field/direction';
import { GridCharacter } from './GridCharacter';

export interface NpcDef {
  name: string;
  /** Sprite sheet key (file name in /assets/sprites); falls back to `color` placeholder art. */
  sprite?: string;
  color: string;
  dialogue: string;
  facing: string;
  /** Max tiles it may wander from its start tile (0 = stands still). */
  wander: number;
}

const WANDER_STEP_MS = 320;

export class NPC extends GridCharacter {
  private readonly homeX: number;
  private readonly homeY: number;
  private nextWanderAt = 0;

  constructor(
    scene: Phaser.Scene,
    readonly id: string,
    readonly def: NpcDef,
    tileX: number,
    tileY: number,
  ) {
    super(scene, def.sprite ? { sheet: def.sprite } : { color: def.color }, tileX, tileY, isDirection(def.facing) ? def.facing : 'down');
    this.homeX = tileX;
    this.homeY = tileY;
    this.scheduleWander(scene.time.now);
  }

  /** Occasionally takes a random step within its wander radius. */
  updateWander(now: number, canEnter: (x: number, y: number) => boolean): void {
    if (this.def.wander <= 0 || this.isMoving || now < this.nextWanderAt) return;
    this.scheduleWander(now);
    const dir = Phaser.Utils.Array.GetRandom([...DIRECTIONS]);
    const tx = this.tileX + DIRECTION_DELTA[dir].x;
    const ty = this.tileY + DIRECTION_DELTA[dir].y;
    const inRange = Math.abs(tx - this.homeX) + Math.abs(ty - this.homeY) <= this.def.wander;
    if (inRange && canEnter(tx, ty)) this.step(dir, WANDER_STEP_MS);
    else this.face(dir);
  }

  /** Holds the NPC still for a while (e.g. after talking). */
  pauseWander(now: number, ms = 2500): void {
    this.nextWanderAt = now + ms;
  }

  private scheduleWander(now: number): void {
    this.nextWanderAt = now + Phaser.Math.Between(1500, 3500);
  }
}
