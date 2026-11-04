import { Canvas, hex } from './lib.mjs';
import { characterSheet, PALETTES } from './characters.mjs';
const out = new Canvas(110, 100);
out.rect(0, 0, 110, 100, hex('#5a9a3a'));
out.blit(characterSheet(PALETTES.wren), 2, 2);
out.blit(characterSheet(PALETTES.tobin), 58, 2);
out.scaled(6).save(process.argv[2]);
