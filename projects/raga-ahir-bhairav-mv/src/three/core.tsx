import { useThree } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer } from "@react-three/postprocessing";
import { ThreeCanvas } from "@remotion/three";
import React, { useEffect, useMemo } from "react";
import { continueRender, delayRender, random, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { H, W } from "../timeline";

export type V3 = [number, number, number];

// ─── Textures (drawn once per tab, deterministic) ────────────────────────────

const radialTexture = (stops: [number, string][]) => {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  for (const [o, col] of stops) grd.addColorStop(o, col);
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

let glowTex: THREE.Texture | null = null;
let dotTex: THREE.Texture | null = null;

// Soft halo for sprites and nebulae
export const glowTexture = () =>
  (glowTex ??= radialTexture([
    [0, "rgba(255,255,255,1)"],
    [0.18, "rgba(255,255,255,0.7)"],
    [0.45, "rgba(255,255,255,0.16)"],
    [1, "rgba(255,255,255,0)"],
  ]));

// Round point sprite for stars and dust
export const dotTexture = () =>
  (dotTex ??= radialTexture([
    [0, "rgba(255,255,255,1)"],
    [0.35, "rgba(255,255,255,0.85)"],
    [0.6, "rgba(255,255,255,0.2)"],
    [1, "rgba(255,255,255,0)"],
  ]));

// ─── Scene scaffolding ───────────────────────────────────────────────────────

// Studio-style reflections so metallic gold reads as gold
const Environment: React.FC = () => {
  const { gl, scene } = useThree();
  useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  }, [gl, scene]);
  return null;
};

// Places the camera for the current frame
export const CameraRig: React.FC<{ position: V3; target: V3; fov?: number; roll?: number }> = ({
  position,
  target,
  fov = 50,
  roll = 0,
}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(...position);
  camera.up.set(Math.sin(roll), Math.cos(roll), 0);
  camera.lookAt(...target);
  if (camera.fov !== fov) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
  return null;
};

const aberration = new THREE.Vector2(0.0016, 0.0009);

// The post-processing passes attach one commit after the canvas mounts, so the first frame a tab
// renders in a scene would come out blank. Hold each frame until the scene has drawn again.
const Settle: React.FC = () => {
  const frame = useCurrentFrame();
  const advance = useThree((s) => s.advance);
  useEffect(() => {
    const handle = delayRender("Settling 3D frame");
    let raf = requestAnimationFrame(() => {
      advance(performance.now());
      raf = requestAnimationFrame(() => continueRender(handle));
    });
    return () => {
      cancelAnimationFrame(raf);
      continueRender(handle);
    };
  }, [frame, advance]);
  return null;
};

export const Scene3D: React.FC<{
  children: React.ReactNode;
  background?: string;
  fog?: [string, number, number];
  bloom?: number;
  transparent?: boolean;
}> = ({ children, background, fog, bloom = 1.3, transparent = false }) => (
  <ThreeCanvas
    width={W}
    height={H}
    gl={{ antialias: true, alpha: transparent }}
    camera={{ fov: 50, near: 0.1, far: 500, position: [0, 0, 10] }}
    style={{ position: "absolute", inset: 0 }}
  >
    {background ? <color attach="background" args={[background]} /> : null}
    {fog ? <fog attach="fog" args={fog} /> : null}
    <Environment />
    {children}
    {bloom > 0 ? (
      <EffectComposer>
        <Bloom intensity={bloom} luminanceThreshold={0.55} luminanceSmoothing={0.3} mipmapBlur />
        <ChromaticAberration offset={aberration} radialModulation={false} modulationOffset={0} />
      </EffectComposer>
    ) : null}
    <Settle />
  </ThreeCanvas>
);

// ─── Shared objects ──────────────────────────────────────────────────────────

export const Glow: React.FC<{ position: V3; scale: number; color: string; opacity?: number }> = ({
  position,
  scale,
  color,
  opacity = 1,
}) => (
  <sprite position={position} scale={[scale, scale, 1]}>
    <spriteMaterial
      map={glowTexture()}
      color={color}
      transparent
      opacity={opacity}
      depthWrite={false}
      blending={THREE.AdditiveBlending}
    />
  </sprite>
);

// Stars in a box; `twinkle` is a 0–1 brightness driven by the music
export const StarField: React.FC<{
  seed: string;
  count: number;
  box: V3;
  center?: V3;
  size?: number;
  color?: string;
  opacity?: number;
}> = ({ seed, count, box, center = [0, 0, 0], size = 0.12, color = "#FFF1D6", opacity = 1 }) => {
  const geometry = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = center[0] + (random(`${seed}-x-${i}`) - 0.5) * box[0];
      a[i * 3 + 1] = center[1] + (random(`${seed}-y-${i}`) - 0.5) * box[1];
      a[i * 3 + 2] = center[2] + (random(`${seed}-z-${i}`) - 0.5) * box[2];
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(a, 3));
    return g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, count]);
  return (
    <points geometry={geometry}>
      <pointsMaterial
        map={dotTexture()}
        size={size}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

// Coloured gas clouds built from large additive sprites
export const Nebula: React.FC<{ seed: string; count: number; spread: V3; center: V3; colors: string[]; opacity: number }> = ({
  seed,
  count,
  spread,
  center,
  colors,
  opacity,
}) => (
  <>
    {Array.from({ length: count }).map((_, i) => {
      const r = (k: string) => random(`${seed}-${i}-${k}`);
      return (
        <Glow
          key={i}
          position={[
            center[0] + (r("x") - 0.5) * spread[0],
            center[1] + (r("y") - 0.5) * spread[1],
            center[2] + (r("z") - 0.5) * spread[2],
          ]}
          scale={14 + r("s") * 26}
          color={colors[Math.floor(r("c") * colors.length)]}
          opacity={opacity * (0.25 + r("o") * 0.35)}
        />
      );
    })}
  </>
);

// Emissive sun with layered halos; `energy` swells it with the music
export const Sun: React.FC<{ position: V3; radius: number; energy: number; opacity?: number }> = ({
  position,
  radius,
  energy,
  opacity = 1,
}) => (
  <group position={position}>
    <mesh>
      <sphereGeometry args={[radius, 48, 48]} />
      <meshBasicMaterial color={new THREE.Color(1.6, 1.15, 0.6)} transparent opacity={opacity} toneMapped={false} />
    </mesh>
    <Glow position={[0, 0, 0]} scale={radius * (5 + energy * 2)} color="#FFB45E" opacity={0.9 * opacity} />
    <Glow position={[0, 0, 0]} scale={radius * (12 + energy * 5)} color="#FF7A3A" opacity={0.45 * opacity} />
    <Glow position={[0, 0, 0]} scale={radius * 26} color="#C2407A" opacity={0.22 * opacity} />
  </group>
);
