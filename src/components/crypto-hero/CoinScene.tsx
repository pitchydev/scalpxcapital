"use client";

import { Suspense, useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, AdaptiveDpr } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { createCoinAssets, SYMBOLS, type CoinAssets, type CoinSymbol } from "./Coin";
import { clamp, dampAlpha, easeInOutCubic, easeOutBack, easeOutCubic, lerp, smoothstep } from "./anim";

const MINT = "#5EFF95";
const COIN_COUNT = 10;
const HDRI_PATH = "/hdri/studio_small_09_1k.hdr";

type CoinSceneProps = {
  progressRef: MutableRefObject<number>;
  reducedMotion?: boolean;
  paused?: boolean;
  onReady?: () => void;
};

type CoinInstance = {
  symbol: CoinSymbol;
  start: THREE.Vector3;
  end: THREE.Vector3;
  scale: number;
  spin: number;
  phase: number;
  tiltStart: number;
  tiltEnd: number;
  tiltY: number;
  delay: number;
  dur: number;
  dist: number;
  hero: boolean;
};

/** Deterministic PRNG so the layout is stable across renders. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildInstances(portrait: boolean): CoinInstance[] {
  const rnd = mulberry32(20260626);
  const r = (lo: number, hi: number) => lo + rnd() * (hi - lo);

  // ——— Mobile: small coins gently flowing/floating across the scene ———
  // No big eruption and no dominant hero coin; keeps the phone hero clean,
  // light and alive rather than crowding the nav and headline.
  if (portrait) {
    const list: CoinInstance[] = [];
    const spreadX = 2.4;
    for (let i = 0; i < COIN_COUNT; i++) {
      const x = ((i + 0.5) / COIN_COUNT - 0.5) * spreadX * 2 + r(-0.4, 0.4);
      const y = r(-3.2, 2.2);
      const z = r(-1.2, 0.3);
      const end = new THREE.Vector3(x, y, z);
      const start = end.clone().add(new THREE.Vector3(0, -0.9, 0));
      const depth = 1 + z * 0.1;
      list.push({
        symbol: SYMBOLS[i % SYMBOLS.length],
        start,
        end,
        scale: r(0.16, 0.3) * depth,
        spin: r(0.12, 0.4) * (rnd() > 0.5 ? 1 : -1),
        phase: r(0, Math.PI * 2),
        tiltStart: r(-0.4, 0.4),
        tiltEnd: r(-0.5, 0.5),
        tiltY: r(-0.5, 0.5),
        delay: r(0, 0.12),
        dur: r(0.5, 0.85),
        dist: start.distanceTo(end),
        hero: false,
      });
    }
    return list;
  }

  const spreadX = 4.0;
  const list: CoinInstance[] = [];
  for (let i = 0; i < COIN_COUNT; i++) {
    // Start: launched from a WIDE line just below the bottom edge (no central
    // pile) so the coins erupt up across the whole width of the page.
    const launchX = ((i + 0.5) / COIN_COUNT - 0.5) * spreadX * 2 + r(-0.4, 0.4);
    const start = new THREE.Vector3(launchX, r(-3.6, -2.9), r(-0.6, 0.6));
    // End: fanned out and lifted up across the view. On portrait we keep coins
    // further back (smaller apparent size) and lower so they don't crowd the nav.
    const z = portrait ? r(-1.4, 0.6) : r(-1.4, 1.8);
    const end = new THREE.Vector3(r(-spreadX, spreadX), r(-1.6, portrait ? 2.1 : 3.0), z);
    const depth = 1 + z * 0.12;
    list.push({
      symbol: SYMBOLS[i % SYMBOLS.length],
      start,
      end,
      scale: r(0.28, 0.54) * depth * (portrait ? 0.6 : 1),
      spin: r(0.15, 0.45) * (rnd() > 0.5 ? 1 : -1),
      phase: r(0, Math.PI * 2),
      tiltStart: r(-0.4, 0.4),
      tiltEnd: r(-0.6, 0.6),
      tiltY: r(-0.5, 0.5),
      // Stagger left→right with a little jitter for an elegant sweep.
      delay: ((i + 0.5) / COIN_COUNT) * 0.22 + r(0, 0.06),
      dur: r(0.55, 0.82),
      dist: start.distanceTo(end),
      hero: false,
    });
  }

  // Promote one coin to a larger, calmer focal point that settles prominently.
  const hero = list[Math.floor(COIN_COUNT / 2)];
  hero.hero = true;
  hero.symbol = "btc";
  hero.start.set(0, -3.4, 0.6);
  hero.end.set(portrait ? -0.1 : 1.5, portrait ? 0.7 : 0.5, portrait ? 0.5 : 1.2);
  hero.scale = portrait ? 0.66 : 1.3;
  hero.spin = 0.16;
  hero.tiltStart = 0.1;
  hero.tiltEnd = -0.08;
  hero.tiltY = 0.2;
  hero.delay = 0.04;
  hero.dur = 0.9;
  hero.dist = hero.start.distanceTo(hero.end);

  return list;
}

/** Radial mint pool for the hero coin contact shadow / glow. */
function makeContactGlowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const c = size / 2;
  const grad = ctx.createRadialGradient(c, c, 0, c, c, c);
  grad.addColorStop(0, "rgba(255,255,255,0.95)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.35)");
  grad.addColorStop(0.7, "rgba(255,255,255,0.08)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

type SceneRigProps = {
  progressRef: MutableRefObject<number>;
  reducedMotion?: boolean;
  heroFocusRef: MutableRefObject<THREE.Vector3>;
};

/** Scroll-driven camera dolly: wide intro → tighter hero framing. */
function ScrollCamera({ progressRef, reducedMotion, heroFocusRef }: SceneRigProps) {
  const { camera, size } = useThree();
  const portrait = size.width < 820;
  const introPos = useMemo(
    () => new THREE.Vector3(0, portrait ? -0.2 : -0.12, portrait ? 7.7 : 6.85),
    [portrait],
  );
  const outroPos = useMemo(
    () => new THREE.Vector3(portrait ? 0 : 0.82, portrait ? 0.05 : 0.18, portrait ? 6.6 : 5.15),
    [portrait],
  );
  const introLook = useMemo(() => new THREE.Vector3(0, portrait ? -0.7 : -0.55, 0), [portrait]);
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  const desiredPos = useMemo(() => new THREE.Vector3(), []);
  const desiredLook = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const P = reducedMotion ? 0 : clamp(progressRef.current, 0, 1);
    const e = easeInOutCubic(P);

    desiredPos.lerpVectors(introPos, outroPos, e);
    desiredLook.lerpVectors(introLook, heroFocusRef.current, Math.min(1, e * 1.15));

    camera.position.lerp(desiredPos, dampAlpha(0.0006, delta));
    lookAt.lerp(desiredLook, dampAlpha(0.0006, delta));
    camera.lookAt(lookAt);

    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = lerp(42, 35, e);
      camera.fov = lerp(camera.fov, targetFov, dampAlpha(0.0012, delta));
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

/** Soft ground glow + mint rim light locked to the hero coin. */
function HeroContactGlow({ progressRef, reducedMotion, heroFocusRef }: SceneRigProps) {
  const poolRef = useRef<THREE.Mesh>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const spotTarget = useMemo(() => new THREE.Object3D(), []);
  const glowTex = useMemo(() => makeContactGlowTexture(), []);

  useEffect(() => () => glowTex.dispose(), [glowTex]);

  useFrame(() => {
    const pos = heroFocusRef.current;
    const P = reducedMotion ? 0 : clamp(progressRef.current, 0, 1);
    const glow = smoothstep(0.12, 0.52, P);

    spotTarget.position.copy(pos);
    if (spotRef.current) {
      spotRef.current.position.set(pos.x + 0.35, pos.y + 2.4, pos.z + 1.6);
      spotRef.current.intensity = lerp(0, 3.2, glow);
    }

    const pool = poolRef.current;
    if (!pool) return;
    pool.position.set(pos.x, pos.y - 0.52, pos.z + 0.04);
    pool.scale.setScalar(lerp(0.25, 1.55, glow));
    const mat = pool.material as THREE.MeshBasicMaterial;
    mat.opacity = lerp(0, 0.42, glow);
  });

  return (
    <>
      <primitive object={spotTarget} />
      <spotLight
        ref={spotRef}
        target={spotTarget}
        color={MINT}
        angle={0.52}
        penumbra={0.9}
        distance={10}
        decay={2}
        intensity={0}
      />
      <mesh ref={poolRef} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-2}>
        <circleGeometry args={[1, 48]} />
        <meshBasicMaterial
          map={glowTex}
          color={MINT}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}

function Fountain({ progressRef, reducedMotion, heroFocusRef }: SceneRigProps) {
  const coinRefs = useRef<(THREE.Group | null)[]>([]);
  const trailRefs = useRef<(THREE.Mesh | null)[]>([]);
  const { size, gl } = useThree();
  const portrait = size.width < 820;

  const assets = useMemo<CoinAssets>(
    () => createCoinAssets(Math.min(8, gl.capabilities.getMaxAnisotropy())),
    [gl],
  );
  useEffect(() => () => assets.dispose(), [assets]);

  const instances = useMemo(() => buildInstances(portrait), [portrait]);
  const heroIndex = useMemo(() => {
    const found = instances.findIndex((i) => i.hero);
    return found >= 0 ? found : Math.floor(instances.length / 2);
  }, [instances]);

  useFrame((state) => {
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const P = reducedMotion ? 1 : clamp(progressRef.current, 0, 1);

    // Track hero world position for DoF, camera dolly, and contact glow.
    const heroCoin = coinRefs.current[heroIndex];
    if (heroCoin) heroCoin.getWorldPosition(heroFocusRef.current);

    for (let i = 0; i < instances.length; i++) {
      const c = coinRefs.current[i];
      if (!c) continue;
      const inst = instances[i];
      const local = clamp((P - inst.delay) / inst.dur, 0, 1);
      const ePos = easeOutBack(local); // overshoot for a lively launch
      // On mobile the coins stay near full size and keep flowing from the very
      // top (no scroll required), so we floor the scale/idle terms.
      const eScale = portrait ? Math.max(0.85, easeOutCubic(local)) : easeOutCubic(local);
      const settle = portrait ? Math.max(0.8, local) : local;

      // Living idle: gentle bob, lateral sway + slow multi-axis tumble. Mobile
      // coins flow with a bit more amplitude so the small cluster feels alive.
      const amp = portrait ? 2.4 : 1;
      const bob = Math.sin(t * 0.6 + inst.phase) * 0.08 * amp * settle;
      const sway = Math.sin(t * 0.42 + inst.phase * 1.3) * 0.06 * amp * settle;

      const px = lerp(inst.start.x, inst.end.x, ePos) + sway;
      const py = lerp(inst.start.y, inst.end.y, ePos) + bob;
      const pz = lerp(inst.start.z, inst.end.z, ePos);

      c.position.set(px, py, pz);
      c.scale.setScalar(lerp(inst.scale * 0.65, inst.scale, eScale));
      c.rotation.z = t * inst.spin + inst.phase;
      c.rotation.x = lerp(inst.tiltStart, inst.tiltEnd, eScale) + Math.sin(t * 0.3 + inst.phase) * 0.14 * settle;
      c.rotation.y = inst.tiltY + Math.cos(t * 0.25 + inst.phase) * 0.14 * settle;

      // Motion trail - strongest mid-flight for the fastest-travelling coins.
      const tr = trailRefs.current[i];
      if (tr) {
        const strength = Math.sin(clamp(local, 0, 1) * Math.PI) * clamp(inst.dist / 3.2, 0.15, 1);
        if (reducedMotion || portrait || strength < 0.05) {
          tr.visible = false;
        } else {
          tr.visible = true;
          tr.position.set(px, py, pz - 0.08);
          tr.scale.set(inst.scale * (0.12 + 0.45 * strength), inst.scale * (0.6 + 3.4 * strength), 1);
        }
      }
    }
  });

  return (
    <group>
      {/* Trails render first so the coins draw over them. */}
      {instances.map((_, i) => (
        <mesh
          key={`trail-${i}`}
          ref={(el) => { trailRefs.current[i] = el; }}
          geometry={assets.trailGeometry}
          material={assets.trailMaterial}
          visible={false}
          renderOrder={-1}
        />
      ))}
      {instances.map((inst, i) => (
        <group key={i} ref={(el) => { coinRefs.current[i] = el; }}>
          <mesh geometry={assets.bodyGeometry} material={assets.bodyMaterial} />
          <mesh geometry={assets.faceGeometry} material={assets.faceMaterials[inst.symbol]} position={[0, 0, assets.faceOffset]} />
          <mesh geometry={assets.faceGeometry} material={assets.faceMaterials[inst.symbol]} position={[0, 0, -assets.faceOffset]} rotation={[0, Math.PI, 0]} />
        </group>
      ))}
    </group>
  );
}

/** Neutral studio rig with a mint accent for on-brand reflections. */
function ChromeStudio() {
  return (
    <group>
      <mesh scale={60}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#05070b" side={THREE.BackSide} />
      </mesh>
      <Lightformer form="rect" intensity={4} color="#ffffff" position={[0, 6, 1]} rotation={[Math.PI / 2, 0, 0]} scale={[12, 12, 1]} />
      <Lightformer form="rect" intensity={2} color="#dfe9f5" position={[-7, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[9, 7, 1]} />
      <Lightformer form="rect" intensity={5} color="#ffffff" position={[-3.5, 3.5, 4]} rotation={[0, 0.5, 0]} scale={[0.5, 7, 1]} />
      <Lightformer form="rect" intensity={2.6} color={MINT} position={[3, -2.5, 3]} rotation={[0, -Math.PI / 3, 0]} scale={[5, 1, 1]} />
    </group>
  );
}

export default function CoinScene({ progressRef, reducedMotion = false, paused = false, onReady }: CoinSceneProps) {
  const heroFocusRef = useRef(new THREE.Vector3(0, -0.5, 0));
  const rigProps: SceneRigProps = { progressRef, reducedMotion, heroFocusRef };

  return (
    <Canvas
      dpr={1}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, -0.12, 6.85], fov: 42, near: 0.1, far: 100 }}
      style={{ background: "transparent" }}
      frameloop={reducedMotion || paused ? "demand" : "always"}
      performance={{ min: 0.5 }}
      onCreated={() => onReady?.()}
    >
      {/* Subtle depth fog so far coins recede into the ink. */}
      <fog attach="fog" args={["#060807", 7.5, 14]} />

      {/* Bundled studio HDRI for rich metal reflections + mint accent lights. */}
      <Suspense fallback={null}>
        <Environment files={HDRI_PATH} environmentIntensity={0.9} background={false}>
          <ChromeStudio />
        </Environment>
      </Suspense>

      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 8]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-6, -2, -4]} intensity={0.9} color="#dfe9f5" />

      <Suspense fallback={null}>
        <Fountain {...rigProps} />
        <HeroContactGlow {...rigProps} />
        <ScrollCamera {...rigProps} />
      </Suspense>

      {!reducedMotion && (
        <>
          <AdaptiveDpr pixelated />
          <EffectComposer enableNormalPass={false} multisampling={0}>
            <Bloom mipmapBlur intensity={0.5} luminanceThreshold={0.74} luminanceSmoothing={0.26} radius={0.5} />
          </EffectComposer>
        </>
      )}
    </Canvas>
  );
}
