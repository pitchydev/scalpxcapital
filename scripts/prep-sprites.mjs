import sharp from "sharp";
import { mkdirSync } from "node:fs";

// Trims the transparent padding off the source ChentoTrades art and downscales
// it to game-ready sizes. Source PNGs are 1024x1024 with huge transparent
// borders (and up to ~1MB), far too heavy to ship raw.
const SRC = "sprites/chento";
const OUT = "public/game/chento";
mkdirSync(OUT, { recursive: true });

// Side frames used for the in-game flap animation. Kept to a tidy height so the
// pixel art stays crisp when the engine scales it.
const frames = [
  { in: "sprite.png", out: "glide.png" },
  { in: "sprite2.png", out: "dive.png" },
  { in: "sprite3.png", out: "rise.png" },
  { in: "sprite4.png", out: "flap.png" },
];

const FRAME_H = 200;
const PORTRAIT_H = 460;

for (const f of frames) {
  await sharp(`${SRC}/${f.in}`)
    .trim()
    .resize({ height: FRAME_H, fit: "inside", withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${f.out}`);
  console.log(`frame -> ${OUT}/${f.out}`);
}

// Front-facing portrait for the character-select screen.
await sharp(`${SRC}/character-selection-sprite.png`)
  .trim()
  .resize({ height: PORTRAIT_H, fit: "inside", withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/portrait.png`);
console.log(`portrait -> ${OUT}/portrait.png`);

console.log("done");
