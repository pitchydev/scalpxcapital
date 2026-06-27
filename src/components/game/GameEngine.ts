import type { LoadedSprites } from "./sprites";

export type EngineColors = {
  green: string;
  greenDim: string;
  red: string;
  black: string;
  gold: string;
};

export type GameResult = {
  score: number;
  coins: number;
  pnl: number;
  best: number;
  isBest: boolean;
};

export type EngineCallbacks = {
  onScore?: (score: number) => void;
  onCoin?: (coins: number) => void;
  onStart?: () => void;
  onGameOver?: (result: GameResult) => void;
};

type Mode = "ready" | "playing" | "dead";
type CoinType = "scalpx" | "btc" | "eth";

type Candle = {
  x: number; // center, game units
  gapY: number; // gap center, game units
  baseGapY: number;
  passed: boolean;
  coin: { collected: boolean; pop: number; type: CoinType } | null;
  label: string;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
  grav: number;
};

type FloatText = {
  x: number;
  y: number;
  vy: number;
  life: number;
  max: number;
  text: string;
  color: string;
};

const VH = 100;
const BEST_KEY = "scalpx_flappy_best_pnl";

// Tunables (game units / seconds).
const GRAVITY = 236;
const FLAP_V = -80;
const MAX_FALL = 168;
const BIRD_DRAW_H = 13;
const COL_R = 4.0;
const CANDLE_W = 13;
const GROUND_H = 7;
const TOP_MARGIN = 8;

// Scoring -> PnL ($).
const SCORE_VAL = 50;
const COIN_VAL = 250;
const SHARP_GAP = 2.2; // near-miss window beyond the collision radius

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private frames: LoadedSprites;
  private colors: EngineColors;
  private cb: EngineCallbacks;

  private W = 0;
  private H = 0;
  private unit = 1;
  private vw = 50;

  private mode: Mode = "ready";
  private raf = 0;
  private lastT = 0;
  private acc = 0;
  private elapsed = 0;
  private running = false;

  private birdX = 15;
  private birdY = 50;
  private vy = 0;
  private angle = 0;
  private flapTimer = 0;

  private candles: Candle[] = [];
  private spawnX = 0;
  private spawnCount = 0;
  private bgOffset = 0;

  private particles: Particle[] = [];
  private floats: FloatText[] = [];
  private shake = 0;
  private flash = 0;

  private score = 0;
  private coins = 0;
  private best = 0;

  constructor(
    canvas: HTMLCanvasElement,
    opts: { frames: LoadedSprites; colors: EngineColors; callbacks?: EngineCallbacks },
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false })!;
    this.frames = opts.frames;
    this.colors = opts.colors;
    this.cb = opts.callbacks ?? {};
    try {
      this.best = parseInt(localStorage.getItem(BEST_KEY) ?? "0", 10) || 0;
    } catch {
      this.best = 0;
    }
    this.reset();
  }

  resize(cssW: number, cssH: number, dpr: number) {
    this.W = cssW;
    this.H = cssH;
    this.unit = cssH / VH;
    this.vw = VH * (cssW / cssH);
    this.canvas.width = Math.round(cssW * dpr);
    this.canvas.height = Math.round(cssH * dpr);
    this.canvas.style.width = `${cssW}px`;
    this.canvas.style.height = `${cssH}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    this.birdX = clamp(this.vw * 0.3, 10, 22);
    this.render();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastT = performance.now();
    this.acc = 0;
    this.raf = requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.stop();
  }

  reset() {
    this.mode = "ready";
    this.birdY = 46;
    this.vy = 0;
    this.angle = 0;
    this.flapTimer = 0;
    this.elapsed = 0;
    this.bgOffset = 0;
    this.score = 0;
    this.coins = 0;
    this.candles = [];
    this.particles = [];
    this.floats = [];
    this.shake = 0;
    this.flash = 0;
    this.spawnCount = 0;
    this.spawnX = this.vw + 26;
    this.render();
  }

  flap() {
    if (this.mode === "dead") return;
    if (this.mode === "ready") {
      this.mode = "playing";
      this.candles = [];
      this.spawnCount = 0;
      this.spawnX = this.vw + 26;
      this.cb.onStart?.();
    }
    this.vy = FLAP_V;
    this.flapTimer = 0.16;
    // dust puff behind the bird
    this.spawnBurst(this.birdX - 3, this.birdY + 2, 4, {
      color: this.colors.greenDim,
      speed: 16,
      spread: Math.PI,
      dir: Math.PI,
      life: 0.32,
      size: 1.4,
      grav: 20,
    });
  }

  get pnl() {
    return this.score * SCORE_VAL + this.coins * COIN_VAL;
  }

  getState() {
    return { mode: this.mode, score: this.score, coins: this.coins, pnl: this.pnl, best: this.best };
  }

  private get diff() {
    return clamp(this.score / 28, 0, 1);
  }
  private get gap() {
    return lerp(31, 22, this.diff);
  }
  private get speed() {
    return lerp(37, 64, this.diff);
  }
  private get spacing() {
    return lerp(52, 42, this.diff);
  }

  private loop = (t: number) => {
    if (!this.running) return;
    let frameDt = (t - this.lastT) / 1000;
    this.lastT = t;
    if (frameDt > 0.05) frameDt = 0.05;
    this.acc += frameDt;
    const step = 1 / 120;
    while (this.acc >= step) {
      this.update(step);
      this.acc -= step;
    }
    this.render();
    this.raf = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    this.elapsed += dt;
    if (this.flapTimer > 0) this.flapTimer -= dt;
    this.shake *= Math.exp(-dt * 11);
    this.flash *= Math.exp(-dt * 6);
    this.updateParticles(dt);
    this.updateFloats(dt);

    if (this.mode === "ready") {
      this.birdY = 46 + Math.sin(this.elapsed * 3) * 2.2;
      this.angle = Math.sin(this.elapsed * 3) * 0.12;
      return;
    }

    this.vy = clamp(this.vy + GRAVITY * dt, FLAP_V * 1.4, MAX_FALL);
    this.birdY += this.vy * dt;
    const targetA = clamp(this.vy / 90, -0.5, 1.4);
    this.angle += (targetA - this.angle) * Math.min(1, dt * 10);

    const groundTop = VH - GROUND_H;

    if (this.mode === "dead") {
      if (this.birdY > groundTop - COL_R) {
        this.birdY = groundTop - COL_R;
        this.vy = 0;
      }
      return;
    }

    if (this.birdY < COL_R + 1) {
      this.birdY = COL_R + 1;
      if (this.vy < 0) this.vy = 0;
    }
    if (this.birdY > groundTop - COL_R) {
      this.birdY = groundTop - COL_R;
      this.die();
      return;
    }

    const dx = this.speed * dt;
    this.bgOffset += dx;
    // gentle candle drift kicks in only late game
    const drift = this.diff > 0.55 ? (this.diff - 0.55) * 6 : 0;
    for (const c of this.candles) {
      c.x -= dx;
      if (drift > 0) c.gapY = c.baseGapY + Math.sin(this.elapsed * 1.2 + c.x * 0.2) * drift;
    }
    if (this.candles.length && this.candles[0].x < -CANDLE_W) this.candles.shift();
    this.spawnX -= dx;
    while (this.spawnX < this.vw + this.spacing) {
      this.spawnCandle(this.spawnX);
      this.spawnX += this.spacing;
    }

    for (const c of this.candles) {
      if (!c.passed && c.x < this.birdX) {
        c.passed = true;
        this.score += 1;
        this.cb.onScore?.(this.score);
        // near-miss ("SHARP") bonus
        const topEdge = c.gapY - this.gap / 2;
        const botEdge = c.gapY + this.gap / 2;
        const minEdge = Math.min(this.birdY - topEdge, botEdge - this.birdY);
        if (minEdge < COL_R + SHARP_GAP) {
          this.coins += 1;
          this.cb.onCoin?.(this.coins);
          this.shake = Math.max(this.shake, 0.7);
          this.addFloat(this.birdX, this.birdY - 6, "SHARP +$" + COIN_VAL, this.colors.green);
          this.spawnBurst(this.birdX, this.birdY, 8, {
            color: this.colors.green,
            speed: 34,
            spread: Math.PI * 2,
            dir: 0,
            life: 0.4,
            size: 1.4,
            grav: 30,
          });
        }
      }
      if (c.coin && !c.coin.collected) {
        const d = Math.hypot(this.birdX - c.x, this.birdY - c.gapY);
        if (d < COL_R + 4.5) {
          c.coin.collected = true;
          c.coin.pop = 0.001;
          this.coins += 1;
          this.cb.onCoin?.(this.coins);
          this.shake = Math.max(this.shake, 0.4);
          this.addFloat(c.x, c.gapY - 4, "+$" + COIN_VAL, this.colors.gold);
          this.spawnBurst(c.x, c.gapY, 12, {
            color: this.colors.gold,
            speed: 40,
            spread: Math.PI * 2,
            dir: 0,
            life: 0.5,
            size: 1.6,
            grav: 26,
            color2: this.colors.green,
          });
        }
      } else if (c.coin && c.coin.pop > 0) {
        c.coin.pop += dt;
        if (c.coin.pop > 0.35) c.coin = null;
      }
      if (this.hitsCandle(c, groundTop)) {
        this.die();
        return;
      }
    }
  }

  private spawnCandle(x: number) {
    const groundTop = VH - GROUND_H;
    const g = this.gap;
    const minY = TOP_MARGIN + g / 2;
    const maxY = groundTop - g / 2 - 3;
    const gapY =
      this.spawnCount === 0
        ? clamp(46 + (Math.random() * 10 - 5), minY, maxY)
        : minY + Math.random() * (maxY - minY);
    const hasCoin = this.spawnCount > 0 && Math.random() < 0.55;
    const r = Math.random();
    const type: CoinType = r < 0.5 ? "scalpx" : r < 0.75 ? "btc" : "eth";
    const price = (58 + Math.random() * 12).toFixed(1);
    this.spawnCount += 1;
    this.candles.push({
      x,
      gapY,
      baseGapY: gapY,
      passed: false,
      coin: hasCoin ? { collected: false, pop: 0, type } : null,
      label: `${price}k`,
    });
  }

  private hitsCandle(c: Candle, groundTop: number): boolean {
    const halfW = CANDLE_W / 2;
    const left = c.x - halfW;
    const right = c.x + halfW;
    if (this.birdX + COL_R < left || this.birdX - COL_R > right) return false;
    const nearestX = clamp(this.birdX, left, right);
    const topBottom = c.gapY - this.gap / 2;
    const botTop = c.gapY + this.gap / 2;
    const r2 = COL_R * COL_R;
    const nyTop = clamp(this.birdY, 0, topBottom);
    if ((this.birdX - nearestX) ** 2 + (this.birdY - nyTop) ** 2 < r2) return true;
    const nyBot = clamp(this.birdY, botTop, groundTop);
    if ((this.birdX - nearestX) ** 2 + (this.birdY - nyBot) ** 2 < r2) return true;
    return false;
  }

  private die() {
    if (this.mode !== "playing") return;
    this.mode = "dead";
    this.vy = FLAP_V * 0.5;
    this.shake = 2.4;
    this.flash = 1;
    this.spawnBurst(this.birdX, this.birdY, 22, {
      color: this.colors.red,
      speed: 60,
      spread: Math.PI * 2,
      dir: 0,
      life: 0.6,
      size: 2,
      grav: 40,
      color2: "#ffffff",
    });
    const prevBest = this.best;
    const pnl = this.pnl;
    const isBest = pnl > prevBest;
    if (isBest) {
      this.best = pnl;
      try {
        localStorage.setItem(BEST_KEY, String(this.best));
      } catch {}
    }
    this.cb.onGameOver?.({ score: this.score, coins: this.coins, pnl, best: this.best, isBest });
  }

  // ——— particles / floats ———
  private spawnBurst(
    x: number,
    y: number,
    count: number,
    o: {
      color: string;
      color2?: string;
      speed: number;
      spread: number;
      dir: number;
      life: number;
      size: number;
      grav: number;
    },
  ) {
    for (let i = 0; i < count; i++) {
      const a = o.dir + (Math.random() - 0.5) * o.spread;
      const sp = o.speed * (0.4 + Math.random() * 0.6);
      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: o.life * (0.6 + Math.random() * 0.4),
        max: o.life,
        size: o.size * (0.7 + Math.random() * 0.6),
        color: o.color2 && Math.random() > 0.5 ? o.color2 : o.color,
        grav: o.grav,
      });
    }
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.vy += p.grav * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  }

  private addFloat(x: number, y: number, text: string, color: string) {
    this.floats.push({ x, y, vy: -14, life: 0.9, max: 0.9, text, color });
  }

  private updateFloats(dt: number) {
    for (let i = this.floats.length - 1; i >= 0; i--) {
      const f = this.floats[i];
      f.life -= dt;
      if (f.life <= 0) {
        this.floats.splice(i, 1);
        continue;
      }
      f.y += f.vy * dt;
    }
  }

  // ——— rendering ———
  private u(v: number) {
    return v * this.unit;
  }

  private render() {
    const ctx = this.ctx;
    const W = this.W;
    const H = this.H;
    ctx.save();
    if (this.shake > 0.01) {
      ctx.translate(
        (Math.random() * 2 - 1) * this.shake * this.unit,
        (Math.random() * 2 - 1) * this.shake * this.unit,
      );
    }
    this.drawBackground(ctx, W, H);
    for (const c of this.candles) this.drawCandle(ctx, c);
    for (const c of this.candles) if (c.coin) this.drawCoin(ctx, c);
    this.drawParticles(ctx);
    this.drawGround(ctx, W, H);
    this.drawBird(ctx);
    this.drawFloats(ctx);
    ctx.restore();
    if (this.flash > 0.01) {
      ctx.fillStyle = `rgba(255,80,94,${this.flash * 0.45})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  private drawBackground(ctx: CanvasRenderingContext2D, W: number, H: number) {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#0a1410");
    grad.addColorStop(0.55, this.colors.black);
    grad.addColorStop(1, "#050b08");
    ctx.fillStyle = grad;
    ctx.fillRect(-30, -30, W + 60, H + 60);

    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = this.colors.green;
    ctx.lineWidth = 1;
    const cell = this.u(10);
    const off = this.u(this.bgOffset * 0.35) % cell;
    ctx.beginPath();
    for (let x = -off; x < W + cell; x += cell) {
      ctx.moveTo(Math.round(x) + 0.5, 0);
      ctx.lineTo(Math.round(x) + 0.5, H);
    }
    for (let y = 0; y < H + cell; y += cell) {
      ctx.moveTo(0, Math.round(y) + 0.5);
      ctx.lineTo(W, Math.round(y) + 0.5);
    }
    ctx.stroke();
    ctx.restore();

    // ticker tape
    ctx.save();
    const tf = Math.max(9, Math.round(this.u(2.4)));
    ctx.font = `${tf}px ui-monospace, "Courier New", monospace`;
    ctx.fillStyle = this.colors.green;
    ctx.globalAlpha = 0.16;
    ctx.textBaseline = "middle";
    const tape = "BTC 64,210 ▲    ETH 3,120 ▼    SOL 142 ▲    SCALPX ⚡    BNB 612 ▲    XRP 0.62 ▼    ";
    const tw = ctx.measureText(tape).width || 200;
    let tx = -((this.u(this.bgOffset * 0.55)) % tw);
    for (; tx < W; tx += tw) ctx.fillText(tape, tx, this.u(11.5));
    ctx.restore();

    // parallax chart line
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = this.colors.greenDim;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const phase = this.bgOffset * 0.18;
    const midY = H * 0.66;
    const amp = H * 0.05;
    for (let px = 0; px <= W; px += 8) {
      const gx = px / this.unit + phase;
      const y = midY + Math.sin(gx * 0.18) * amp + Math.sin(gx * 0.07) * amp * 0.6;
      if (px === 0) ctx.moveTo(px, y);
      else ctx.lineTo(px, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  private drawCandle(ctx: CanvasRenderingContext2D, c: Candle) {
    const halfW = CANDLE_W / 2;
    const x = this.u(c.x - halfW);
    const w = this.u(CANDLE_W);
    const groundTop = VH - GROUND_H;
    const topH = this.u(c.gapY - this.gap / 2);
    const botY = this.u(c.gapY + this.gap / 2);
    const botH = this.u(groundTop) - botY;
    this.candleBody(ctx, x, 0, w, topH, this.colors.red, true);
    this.candleBody(ctx, x, botY, w, botH, this.colors.green, false);

    // subtle price tags near the gap
    ctx.save();
    const f = Math.max(8, Math.round(this.u(2.2)));
    ctx.font = `${f}px ui-monospace, "Courier New", monospace`;
    ctx.textAlign = "center";
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = this.colors.red;
    ctx.fillText(`▼${c.label}`, this.u(c.x), topH - this.u(1.5));
    ctx.fillStyle = this.colors.green;
    ctx.textBaseline = "top";
    ctx.fillText(`▲${c.label}`, this.u(c.x), botY + this.u(1.5));
    ctx.restore();
  }

  private candleBody(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    wickDown: boolean,
  ) {
    if (h <= 0) return;
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = this.u(2);
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(0,0,0,0.55)";
    ctx.lineWidth = Math.max(2, this.u(0.6));
    ctx.strokeRect(Math.round(x) + 1, Math.round(y), Math.round(w) - 2, Math.round(h));
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.fillRect(Math.round(x) + 3, Math.round(y) + 2, Math.max(2, this.u(1.4)), Math.round(h) - 4);
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(
      Math.round(x + w) - Math.max(2, this.u(1.4)) - 2,
      Math.round(y) + 2,
      Math.max(2, this.u(1.4)),
      Math.round(h) - 4,
    );
    const wickW = Math.max(2, this.u(1.4));
    const wickX = Math.round(x + w / 2 - wickW / 2);
    const wickLen = this.u(5);
    ctx.fillStyle = color;
    if (wickDown) ctx.fillRect(wickX, Math.round(y + h), wickW, Math.round(wickLen));
    else ctx.fillRect(wickX, Math.round(y - wickLen), wickW, Math.round(wickLen));
    ctx.restore();
  }

  private drawCoin(ctx: CanvasRenderingContext2D, c: Candle) {
    if (!c.coin) return;
    const cx = this.u(c.x);
    const cy = this.u(c.gapY);
    let r = this.u(4);
    let alpha = 1;
    if (c.coin.collected) {
      const p = c.coin.pop / 0.35;
      r = this.u(4) * (1 + p * 1.2);
      alpha = 1 - p;
    }
    const sx = Math.abs(Math.cos(this.elapsed * 3 + c.x));
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, cy);
    ctx.scale(Math.max(0.25, sx), 1);
    ctx.shadowColor = this.colors.gold;
    ctx.shadowBlur = this.u(3);
    ctx.fillStyle = this.colors.gold;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = this.colors.green;
    ctx.lineWidth = Math.max(2, this.u(0.8));
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.74, 0, Math.PI * 2);
    ctx.stroke();
    this.drawCoinGlyph(ctx, c.coin.type, r);
    ctx.restore();
  }

  private drawCoinGlyph(ctx: CanvasRenderingContext2D, type: CoinType, r: number) {
    ctx.save();
    if (type === "scalpx") {
      // brand X: two diagonal bars
      ctx.strokeStyle = "#04130b";
      ctx.lineWidth = Math.max(2, r * 0.22);
      ctx.lineCap = "round";
      const s = r * 0.42;
      ctx.beginPath();
      ctx.moveTo(-s, -s);
      ctx.lineTo(s, s);
      ctx.moveTo(s, -s);
      ctx.lineTo(-s, s);
      ctx.stroke();
    } else if (type === "eth") {
      ctx.fillStyle = "#04130b";
      const s = r * 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s * 0.7, 0);
      ctx.lineTo(0, s);
      ctx.lineTo(-s * 0.7, 0);
      ctx.closePath();
      ctx.fill();
    } else {
      // btc: bold B with two ticks
      ctx.fillStyle = "#04130b";
      ctx.font = `bold ${Math.round(r * 1.1)}px ui-monospace, "Courier New", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("B", 0, r * 0.05);
      ctx.fillRect(-r * 0.05, -r * 0.7, r * 0.1, r * 1.4);
    }
    ctx.restore();
  }

  private drawParticles(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = p.color;
      const s = this.u(p.size);
      ctx.fillRect(this.u(p.x) - s / 2, this.u(p.y) - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
  }

  private drawFloats(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const f = Math.max(11, Math.round(this.u(3)));
    ctx.font = `bold ${f}px ui-monospace, "Courier New", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const ft of this.floats) {
      ctx.globalAlpha = Math.min(1, ft.life / ft.max + 0.15);
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillText(ft.text, this.u(ft.x) + 1, this.u(ft.y) + 1);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, this.u(ft.x), this.u(ft.y));
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  private drawGround(ctx: CanvasRenderingContext2D, W: number, H: number) {
    const gy = this.u(VH - GROUND_H);
    ctx.fillStyle = "#08120d";
    ctx.fillRect(-30, gy, W + 60, H - gy + 30);
    ctx.fillStyle = this.colors.green;
    ctx.fillRect(-30, Math.round(gy), W + 60, Math.max(2, this.u(0.8)));
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = this.colors.greenDim;
    const dash = this.u(6);
    const off = this.u(this.bgOffset) % (dash * 2);
    for (let x = -off; x < W; x += dash * 2) {
      ctx.fillRect(Math.round(x), Math.round(gy) + this.u(2), Math.round(dash), Math.max(2, this.u(0.6)));
    }
    ctx.restore();
  }

  private drawBird(ctx: CanvasRenderingContext2D) {
    const img = this.currentFrame();
    if (!img) return;
    const h = this.u(BIRD_DRAW_H);
    const aspect = img.width / img.height;
    const w = h * aspect;
    ctx.save();
    ctx.translate(this.u(this.birdX), this.u(this.birdY));
    ctx.rotate(this.angle);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
  }

  private currentFrame(): HTMLImageElement | undefined {
    let key: string;
    if (this.mode === "dead") key = "dive";
    else if (this.flapTimer > 0) key = "flap";
    else if (this.vy < -8) key = "rise";
    else if (this.vy > 55) key = "dive";
    else key = "glide";
    return this.frames[key] ?? this.frames.glide;
  }
}
