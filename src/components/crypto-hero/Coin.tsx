"use client";

import * as THREE from "three";

export type CoinSymbol = "btc" | "eth" | "ltc";

export const SYMBOLS: CoinSymbol[] = ["btc", "eth", "ltc"];

/** Official single-path brand logos (24x24 viewBox), drawn crisp via Path2D. */
const LOGO_PATHS: Record<CoinSymbol, string> = {
  btc: "M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z",
  eth: "M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z",
  ltc: "M12 0a12 12 0 1012 12A12 12 0 0012 0zm-.2617 3.6777h2.584a.3425.3425 0 01.33.4356l-2.0312 6.918 1.9062-.582-.4082 1.3847-1.9238.5605-1.248 4.213h6.6757a.3425.3425 0 01.3282.4374l-.582 2a.4586.4586 0 01-.4395.3301H6.7324l1.7227-5.8223-1.9063.5801.42-1.3613 1.9101-.58 2.4219-8.1798a.4557.4557 0 01.4375-.334Z",
};

export const COIN_R = 1;
const T = 0.16;
const BEVEL = 0.05;

type FacePalette = { bg: string; grooveLo: string; grooveHi: string; logo: string; logoEdge: string };

function drawFace(ctx: CanvasRenderingContext2D, symbol: CoinSymbol, size: number, pal: FacePalette) {
  const c = size / 2;
  ctx.fillStyle = pal.bg;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = pal.grooveLo;
  ctx.lineWidth = size * 0.02;
  ctx.beginPath();
  ctx.arc(c, c, c * 0.84, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = pal.grooveHi;
  ctx.lineWidth = size * 0.006;
  ctx.beginPath();
  ctx.arc(c, c, c * 0.822, 0, Math.PI * 2);
  ctx.stroke();

  const path = new Path2D(LOGO_PATHS[symbol]);
  const logoScale = symbol === "eth" ? 0.6 : 0.7;
  ctx.save();
  const s = (size / 24) * logoScale;
  ctx.translate(c, c);
  ctx.scale(s, s);
  ctx.translate(-12, -12);
  ctx.lineJoin = "round";
  ctx.lineWidth = 0.7;
  ctx.strokeStyle = pal.logoEdge;
  ctx.stroke(path);
  ctx.fillStyle = pal.logo;
  ctx.fill(path);
  ctx.restore();
}

function makeCanvas(size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  return canvas;
}

/** Coloured + emissive + bump maps for a dark-gunmetal coin with mint engravings. */
function makeFaceMaps(symbol: CoinSymbol, anisotropy: number) {
  const size = 512;

  const colorCanvas = makeCanvas(size);
  drawFace(colorCanvas.getContext("2d")!, symbol, size, {
    bg: "#15191b",
    grooveLo: "rgba(0,0,0,0.65)",
    grooveHi: "rgba(120,140,135,0.25)",
    logo: "#0c0e0f",
    logoEdge: "rgba(150,170,160,0.25)",
  });
  const color = new THREE.CanvasTexture(colorCanvas);
  color.colorSpace = THREE.SRGBColorSpace;

  const emissiveCanvas = makeCanvas(size);
  drawFace(emissiveCanvas.getContext("2d")!, symbol, size, {
    bg: "#000000",
    grooveLo: "#262626",
    grooveHi: "#0c0c0c",
    logo: "#ffffff",
    logoEdge: "#bfe6d2",
  });
  const emissive = new THREE.CanvasTexture(emissiveCanvas);

  const bumpCanvas = makeCanvas(size);
  drawFace(bumpCanvas.getContext("2d")!, symbol, size, {
    bg: "#8a8a8a",
    grooveLo: "#3a3a3a",
    grooveHi: "#c0c0c0",
    logo: "#303030",
    logoEdge: "#ffffff",
  });
  const bump = new THREE.CanvasTexture(bumpCanvas);

  for (const t of [color, emissive, bump]) t.anisotropy = anisotropy;
  return { color, emissive, bump };
}

/** Rounded-edge coin profile, revolved by LatheGeometry. */
function buildCoinProfile(): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [];
  const arcSeg = 8;
  pts.push(new THREE.Vector2(0, T / 2));
  pts.push(new THREE.Vector2(COIN_R - BEVEL, T / 2));
  for (let i = 0; i <= arcSeg; i++) {
    const a = (Math.PI / 2) * (1 - i / arcSeg);
    pts.push(new THREE.Vector2(COIN_R - BEVEL + BEVEL * Math.cos(a), T / 2 - BEVEL + BEVEL * Math.sin(a)));
  }
  for (let i = 0; i <= arcSeg; i++) {
    const a = -(Math.PI / 2) * (i / arcSeg);
    pts.push(new THREE.Vector2(COIN_R - BEVEL + BEVEL * Math.cos(a), -(T / 2 - BEVEL) + BEVEL * Math.sin(a)));
  }
  pts.push(new THREE.Vector2(0, -T / 2));
  return pts;
}

/** Vertical mint streak texture (opaque top → transparent tail, soft sides). */
function makeTrailTexture(): THREE.CanvasTexture {
  const w = 64;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const vGrad = ctx.createLinearGradient(0, 0, 0, h);
  vGrad.addColorStop(0, "rgba(255,255,255,1)");
  vGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = vGrad;
  ctx.fillRect(0, 0, w, h);
  // Soft horizontal edges.
  ctx.globalCompositeOperation = "destination-in";
  const hGrad = ctx.createLinearGradient(0, 0, w, 0);
  hGrad.addColorStop(0, "rgba(0,0,0,0)");
  hGrad.addColorStop(0.5, "rgba(0,0,0,1)");
  hGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = hGrad;
  ctx.fillRect(0, 0, w, h);
  return new THREE.CanvasTexture(canvas);
}

export type CoinAssets = {
  bodyGeometry: THREE.BufferGeometry;
  faceGeometry: THREE.BufferGeometry;
  faceOffset: number;
  bodyMaterial: THREE.Material;
  faceMaterials: Record<CoinSymbol, THREE.Material>;
  trailGeometry: THREE.BufferGeometry;
  trailMaterial: THREE.Material;
  dispose: () => void;
};

/**
 * Build every coin's shared resources ONCE. All coins reuse the same two
 * geometries, one body material and three (per-symbol) face materials - so
 * adding lots of coins stays cheap.
 */
export function createCoinAssets(anisotropy: number): CoinAssets {
  // Bake the orientation in: faces point +Z so a coin spins on rotation.z.
  const bodyGeometry = new THREE.LatheGeometry(buildCoinProfile(), 64);
  bodyGeometry.rotateX(Math.PI / 2);
  const faceGeometry = new THREE.CircleGeometry(COIN_R - BEVEL + 0.01, 64);

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: "#20262a",
    metalness: 1,
    roughness: 0.26,
    envMapIntensity: 1.65,
  });

  const maps: Record<string, ReturnType<typeof makeFaceMaps>> = {};
  const faceMaterials = {} as Record<CoinSymbol, THREE.Material>;
  for (const sym of SYMBOLS) {
    const m = makeFaceMaps(sym, anisotropy);
    maps[sym] = m;
    faceMaterials[sym] = new THREE.MeshStandardMaterial({
      map: m.color,
      emissiveMap: m.emissive,
      emissive: new THREE.Color("#5EFF95"),
      emissiveIntensity: 2.2,
      bumpMap: m.bump,
      bumpScale: 0.1,
      metalness: 0.9,
      roughness: 0.36,
      envMapIntensity: 1.35,
    });
  }

  // Trail: a plane whose origin is at its TOP, so it streams downward (toward
  // the launch point) behind a rising coin.
  const trailTexture = makeTrailTexture();
  const trailGeometry = new THREE.PlaneGeometry(1, 1).translate(0, -0.5, 0);
  const trailMaterial = new THREE.MeshBasicMaterial({
    map: trailTexture,
    color: new THREE.Color("#5EFF95"),
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });

  const dispose = () => {
    bodyGeometry.dispose();
    faceGeometry.dispose();
    bodyMaterial.dispose();
    trailGeometry.dispose();
    trailMaterial.dispose();
    trailTexture.dispose();
    for (const sym of SYMBOLS) {
      (faceMaterials[sym] as THREE.Material).dispose();
      maps[sym].color.dispose();
      maps[sym].emissive.dispose();
      maps[sym].bump.dispose();
    }
  };

  return {
    bodyGeometry,
    faceGeometry,
    faceOffset: T / 2 + 0.001,
    bodyMaterial,
    faceMaterials,
    trailGeometry,
    trailMaterial,
    dispose,
  };
}
