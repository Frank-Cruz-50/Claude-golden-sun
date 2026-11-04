import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, mapCacheKey, SceneKeys, TextureKeys, TILE_SIZE, TILESET_NAME } from '../config';
import dialogueData from '../data/dialogue.json';
import fieldConfig from '../data/field.json';
import itemsData from '../data/items.json';
import maps from '../data/maps.json';
import npcsData from '../data/npcs.json';
import strings from '../data/strings.json';
import { Chest } from '../entities/Chest';
import { GridCharacter } from '../entities/GridCharacter';
import { NPC, type NpcDef } from '../entities/NPC';
import { formatText } from '../systems/dialogue/paginate';
import { DIRECTIONS, DIRECTION_DELTA, directionToward, type Direction } from '../systems/field/direction';
import {
  buildCollisionGrid,
  isTileBlocked,
  parseFieldObjects,
  type FieldObject,
  type TiledMap,
} from '../systems/field/tiledMap';
import { InputManager } from '../systems/input/InputManager';
import { gameState } from '../systems/state/GameState';
import { showDialogue, type DialogueLine } from './DialogueScene';

export interface FieldSceneData {
  map?: string;
  spawn?: string;
}

type WarpObject = Extract<FieldObject, { kind: 'warp' }>;
type SignObject = Extract<FieldObject, { kind: 'sign' }>;
type ChestObject = Extract<FieldObject, { kind: 'chest' }>;

const FADE_MS = 250;
const dialogues = dialogueData as Record<string, DialogueLine[]>;
const npcDefs = npcsData as Record<string, NpcDef>;
const items = itemsData as Record<string, { name: string }>;

/** The overworld/town/dungeon exploration scene. Loads one Tiled map at a time. */
export class FieldScene extends Phaser.Scene {
  private controls!: InputManager;
  private mapId = '';
  private tiled!: TiledMap;
  private collision: boolean[] = [];
  private player!: GridCharacter;
  private npcs: NPC[] = [];
  private signs: SignObject[] = [];
  private warps: WarpObject[] = [];
  private chests: { obj: ChestObject; entity: Chest }[] = [];
  /** True while a dialogue, transition, or other blocking event is running. */
  private busy = false;

  constructor() {
    super(SceneKeys.Field);
  }

  create(data: FieldSceneData): void {
    this.mapId = data.map ?? fieldConfig.startMap;
    const spawnName = data.spawn ?? fieldConfig.startSpawn;
    if (!(this.mapId in maps)) throw new Error(`Unknown map "${this.mapId}"`);

    this.busy = false;
    this.npcs = [];
    this.signs = [];
    this.warps = [];
    this.chests = [];
    this.controls = new InputManager(this);

    const tilemap = this.make.tilemap({ key: mapCacheKey(this.mapId) });
    this.tiled = this.cache.tilemap.get(mapCacheKey(this.mapId)).data as TiledMap;
    const tileset = tilemap.addTilesetImage(TILESET_NAME, TextureKeys.Tiles)!;
    tilemap.createLayer('ground', tileset, 0, 0)?.setDepth(-1);
    tilemap.createLayer('above', tileset, 0, 0)?.setDepth(100000);
    this.collision = buildCollisionGrid(this.tiled);

    const objects = parseFieldObjects(this.tiled);
    const spawn = objects.find((o) => o.kind === 'spawn' && o.name === spawnName);
    if (!spawn || spawn.kind !== 'spawn') throw new Error(`Map "${this.mapId}" has no spawn "${spawnName}"`);

    for (const obj of objects) {
      switch (obj.kind) {
        case 'npc': {
          const def = npcDefs[obj.npc];
          if (!def) throw new Error(`npcs.json has no "${obj.npc}"`);
          this.npcs.push(new NPC(this, obj.npc, def, obj.x, obj.y));
          break;
        }
        case 'sign':
          this.signs.push(obj);
          if (!obj.hidden) {
            this.add.image(obj.x * TILE_SIZE, obj.y * TILE_SIZE, TextureKeys.Sign).setOrigin(0).setDepth((obj.y + 1) * TILE_SIZE - 1);
          }
          break;
        case 'chest':
          this.chests.push({ obj, entity: new Chest(this, obj.x, obj.y, gameState.hasFlag(chestFlag(obj))) });
          break;
        case 'warp':
          this.warps.push(obj);
          break;
      }
    }

    this.player = new GridCharacter(this, fieldConfig.player.color, spawn.x, spawn.y, spawn.facing);
    this.setupCamera();
    this.cameras.main.fadeIn(FADE_MS);
  }

  update(time: number): void {
    this.controls.update();
    const npcCanEnter = (x: number, y: number) =>
      !this.busy && this.canEnter(x, y) && !this.warps.some((w) => w.x === x && w.y === y);
    for (const npc of this.npcs) npc.updateWander(time, npcCanEnter);
    if (this.busy) return;

    if (this.controls.justPressed('menu')) {
      this.transition(() => this.scene.start(SceneKeys.Title));
      return;
    }
    if (this.player.isMoving) return;
    if (this.controls.justPressed('confirm')) {
      this.interact();
      return;
    }
    this.tryWalk();
  }

  /** Starts a step in the held direction; chained from the previous step for smooth movement. */
  private tryWalk(): void {
    const dir = this.heldDirection();
    if (!dir) return;
    const tx = this.player.tileX + DIRECTION_DELTA[dir].x;
    const ty = this.player.tileY + DIRECTION_DELTA[dir].y;
    if (!this.canEnter(tx, ty)) {
      this.player.face(dir);
      return;
    }
    const ms = this.controls.isDown('run') ? fieldConfig.runMsPerTile : fieldConfig.walkMsPerTile;
    this.player.step(dir, ms, () => {
      const warp = this.warps.find((w) => w.x === this.player.tileX && w.y === this.player.tileY);
      if (warp) this.warpTo(warp);
      else if (!this.busy) {
        this.controls.update();
        this.tryWalk();
      }
    });
  }

  /** Held direction, or one tapped this frame (a tap shorter than a frame still turns/steps). */
  private heldDirection(): Direction | undefined {
    return DIRECTIONS.find((d) => this.controls.isDown(d)) ?? DIRECTIONS.find((d) => this.controls.justPressed(d));
  }

  private canEnter(x: number, y: number): boolean {
    if (isTileBlocked(this.tiled, this.collision, x, y)) return false;
    if (this.player && this.player.tileX === x && this.player.tileY === y) return false;
    if (this.npcs.some((n) => n.tileX === x && n.tileY === y)) return false;
    if (this.signs.some((s) => s.x === x && s.y === y)) return false;
    if (this.chests.some((c) => c.obj.x === x && c.obj.y === y)) return false;
    return true;
  }

  private interact(): void {
    const { x, y } = this.player.facingTile();

    const npc = this.npcs.find((n) => n.tileX === x && n.tileY === y && !n.isMoving);
    if (npc) {
      const toward = directionToward(npc.tileX, npc.tileY, this.player.tileX, this.player.tileY);
      if (toward) npc.face(toward);
      this.runDialogue(this.lines(npc.def.dialogue)).then(() => npc.pauseWander(this.time.now));
      return;
    }

    const sign = this.signs.find((s) => s.x === x && s.y === y);
    if (sign) {
      this.runDialogue(this.lines(sign.dialogue));
      return;
    }

    const chest = this.chests.find((c) => c.obj.x === x && c.obj.y === y);
    if (chest) this.openChest(chest.obj, chest.entity);
  }

  private openChest(obj: ChestObject, entity: Chest): void {
    const flag = chestFlag(obj);
    if (gameState.hasFlag(flag)) {
      this.runDialogue([{ text: strings.field.chestEmpty }]);
      return;
    }
    const item = items[obj.item];
    if (!item) throw new Error(`items.json has no "${obj.item}"`);
    const added = gameState.inventory.add(obj.item, obj.qty);
    if (added === 0) {
      this.runDialogue([{ text: formatText(strings.field.bagFull, { item: item.name }) }]);
      return;
    }
    gameState.setFlag(flag);
    entity.open();
    this.runDialogue([{ text: formatText(strings.field.chestFound, { item: item.name, qty: added }) }]);
  }

  private lines(dialogueId: string): DialogueLine[] {
    const lines = dialogues[dialogueId];
    if (!lines) throw new Error(`dialogue.json has no "${dialogueId}"`);
    const vars = { player: fieldConfig.player.name };
    return lines.map((l) => ({ speaker: l.speaker, text: formatText(l.text, vars) }));
  }

  private async runDialogue(lines: DialogueLine[]): Promise<void> {
    this.busy = true;
    await showDialogue(this, lines);
    this.controls.flush();
    this.busy = false;
  }

  private warpTo(warp: WarpObject): void {
    this.transition(() => this.scene.restart({ map: warp.map, spawn: warp.spawn } satisfies FieldSceneData));
  }

  private transition(then: () => void): void {
    this.busy = true;
    this.cameras.main.fadeOut(FADE_MS);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, then);
  }

  private setupCamera(): void {
    const w = this.tiled.width * TILE_SIZE;
    const h = this.tiled.height * TILE_SIZE;
    // Maps smaller than the screen are centred instead of pinned to the top-left.
    const bx = w < GAME_WIDTH ? (w - GAME_WIDTH) / 2 : 0;
    const by = h < GAME_HEIGHT ? (h - GAME_HEIGHT) / 2 : 0;
    const cam = this.cameras.main;
    cam.setBounds(bx, by, Math.max(w, GAME_WIDTH), Math.max(h, GAME_HEIGHT));
    cam.startFollow(this.player.sprite, true);
    cam.setFollowOffset(0, TILE_SIZE / 2);
  }
}

function chestFlag(obj: ChestObject): string {
  return `chest:${obj.chestId}`;
}
