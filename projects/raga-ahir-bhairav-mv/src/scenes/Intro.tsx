import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { bandsAt, rmsAt } from "../audio";
import { CaptionBlock, CaptionShade, Cine, CineVignette, LightLeaks, SWARAS } from "../cine";
import { CameraRig, Nebula, Scene3D, StarField, Sun, V3 } from "../three/core";
import { helixPoint, Mandala3D, Ocean, RingTunnel, SoundTerrain, SwaraHelix, WarpLines } from "../three/objects";
import { CAPS, CREAM, DEVA, GOLD, SAFFRON, SERIF, tween } from "../theme";
import { H, SCENES, W } from "../timeline";

const inOut = Easing.inOut(Easing.sin);

const useWindow = (range: readonly [number, number]) => {
  const frame = useCurrentFrame();
  return { frame, active: frame >= range[0] && frame < range[1], local: frame - range[0] };
};

const Lights: React.FC<{ energy: number }> = ({ energy }) => (
  <>
    <ambientLight intensity={0.25} />
    <pointLight position={[0, 0, 3]} intensity={6 + energy * 10} color="#FFB060" distance={40} />
    <directionalLight position={[6, 9, 8]} intensity={1.3} color="#FFE6C0" />
    <directionalLight position={[-8, -4, 4]} intensity={1.1} color="#B070FF" />
  </>
);

// ─── 1 · Cosmos ──────────────────────────────────────────────────────────────

const Cosmos: React.FC = () => {
  const { frame, active, local } = useWindow(SCENES.cosmos);
  if (!active) return null;
  const energy = rmsAt(frame);
  const z = tween(local, [0, 420], [46, 6], inOut);
  return (
    <AbsoluteFill>
      <Scene3D background="#04020A" bloom={1.5}>
        <CameraRig position={[Math.sin(local / 200) * 1.6, Math.cos(local / 260) * 1.2, z]} target={[0, 0, -40]} roll={local * 0.0009} />
        <StarField seed="cosmos" count={3200} box={[70, 110, 160]} center={[0, 0, -30]} size={0.2} />
        <Nebula
          seed="cosmos-neb"
          count={16}
          spread={[60, 90, 40]}
          center={[0, 0, -70]}
          colors={["#5B2A86", "#2B3A9E", "#C2407A", "#F08A3C"]}
          opacity={tween(local, [0, 120], [0, 1])}
        />
        <Sun position={[0, 0, -74]} radius={3 * tween(local, [100, 410], [0.2, 1], inOut)} energy={energy} opacity={tween(local, [90, 200], [0, 1])} />
      </Scene3D>
      <CineVignette strength={0.6} />
      <CaptionBlock top={860}>
        <Cine text="IN THE HOUR BEFORE DAWN" at={40} until={200} mode="track" size={54} tracking={0.18} />
      </CaptionBlock>
      <CaptionBlock top={1300}>
        <Cine text="A RAGA" at={215} until={405} mode="flip" size={150} gold weight={700} />
        <Cine text="AWAKENS" at={232} until={405} mode="flip" size={150} gold weight={700} />
      </CaptionBlock>
    </AbsoluteFill>
  );
};

// ─── 2 · Lotus mandala ───────────────────────────────────────────────────────

const Lotus: React.FC = () => {
  const { frame, active, local } = useWindow(SCENES.mandala);
  if (!active) return null;
  const energy = rmsAt(frame);
  const R = tween(local, [0, 600], [30, 19], inOut);
  const a = tween(local, [0, 600], [-0.7, 0.55], inOut);
  return (
    <AbsoluteFill>
      <Scene3D background="#05030C" bloom={0.9}>
        <CameraRig position={[R * Math.sin(a), 1.2 + Math.sin(local / 110) * 0.8, R * Math.cos(a)]} target={[0, 0, 0]} roll={Math.sin(local / 150) * 0.06} />
        <Lights energy={energy} />
        <group rotation={[-0.38, 0, 0]}>
          <Mandala3D open={tween(local, [20, 330], [0, 1], inOut)} spin={local * 0.003} energy={energy} />
          <Sun position={[0, 0, 0.35]} radius={0.42} energy={energy} />
        </group>
        <StarField seed="lotus" count={1800} box={[80, 120, 60]} center={[0, 0, -30]} size={0.22} />
        <Nebula seed="lotus-neb" count={10} spread={[60, 80, 20]} center={[0, 0, -40]} colors={["#5B2A86", "#C2407A", "#2B3A9E"]} opacity={0.8} />
      </Scene3D>
      <CineVignette strength={0.55} />
      <CaptionShade y={1580} h={700} />
      <CaptionShade y={320} h={360} strength={0.6} />
      <CaptionBlock top={250}>
        <Cine text="राग अहीर भैरव" at={600} until={1000} mode="blur" size={96} font={DEVA} weight={400} gold />
      </CaptionBlock>
      <CaptionBlock top={1360}>
        <Cine text="RAGA" at={470} until={1000} mode="track" size={38} tracking={0.6} color={GOLD} />
        <Cine text="AHIR" at={490} until={1000} mode="flip" size={180} gold weight={700} stagger={4} />
        <Cine text="BHAIRAV" at={510} until={1000} mode="flip" size={180} gold weight={700} stagger={3} />
      </CaptionBlock>
    </AbsoluteFill>
  );
};

// ─── 3 · Sound terrain ───────────────────────────────────────────────────────

const FACTS = [
  { at: 1060, until: 1200, k: "PRAHAR", v: "FIRST LIGHT" },
  { at: 1210, until: 1350, k: "THAAT", v: "BHAIRAV" },
  { at: 1360, until: 1545, k: "VADI · SAMVADI", v: "MA · SA" },
];

const Terrain: React.FC = () => {
  const { frame, active, local } = useWindow(SCENES.terrain);
  if (!active) return null;
  const energy = rmsAt(frame);
  return (
    <AbsoluteFill>
      <Scene3D background="#080515" fog={["#080515", 12, 48]} bloom={1.25}>
        <CameraRig
          position={[Math.sin(local / 90) * 1.4, 2.6 + Math.sin(local / 70) * 0.35, tween(local, [0, 540], [22, 13], inOut)]}
          target={[0, 1, -22]}
          roll={Math.sin(local / 80) * 0.05}
        />
        <SoundTerrain frame={frame} />
        <Sun position={[0, 5, -46]} radius={3.4} energy={energy} />
        <StarField seed="terrain" count={1400} box={[120, 40, 40]} center={[0, 22, -60]} size={0.3} />
      </Scene3D>
      <CineVignette strength={0.5} />
      {FACTS.map((f) => (
        <CaptionBlock key={f.k} top={330}>
          <Cine text={f.k} at={f.at} until={f.until} mode="track" size={40} tracking={0.45} color={GOLD} />
          <Cine text={f.v} at={f.at + 12} until={f.until} mode="flip" size={132} gold weight={700} style={{ marginTop: 18 }} />
        </CaptionBlock>
      ))}
    </AbsoluteFill>
  );
};

// ─── 4 · Swara helix ─────────────────────────────────────────────────────────

const projector = new THREE.PerspectiveCamera(50, W / H, 0.1, 500);
const project = (p: V3, cam: V3, target: V3) => {
  projector.position.set(...cam);
  projector.up.set(0, 1, 0);
  projector.lookAt(...target);
  projector.updateMatrixWorld();
  const v = new THREE.Vector3(...p).project(projector);
  return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H, front: v.z < 1 };
};

const Helix: React.FC = () => {
  const { frame, active, local } = useWindow(SCENES.helix);
  if (!active) return null;
  const energy = rmsAt(frame);
  const b = bandsAt(frame);
  const rot = local * 0.011;
  const camY = tween(local, [0, 540], [-1.4, 1.6], inOut);
  const cam: V3 = [Math.sin(local / 160) * 2, camY + 1.2, 11.5];
  const target: V3 = [0, camY, 0];
  const k = (frame - 1700) / 28;
  const lit = SWARAS.map((_, i) => {
    if (k < i) return 0;
    const fresh = 0.45 + 0.55 * Math.exp(-(k - i) * 1.4);
    return Math.min(1, fresh + (frame > 1960 ? b[i * 2] * 0.5 : 0));
  });
  return (
    <AbsoluteFill>
      <Scene3D background="#06030E" bloom={1.5}>
        <CameraRig position={cam} target={target} />
        <Lights energy={energy} />
        <SwaraHelix rot={rot} lit={lit} energy={energy} />
        <StarField seed="helix" count={2200} box={[50, 70, 50]} center={[0, 0, -15]} size={0.18} />
        <Nebula seed="helix-neb" count={8} spread={[40, 60, 10]} center={[0, 0, -30]} colors={["#2B3A9E", "#5B2A86"]} opacity={0.8} />
      </Scene3D>
      {SWARAS.map((note, i) => {
        const s = project(helixPoint(i, rot), cam, target);
        if (lit[i] <= 0 || !s.front) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x + 56,
              top: s.y - 52,
              opacity: Math.min(1, lit[i] * 2),
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontFamily: DEVA,
                fontSize: 66,
                lineHeight: 1,
                color: note.komal ? SAFFRON : CREAM,
                filter: "drop-shadow(0 0 16px rgba(255,180,90,0.8)) drop-shadow(0 3px 6px rgba(0,0,0,0.6))",
              }}
            >
              {note.dev}
            </div>
            <div style={{ fontFamily: CAPS, fontSize: 22, letterSpacing: "0.3em", color: GOLD, marginTop: 6 }}>
              {note.lat}
              {note.komal ? " · KOMAL" : note.taar ? " · TAAR" : ""}
            </div>
          </div>
        );
      })}
      <CineVignette strength={0.5} />
      <CaptionBlock top={190}>
        <Cine text="AAROH" at={1580} until={2085} mode="flip" size={150} gold weight={700} stagger={4} />
        <Cine text="THE ASCENDING SCALE" at={1610} until={2085} mode="track" size={34} tracking={0.4} color={GOLD} />
      </CaptionBlock>
      <CaptionBlock top={1630}>
        <Cine text="RE AND NI ARE KOMAL — SOFTENED" at={1950} until={2085} mode="track" size={30} tracking={0.25} />
      </CaptionBlock>
    </AbsoluteFill>
  );
};

// ─── 5 · Dawn ocean ──────────────────────────────────────────────────────────

const Dawn: React.FC = () => {
  const { frame, active, local } = useWindow(SCENES.ocean);
  if (!active) return null;
  const energy = rmsAt(frame);
  return (
    <AbsoluteFill>
      <Scene3D background="#140B26" fog={["#140B26", 14, 62]} bloom={1.4}>
        <CameraRig position={[Math.sin(local / 120) * 0.8, 1.8 + Math.sin(local / 50) * 0.12, tween(local, [0, 379], [16, 10], inOut)]} target={[0, 2.2, -30]} roll={Math.sin(local / 90) * 0.03} />
        <Ocean frame={frame} />
        <Sun position={[0, tween(local, [0, 379], [-2.2, 3.4], inOut), -40]} radius={3.4} energy={energy} />
        <StarField seed="dawn" count={900} box={[120, 40, 30]} center={[0, 24, -55]} size={0.3} opacity={tween(local, [0, 379], [1, 0.2])} />
      </Scene3D>
      <LightLeaks opacity={0.45} seed="dawn" />
      <CineVignette strength={0.5} />
      <CaptionBlock top={300}>
        <Cine text="A MORNING" at={2130} until={2290} mode="flip" size={130} gold weight={700} />
        <Cine text="RAGA" at={2148} until={2290} mode="flip" size={130} gold weight={700} />
      </CaptionBlock>
      <CaptionBlock top={330}>
        <Cine text="AS NIGHT GIVES WAY" at={2300} until={2468} mode="track" size={54} tracking={0.16} />
        <Cine text="to first light" at={2325} until={2468} mode="rise" size={110} font={SERIF} weight={500} italic gold tracking={0} />
      </CaptionBlock>
    </AbsoluteFill>
  );
};

// ─── 6 · Ring tunnel into the performance ────────────────────────────────────

const Tunnel: React.FC = () => {
  const { frame, active, local } = useWindow(SCENES.tunnel);
  if (!active) return null;
  const energy = rmsAt(frame);
  const z = 6 - (local * 0.25 + Math.pow(Math.max(0, local - 200), 2) * 0.006);
  return (
    <AbsoluteFill>
      <Scene3D background="#05020B" fog={["#05020B", 8, 70]} bloom={1.1}>
        <CameraRig position={[0, 0, z]} target={[0, 0, z - 10]} roll={local * 0.004} />
        <Lights energy={energy} />
        <pointLight position={[0, 0, z - 6]} intensity={18} color="#FFB060" distance={30} />
        <RingTunnel frame={frame} count={46} spacing={5} />
        <WarpLines seed="warp" count={260} cameraZ={z} stretch={1 + Math.max(0, local - 200) * 0.14} opacity={tween(local, [150, 280], [0.15, 1])} />
        <Sun position={[0, 0, z - 70]} radius={2.6} energy={energy} />
      </Scene3D>
      <CineVignette strength={0.55} />
      <CaptionShade y={880} h={900} strength={0.6} />
      <CaptionBlock top={560}>
        <Cine text="THE BANDISH" at={2495} until={2775} mode="track" size={36} tracking={0.5} color={GOLD} />
        <Cine text="ALABELA" at={2505} until={2775} mode="flip" size={170} gold weight={700} />
        <Cine text="SAJAN" at={2525} until={2775} mode="flip" size={170} gold weight={700} />
        <Cine text="AAYO RE" at={2545} until={2775} mode="flip" size={170} gold weight={700} />
      </CaptionBlock>
      <CaptionBlock top={1330}>
        <Cine text="अलबेला सजन आयो रे" at={2600} until={2775} mode="blur" size={84} font={DEVA} weight={400} color={SAFFRON} />
      </CaptionBlock>
    </AbsoluteFill>
  );
};

export const Intro: React.FC = () => (
  <>
    <Cosmos />
    <Lotus />
    <Terrain />
    <Helix />
    <Dawn />
    <Tunnel />
  </>
);
