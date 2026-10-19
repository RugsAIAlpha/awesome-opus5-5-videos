import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { rmsAt } from "../audio";
import { Dust, Petals, Twinkles, Vignette } from "../fx";
import { tween } from "../theme";
import { MOON, SUN, T, TOTAL, W, H } from "../timeline";

// Glints on the water below the sun
const Shimmer: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen" }}>
      {Array.from({ length: 34 }).map((_, i) => {
        const r = (k: string) => random(`glint-${i}-${k}`);
        const y = SUN.y + 24 + Math.pow(r("y"), 1.4) * 240;
        const spread = 60 + (y - SUN.y) * 1.3;
        const x = SUN.x + (r("x") - 0.5) * 2 * spread;
        const w = 24 + r("w") * 60;
        const on = Math.pow(
          Math.max(0, Math.sin(frame * (0.08 + r("f") * 0.12) + r("p") * 30)),
          4,
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - w / 2,
              top: y,
              width: w,
              height: 4,
              borderRadius: 2,
              background: "rgba(255,236,190,0.95)",
              opacity: on,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// The painted title card, brought to life: rotating sun rays, twinkling sky,
// shimmering sea, glowing moon and falling petals.
export const TitleCardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const intro = frame >= T.portraitEnd && frame < T.dissolveInEnd;
  const outro = frame >= T.dissolveOutStart;
  if (!intro && !outro) return null;

  // The card lands at exactly scale 1 where the source's own dissolve runs, so
  // it lines up with the card baked into the footage during the hand-off.
  const scale = intro
    ? tween(
        frame,
        [T.portraitEnd, T.dissolveInStart],
        [1.12, 1],
        Easing.out(Easing.cubic),
      )
    : tween(
        frame,
        [T.dissolveOutEnd, TOTAL],
        [1, 1.1],
        Easing.inOut(Easing.sin),
      );
  const opacity = intro
    ? tween(
        frame,
        [T.dissolveInStart, T.dissolveInEnd],
        [1, 0],
        Easing.inOut(Easing.sin),
      )
    : tween(
        frame,
        [T.dissolveOutStart, T.dissolveOutEnd],
        [0, 1],
        Easing.inOut(Easing.sin),
      );
  const level = rmsAt(frame);

  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ scale, transformOrigin: "50% 45%" }}>
        <Img
          src={staticFile("titlecard.jpg")}
          style={{ width: W, height: H, objectFit: "cover" }}
        />

        {/* Sun rays, clipped to the sky */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: W,
            height: SUN.y + 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: SUN.x - 800,
              top: SUN.y - 800,
              width: 1600,
              height: 1600,
              mixBlendMode: "screen",
              rotate: `${frame * 0.05}deg`,
              background:
                "repeating-conic-gradient(from 0deg, rgba(255,196,120,0) 0deg, rgba(255,196,120,0.24) 3deg, rgba(255,196,120,0) 8deg)",
              maskImage: "radial-gradient(circle, black 6%, transparent 52%)",
              WebkitMaskImage:
                "radial-gradient(circle, black 6%, transparent 52%)",
            }}
          />
        </div>
        <AbsoluteFill
          style={{
            mixBlendMode: "screen",
            background: `radial-gradient(circle at ${SUN.x}px ${SUN.y}px, rgba(255,214,140,${0.45 + 0.4 * level}) 0%, rgba(255,150,70,${0.15 + 0.2 * level}) 14%, rgba(255,120,60,0) 34%)`,
          }}
        />
        <AbsoluteFill
          style={{
            mixBlendMode: "screen",
            background: `radial-gradient(circle at ${MOON.x}px ${MOON.y}px, rgba(255,246,214,${0.28 + 0.12 * Math.sin(frame / 25)}) 0%, rgba(255,246,214,0) 10%)`,
          }}
        />
        <Twinkles
          count={46}
          seed="sky"
          region={{ x0: 20, x1: W - 20, y0: 30, y1: 780 }}
        />
        <Shimmer />
      </AbsoluteFill>
      <Petals count={16} seed={intro ? "petal-a" : "petal-b"} opacity={0.9} />
      <Dust count={18} seed="card" opacity={0.8} />
      <Vignette strength={0.45} />
    </AbsoluteFill>
  );
};

// Golden bloom that hides the source's hard cut from portrait to title card
export const SunFlash: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 2440 || frame > 2530) return null;
  const o =
    frame <= T.portraitEnd
      ? tween(frame, [2440, T.portraitEnd], [0, 1], Easing.in(Easing.quad))
      : tween(frame, [T.portraitEnd, 2530], [1, 0], Easing.out(Easing.quad));
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        background:
          "radial-gradient(circle at 50% 46%, #FFF7E4 0%, #FFD38F 32%, #E98D42 72%, #6B2C2A 100%)",
      }}
    />
  );
};

// Sun-glow swell over the card → live hand-off
export const HandoffGlow: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 2760 || frame > 2860) return null;
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "screen",
        opacity:
          tween(frame, [2760, 2800], [0, 1]) *
          tween(frame, [2805, 2860], [1, 0]),
        background: `radial-gradient(circle at ${SUN.x}px ${SUN.y}px, rgba(255,226,170,0.9) 0%, rgba(255,170,90,0.45) 30%, rgba(255,140,70,0) 70%)`,
      }}
    />
  );
};
