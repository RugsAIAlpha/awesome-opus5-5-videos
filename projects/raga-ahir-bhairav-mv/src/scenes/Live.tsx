import { Video } from "@remotion/media";
import React from "react";
import { AbsoluteFill, random, Sequence, staticFile, useCurrentFrame } from "remotion";
import { bandsAt, kickAt, peaksBetween, rmsAt } from "../audio";
import { AnamorphicFlare, CaptionBlock, Cine, CineVignette, LightLeaks, SWARAS } from "../cine";
import { CameraRig, Glow, Scene3D, StarField } from "../three/core";
import { GoldRing } from "../three/objects";
import { CAPS, CREAM, DEVA, GOLD, SAFFRON, SERIF, tween } from "../theme";
import { H, SCENES, W } from "../timeline";

const [START, END] = SCENES.live;
const VIDEO_END = END + 15; // runs a little under the outro flash

// Caption entries also trigger RGB-split glitch hits
type Caption = { at: number; until: number; render: () => React.ReactNode };

const CAPTIONS: Caption[] = [
  {
    at: 2850,
    until: 3080,
    render: () => (
      <CaptionBlock top={1400}>
        <Cine text="LIVE" at={2850} until={3080} mode="track" size={36} tracking={0.8} color={GOLD} />
        <Cine text="AHIR BHAIRAV" at={2862} until={3080} mode="flip" size={100} gold weight={700} />
      </CaptionBlock>
    ),
  },
  ...[
    { at: 3200, dev: "अलबेला", en: "ALABELA · THE CAREFREE ONE" },
    { at: 3560, dev: "सजन", en: "SAJAN · THE BELOVED" },
    { at: 3920, dev: "आयो रे", en: "AAYO RE · HAS ARRIVED" },
  ].map(({ at, dev, en }) => ({
    at,
    until: at + 220,
    render: () => (
      <CaptionBlock top={1330}>
        <Cine text={dev} at={at} until={at + 220} mode="blur" size={170} font={DEVA} weight={400} gold />
        <Cine text={en} at={at + 20} until={at + 220} mode="track" size={34} tracking={0.32} style={{ marginTop: 6 }} />
      </CaptionBlock>
    ),
  })),
  {
    at: 4300,
    until: 4560,
    render: () => (
      <CaptionBlock top={1380}>
        <Cine text="अलबेला सजन आयो रे" at={4300} until={4560} mode="blur" size={96} font={DEVA} weight={400} gold />
        <Cine text="the charming beloved has arrived" at={4330} until={4560} mode="rise" size={58} font={SERIF} weight={500} italic tracking={0} />
      </CaptionBlock>
    ),
  },
  {
    at: 4700,
    until: 4920,
    render: () => (
      <CaptionBlock top={1360}>
        <Cine text="A RAGA OF" at={4700} until={4920} mode="flip" size={100} gold weight={700} />
        <Cine text="FIRST LIGHT" at={4716} until={4920} mode="flip" size={120} gold weight={700} />
      </CaptionBlock>
    ),
  },
  { at: 5050, until: 5330, render: () => <SwaraStrip at={5050} until={5330} /> },
  {
    at: 5450,
    until: 5670,
    render: () => (
      <CaptionBlock top={1380}>
        <Cine text="A MORNING" at={5450} until={5670} mode="flip" size={110} gold weight={700} />
        <Cine text="PRAYER IN SOUND" at={5466} until={5670} mode="flip" size={84} gold weight={700} />
      </CaptionBlock>
    ),
  },
  {
    at: 5800,
    until: 6060,
    render: () => (
      <CaptionBlock top={1400}>
        <Cine text="अलबेला सजन आयो रे" at={5800} until={6060} mode="blur" size={96} font={DEVA} weight={400} gold />
        <Cine text="THE BELOVED HAS ARRIVED" at={5825} until={6060} mode="track" size={36} tracking={0.3} />
      </CaptionBlock>
    ),
  },
  {
    at: 6150,
    until: 6370,
    render: () => (
      <CaptionBlock top={1400}>
        <Cine text="RAGA" at={6150} until={6370} mode="track" size={36} tracking={0.8} color={GOLD} />
        <Cine text="AHIR BHAIRAV" at={6162} until={6370} mode="flip" size={100} gold weight={700} />
      </CaptionBlock>
    ),
  },
];

const GLITCHES = CAPTIONS.map((c) => c.at);
const FLARES = peaksBetween(START + 40, END - 40, 0.7, 150);

// 0–1 strength of an RGB-split hit around each glitch frame
const glitchAt = (frame: number) =>
  GLITCHES.reduce((g, at) => {
    const d = frame - at;
    return d >= -4 && d <= 8 ? Math.max(g, 1 - Math.abs(d - 1) / 8) : g;
  }, 0);

const videoStyle: React.CSSProperties = { width: W, height: H, objectFit: "cover" };

const Footage: React.FC = () => {
  const frame = useCurrentFrame() + START;
  const k = kickAt(frame);
  const level = rmsAt(frame);
  const g = glitchAt(frame);
  const zoom = 1.05 + 0.04 * k + tween(frame, [START, END], [0, 0.06]);
  const shakeX = (Math.sin(frame * 1.7) * Math.sin(frame * 0.31) * 7 + (g > 0 ? (random(`gx${frame}`) - 0.5) * 40 * g : 0)) * (0.3 + k);
  const shakeY = Math.cos(frame * 1.3) * Math.sin(frame * 0.23) * 7 * (0.3 + k);
  const dx = 6 + g * 26;
  return (
    <AbsoluteFill style={{ scale: `${zoom}`, translate: `${shakeX}px ${shakeY}px`, filter: `contrast(1.14) saturate(${1.18 + level * 0.1}) brightness(0.96)` }}>
      <Video src={staticFile("source.mp4")} trimBefore={START} muted style={videoStyle} />
      {g > 0 ? (
        // Exact RGB split: red channel and cyan (green + blue) channels, offset and recombined
        <AbsoluteFill style={{ isolation: "isolate", background: "#000" }}>
          <AbsoluteFill style={{ translate: `${dx}px 0px` }}>
            <Video src={staticFile("source.mp4")} trimBefore={START} muted style={{ ...videoStyle, filter: "url(#only-red)" }} />
          </AbsoluteFill>
          <AbsoluteFill style={{ translate: `${-dx}px ${g * 6}px`, mixBlendMode: "screen" }}>
            <Video src={staticFile("source.mp4")} trimBefore={START} muted style={{ ...videoStyle, filter: "url(#only-cyan)" }} />
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

const ChannelFilters: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id="only-red" colorInterpolationFilters="sRGB">
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
    </filter>
    <filter id="only-cyan" colorInterpolationFilters="sRGB">
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
    </filter>
  </svg>
);

// 3D layer over the footage: orbiting gold rings at stage level, depth dust and bokeh
const Overlay3D: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame - START;
  const energy = rmsAt(frame);
  const k = kickAt(frame);
  return (
    <Scene3D transparent bloom={0}>
      <CameraRig position={[Math.sin(local / 300) * 0.6, 0, 10]} target={[0, 0, 0]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 8, 6]} intensity={2.5} color="#FFE2B0" />
      <pointLight position={[0, -6, 2]} intensity={40 + energy * 60} color="#FF9A40" distance={30} />
      <group position={[0, -5.2, -3]} rotation={[1.38, 0, Math.sin(local / 200) * 0.05]}>
        {[4.2, 4.9, 5.7].map((r, i) => (
          <group key={r} rotation={[0, 0, local * 0.004 * (i % 2 ? -1 : 1)]}>
            <GoldRing radius={r * (1 + k * 0.03)} tube={0.03 + i * 0.012} energy={energy * 1.5} />
          </group>
        ))}
      </group>
      <group rotation={[0, local * 0.0015, 0]} position={[0, (local * 0.004) % 4, 0]}>
        <StarField seed="live-dust" count={520} box={[18, 34, 18]} center={[0, -2, -2]} size={0.09} color="#FFD9A0" opacity={0.55 + energy * 0.4} />
      </group>
      {Array.from({ length: 12 }).map((_, i) => {
        const r = (s: string) => random(`bokeh-${i}-${s}`);
        const y = ((r("y") * 24 + local * (0.004 + r("v") * 0.01)) % 24) - 12;
        return (
          <Glow
            key={i}
            position={[(r("x") - 0.5) * 14, y, -4 - r("z") * 10]}
            scale={1.4 + r("s") * 2.6}
            color={r("c") > 0.5 ? "#FFB45E" : "#FF6A8A"}
            opacity={0.14 + energy * 0.12}
          />
        );
      })}
    </Scene3D>
  );
};

const SwaraStrip: React.FC<{ at: number; until: number }> = ({ at, until }) => {
  const frame = useCurrentFrame();
  if (frame < at - 1 || frame > until + 1) return null;
  const b = bandsAt(frame);
  const out = tween(frame, [until - 16, until], [1, 0]);
  return (
    <CaptionBlock top={1400}>
      <Cine text="THE SWARAS" at={at} until={until} mode="track" size={34} tracking={0.6} color={GOLD} />
      <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 26, perspective: 900, opacity: out }}>
        {SWARAS.map((note, i) => {
          const p = tween(frame, [at + 14 + i * 5, at + 38 + i * 5], [0, 1]);
          const glow = Math.min(1, Math.pow((b[i * 2] + b[i * 2 + 1]) / 2, 2));
          return (
            <div key={i} style={{ textAlign: "center", opacity: p, transform: `rotateY(${(1 - p) * 90}deg) translateZ(${glow * 40}px)` }}>
              <div
                style={{
                  fontFamily: DEVA,
                  fontSize: 76,
                  lineHeight: 1.1,
                  color: note.komal ? SAFFRON : CREAM,
                  filter: `drop-shadow(0 0 ${10 + glow * 30}px rgba(255,180,90,${0.4 + glow * 0.6})) drop-shadow(0 3px 8px rgba(0,0,0,0.7))`,
                  scale: `${1 + glow * 0.2}`,
                }}
              >
                {note.dev}
              </div>
              <div style={{ fontFamily: CAPS, fontSize: 20, letterSpacing: "0.2em", color: GOLD, marginTop: 8 }}>{note.lat}</div>
            </div>
          );
        })}
      </div>
    </CaptionBlock>
  );
};

// God rays falling from the upper right
const GodRays: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: W * 0.85 - 1400,
        top: -260 - 1400,
        width: 2800,
        height: 2800,
        mixBlendMode: "screen",
        opacity: opacity * (0.55 + rmsAt(frame) * 0.45),
        rotate: `${Math.sin(frame / 160) * 4}deg`,
        background:
          "repeating-conic-gradient(from 180deg, rgba(255,200,130,0) 0deg, rgba(255,200,130,0.16) 2.5deg, rgba(255,200,130,0) 6deg)",
        maskImage: "radial-gradient(circle, black 0%, rgba(0,0,0,0.4) 35%, transparent 62%)",
        WebkitMaskImage: "radial-gradient(circle, black 0%, rgba(0,0,0,0.4) 35%, transparent 62%)",
      }}
    />
  );
};

export const Live: React.FC = () => {
  const frame = useCurrentFrame();
  const inRange = frame >= START - 20 && frame < VIDEO_END;
  if (!inRange) return null;
  return (
    <AbsoluteFill>
      <ChannelFilters />
      <Sequence from={START} durationInFrames={VIDEO_END - START} name="Live performance">
        <Footage />
      </Sequence>
      {/* Orange-and-teal grade */}
      <AbsoluteFill
        style={{
          mixBlendMode: "soft-light",
          opacity: 0.7,
          background: "linear-gradient(200deg, rgba(255,150,60,0.85) 0%, rgba(255,120,70,0.25) 45%, rgba(0,130,150,0.7) 100%)",
        }}
      />
      <GodRays opacity={0.6} />
      <LightLeaks opacity={0.55} seed="live" />
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(5,3,12,0.88) 0%, rgba(5,3,12,0.45) 22%, rgba(5,3,12,0) 40%)" }} />
      {frame >= START ? <Overlay3D frame={frame} /> : null}
      {FLARES.map((at) => (
        <AnamorphicFlare key={at} at={at - 12} y={360 + (at % 5) * 40} />
      ))}
      <CineVignette strength={0.6} />
      {CAPTIONS.map((c) => (frame >= c.at - 1 && frame <= c.until + 1 ? <React.Fragment key={c.at}>{c.render()}</React.Fragment> : null))}
    </AbsoluteFill>
  );
};
