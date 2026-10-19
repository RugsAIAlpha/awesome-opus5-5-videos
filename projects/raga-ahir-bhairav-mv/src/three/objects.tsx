import React, { useMemo } from "react";
import { random } from "remotion";
import * as THREE from "three";
import { bandsAt, rmsAt } from "../audio";
import { dotTexture, Glow, V3 } from "./core";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Spectrum value at a fractional band index
const bandValue = (frame: number, band: number) => {
  const b = bandsAt(frame);
  const i = Math.floor(band);
  const f = band - i;
  return lerp(b[Math.min(15, i)], b[Math.min(15, i + 1)], f);
};

// ─── Gold materials ──────────────────────────────────────────────────────────

const Gold: React.FC<{ color?: string; energy?: number; roughness?: number }> = ({
  color = "#E8B860",
  energy = 0,
  roughness = 0.34,
}) => (
  <meshStandardMaterial
    color={color}
    metalness={1}
    roughness={roughness}
    emissive="#FF9A3C"
    emissiveIntensity={0.015 + energy * 0.12}
    envMapIntensity={0.75}
  />
);

export const GoldRing: React.FC<{
  radius: number;
  tube?: number;
  rotation?: V3;
  position?: V3;
  energy?: number;
  color?: string;
}> = ({ radius, tube = 0.035, rotation = [0, 0, 0], position = [0, 0, 0], energy = 0, color }) => (
  <mesh rotation={rotation} position={position}>
    <torusGeometry args={[radius, tube, 16, 220]} />
    <Gold energy={energy} color={color} />
  </mesh>
);

// ─── Lotus mandala ───────────────────────────────────────────────────────────

let petal: THREE.ExtrudeGeometry | null = null;
const petalGeometry = () => {
  if (petal) return petal;
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.36, 0.22, 0.34, 0.78, 0, 1.2);
  s.bezierCurveTo(-0.34, 0.78, -0.36, 0.22, 0, 0);
  petal = new THREE.ExtrudeGeometry(s, {
    depth: 0.03,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.03,
    bevelSegments: 3,
    curveSegments: 20,
  });
  return petal;
};

const RINGS = [
  { n: 8, r: 0.32, s: 0.55, delay: 0, color: "#F2C46A" },
  { n: 12, r: 0.85, s: 0.82, delay: 0.12, color: "#E89A6A" },
  { n: 16, r: 1.6, s: 1.05, delay: 0.24, color: "#F2C46A" },
  { n: 24, r: 2.6, s: 1.22, delay: 0.36, color: "#E89A6A" },
  { n: 32, r: 3.8, s: 1.32, delay: 0.48, color: "#F2C46A" },
];

// Petal rings open from a closed bud (open = 0) to a full flower (open = 1)
export const Mandala3D: React.FC<{ open: number; spin: number; energy: number }> = ({ open, spin, energy }) => {
  const geometry = petalGeometry();
  return (
    <group>
      {RINGS.map((ring, ri) => {
        const p = smooth(clamp01((open - ring.delay) / 0.45));
        const tilt = lerp(1.45, 0.18 + ri * 0.06, p);
        const dir = ri % 2 ? -1 : 1;
        return (
          <group key={ri} rotation={[0, 0, spin * dir * (1 + ri * 0.18)]}>
            {Array.from({ length: ring.n }).map((_, i) => {
              const a = (i / ring.n) * Math.PI * 2 + (ri % 2 ? Math.PI / ring.n : 0);
              return (
                <group key={i} rotation={[0, 0, a - Math.PI / 2]}>
                  <mesh
                    geometry={geometry}
                    position={[0, ring.r * lerp(0.4, 1, p), 0]}
                    rotation={[tilt, 0, 0]}
                    scale={ring.s * lerp(0.35, 1, p)}
                  >
                    <Gold color={ring.color} energy={energy} />
                  </mesh>
                </group>
              );
            })}
            {p > 0.05 ? (
              <GoldRing radius={ring.r * lerp(0.4, 1, p) + ring.s * 1.25} tube={0.02 + ri * 0.004} energy={energy} />
            ) : null}
          </group>
        );
      })}
    </group>
  );
};

// ─── Sound terrain: a scrolling 3D spectrogram ───────────────────────────────

const T_COLS = 84;
const T_ROWS = 72;

export const SoundTerrain: React.FC<{ frame: number }> = ({ frame }) => {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(T_COLS * 0.5, T_ROWS * 0.7, T_COLS - 1, T_ROWS - 1);
    g.rotateX(-Math.PI / 2);
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(T_COLS * T_ROWS * 3), 3));
    return g;
  }, []);
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  const col = geometry.attributes.color as THREE.BufferAttribute;
  const low = new THREE.Color("#5B1E6E");
  const mid = new THREE.Color("#F0A54A");
  const hot = new THREE.Color("#FFF4D8");
  const c = new THREE.Color();
  for (let r = 0; r < T_ROWS; r++) {
    // Far rows hold the newest audio; it rolls towards the camera
    const t = frame - r * 2;
    for (let k = 0; k < T_COLS; k++) {
      const u = Math.abs(k / (T_COLS - 1) - 0.5) * 2;
      const v = Math.pow(bandValue(t, u * 14), 1.5);
      const h = v * 3.4 * (1 - 0.45 * u) + Math.sin(k * 0.6 + r * 0.4) * 0.06;
      const idx = r * T_COLS + k;
      pos.setY(idx, h);
      if (v < 0.5) c.copy(low).lerp(mid, v * 2);
      else c.copy(mid).lerp(hot, (v - 0.5) * 2);
      col.setXYZ(idx, c.r, c.g, c.b);
    }
  }
  pos.needsUpdate = true;
  col.needsUpdate = true;
  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial vertexColors wireframe transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <points geometry={geometry}>
        <pointsMaterial map={dotTexture()} vertexColors size={0.16} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
};

// ─── Dawn ocean ──────────────────────────────────────────────────────────────

const O_COLS = 96;
const O_ROWS = 64;

export const Ocean: React.FC<{ frame: number }> = ({ frame }) => {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(90, 70, O_COLS - 1, O_ROWS - 1);
    g.rotateX(-Math.PI / 2);
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(O_COLS * O_ROWS * 3), 3));
    return g;
  }, []);
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  const col = geometry.attributes.color as THREE.BufferAttribute;
  const deep = new THREE.Color("#2A1F6B");
  const rose = new THREE.Color("#D2557A");
  const gold = new THREE.Color("#FFD27A");
  const c = new THREE.Color();
  const swell = 1 + rmsAt(frame) * 0.8;
  const t = frame;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const y =
      swell *
      (0.34 * Math.sin(x * 0.32 + t * 0.045) +
        0.26 * Math.sin(z * 0.45 - t * 0.06) +
        0.14 * Math.sin((x + z) * 0.9 + t * 0.09));
    pos.setY(i, y);
    // A golden path of reflected sunlight down the centre
    const path = Math.exp(-Math.pow(x / (3 + (z + 35) * 0.12), 2));
    c.copy(deep).lerp(rose, clamp01(0.3 + y * 0.6)).lerp(gold, path * clamp01(0.5 + y));
    col.setXYZ(i, c.r, c.g, c.b);
  }
  pos.needsUpdate = true;
  col.needsUpdate = true;
  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial vertexColors wireframe transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <points geometry={geometry}>
        <pointsMaterial map={dotTexture()} vertexColors size={0.14} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
};

// ─── Swara helix ─────────────────────────────────────────────────────────────

export const HELIX_R = 2.6;
export const helixPoint = (i: number, rot: number): V3 => [
  HELIX_R * Math.cos(i * 0.85 + rot),
  -4 + i * 1.15,
  HELIX_R * Math.sin(i * 0.85 + rot),
];

// Eight glowing orbs on a gold helix; `lit[i]` is each note's 0–1 brightness
export const SwaraHelix: React.FC<{ rot: number; lit: number[]; energy: number }> = ({ rot, lit, energy }) => {
  const tube = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let s = -1.5; s <= 8.5; s += 0.05) pts.push(new THREE.Vector3(...helixPoint(s, 0)));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 400, 0.035, 10, false);
  }, []);
  return (
    <group>
      <group rotation={[0, -rot, 0]}>
        <mesh geometry={tube}>
          <Gold energy={energy} />
        </mesh>
      </group>
      {lit.map((l, i) => {
        const p = helixPoint(i, rot);
        return (
          <group key={i} position={p}>
            <mesh scale={0.26 + l * 0.14}>
              <sphereGeometry args={[1, 32, 32]} />
              <meshBasicMaterial color={new THREE.Color(1 + l * 1.4, 0.75 + l * 0.8, 0.35 + l * 0.3)} toneMapped={false} />
            </mesh>
            <Glow position={[0, 0, 0]} scale={1.6 + l * 3.4} color={i === 1 || i === 6 ? "#FF8A3D" : "#FFD27A"} opacity={0.5 + l * 0.5} />
          </group>
        );
      })}
    </group>
  );
};

// ─── Ring tunnel and warp streaks ────────────────────────────────────────────

export const RingTunnel: React.FC<{ frame: number; count: number; spacing: number }> = ({ frame, count, spacing }) => {
  const energy = rmsAt(frame);
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <GoldRing
          key={i}
          radius={3.1 + Math.sin(i * 0.7) * 0.25}
          tube={0.05}
          position={[0, 0, -i * spacing]}
          rotation={[0, 0, i * 0.35 + frame * 0.012 * (i % 2 ? 1 : -1)]}
          energy={i % 3 === 0 ? energy * 1.6 : energy * 0.4}
          color={i % 2 ? "#E89A6A" : "#F2C46A"}
        />
      ))}
    </group>
  );
};

export const WarpLines: React.FC<{ seed: string; count: number; cameraZ: number; stretch: number; opacity: number }> = ({
  seed,
  count,
  cameraZ,
  stretch,
  opacity,
}) => {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 6), 3));
    return g;
  }, [count]);
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  const depth = 120;
  for (let i = 0; i < count; i++) {
    const a = random(`${seed}-a-${i}`) * Math.PI * 2;
    const r = 1.2 + random(`${seed}-r-${i}`) * 7;
    // Each streak sits at a fixed world depth, wrapped to stay ahead of the camera
    const z0 = -random(`${seed}-z-${i}`) * depth;
    const z = cameraZ - ((((cameraZ - z0) % depth) + depth) % depth) - 2;
    pos.setXYZ(i * 2, Math.cos(a) * r, Math.sin(a) * r, z);
    pos.setXYZ(i * 2 + 1, Math.cos(a) * r, Math.sin(a) * r, z - stretch);
  }
  pos.needsUpdate = true;
  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#FFE3B0" transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
    </lineSegments>
  );
};
