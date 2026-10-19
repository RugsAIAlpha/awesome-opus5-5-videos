import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { bandsAt, rmsAt } from "./audio";
import { GOLD, tween } from "./theme";
import { H, W } from "./timeline";

// Shared exit fade for timed elements
const fadeOut = (frame: number, until: number) =>
  interpolate(frame, [until - 18, until], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

// ─── Atmosphere ──────────────────────────────────────────────────────────────

export const Vignette: React.FC<{ strength: number }> = ({ strength }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 80% 62% at 50% 44%, rgba(0,0,0,0) 52%, rgba(8,5,14,${strength}) 100%)`,
    }}
  />
);

// Warm floating motes; brightness follows the music
export const Dust: React.FC<{
  count: number;
  seed: string;
  opacity: number;
}> = ({ count, seed, opacity }) => {
  const frame = useCurrentFrame();
  const level = rmsAt(frame);
  const span = H + 200;
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "screen" }}>
      {Array.from({ length: count }).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const size = 6 + r("s") * 14;
        const speed = 0.3 + r("v") * 1.1;
        const x =
          r("x") * W +
          Math.sin(frame * 0.012 * (0.5 + r("w")) + r("p") * 6.28) * 46;
        const y =
          ((((r("y") * span - frame * speed) % span) + span) % span) - 100;
        const twinkle =
          0.5 + 0.5 * Math.sin(frame * (0.04 + r("t") * 0.06) + r("p") * 10);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,230,170,1) 0%, rgba(255,190,90,0.45) 35%, rgba(255,170,60,0) 70%)",
              opacity: twinkle * (0.3 + 0.7 * level),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Four-point sparkles scattered over a region
export const Twinkles: React.FC<{
  count: number;
  seed: string;
  region: { x0: number; x1: number; y0: number; y1: number };
}> = ({ count, seed, region }) => {
  const frame = useCurrentFrame();
  return (
    <svg
      width={W}
      height={H}
      style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const x = region.x0 + r("x") * (region.x1 - region.x0);
        const y = region.y0 + r("y") * (region.y1 - region.y0);
        const s = 6 + r("s") * 16;
        const pulse = Math.pow(
          Math.max(0, Math.sin(frame * (0.03 + r("f") * 0.05) + r("p") * 20)),
          3,
        );
        return (
          <path
            key={i}
            d="M0,-1 L0.14,-0.14 L1,0 L0.14,0.14 L0,1 L-0.14,0.14 L-1,0 L-0.14,-0.14 Z"
            fill="#FFF3D6"
            transform={`translate(${x} ${y}) scale(${s * (0.4 + 0.6 * pulse)}) rotate(${frame * 0.4 * (r("d") - 0.5)})`}
            opacity={0.15 + 0.85 * pulse}
          />
        );
      })}
    </svg>
  );
};

// Rose petals drifting down
export const Petals: React.FC<{
  count: number;
  seed: string;
  opacity: number;
}> = ({ count, seed, opacity }) => {
  const frame = useCurrentFrame();
  const span = H + 160;
  return (
    <AbsoluteFill style={{ opacity }}>
      {Array.from({ length: count }).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const speed = 1.1 + r("v") * 1.6;
        const y = ((r("y") * span + frame * speed) % span) - 80;
        const x =
          r("x") * W +
          Math.sin(frame * 0.02 + r("p") * 6.28) * (40 + r("a") * 60);
        const size = 20 + r("s") * 20;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size * 0.62,
              borderRadius: "60% 40% 60% 40% / 70% 50% 50% 30%",
              background:
                "linear-gradient(135deg, #F2788A 0%, #C7304F 60%, #8E1834 100%)",
              rotate: `${frame * (r("r") - 0.5) * 3 + r("o") * 360}deg`,
              scale: `1 ${Math.cos(frame * (0.04 + r("f") * 0.05) + r("p") * 9)}`,
              opacity: 0.85,
              boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Ornaments ───────────────────────────────────────────────────────────────

// Lotus mandala whose strokes draw on with `progress`
export const Mandala: React.FC<{
  size: number;
  progress: number;
  rotate: number;
  opacity?: number;
  color?: string;
}> = ({ size, progress, rotate, opacity = 1, color = GOLD }) => {
  const draw = {
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1 - progress,
  };
  const petals = (n: number, r1: number, r2: number, w: number) =>
    Array.from({ length: n }).map((_, i) => (
      <path
        key={`${n}-${i}`}
        d={`M0,${-r1} Q${w},${-(r1 + r2) / 2} 0,${-r2} Q${-w},${-(r1 + r2) / 2} 0,${-r1}`}
        transform={`rotate(${(i * 360) / n})`}
        {...draw}
      />
    ));
  return (
    <svg
      width={size}
      height={size}
      viewBox="-100 -100 200 200"
      style={{ opacity, rotate: `${rotate}deg`, overflow: "visible" }}
    >
      <g fill="none" stroke={color} strokeWidth={0.7} strokeLinecap="round">
        <circle r={96} {...draw} />
        <circle r={91} strokeDasharray="0.5 3.2" opacity={progress} />
        {petals(24, 62, 89, 6)}
        {petals(12, 34, 62, 11)}
        {petals(8, 13, 34, 9)}
        <circle r={13} {...draw} />
        <circle r={3} fill={color} opacity={progress} />
      </g>
    </svg>
  );
};

// Four tanpura strings that vibrate with the spectrum
export const TanpuraStrings: React.FC<{ y: number; opacity: number }> = ({
  y,
  opacity,
}) => {
  const frame = useCurrentFrame();
  if (opacity <= 0) return null;
  const b = bandsAt(frame);
  const level = rmsAt(frame);
  const L = 840;
  const x0 = (W - L) / 2;
  const omegas = [1.7, 2.3, 2.9, 1.3];
  return (
    <svg
      width={W}
      height={160}
      viewBox={`0 0 ${W} 160`}
      style={{ position: "absolute", left: 0, top: y - 80, opacity }}
    >
      <defs>
        <linearGradient
          id="string"
          gradientUnits="userSpaceOnUse"
          x1={x0}
          x2={x0 + L}
          y1={0}
          y2={0}
        >
          <stop offset="0" stopColor={GOLD} stopOpacity={0} />
          <stop offset="0.12" stopColor={GOLD} />
          <stop offset="0.88" stopColor={GOLD} />
          <stop offset="1" stopColor={GOLD} stopOpacity={0} />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => {
        const energy =
          (b[i * 4] + b[i * 4 + 1] + b[i * 4 + 2] + b[i * 4 + 3]) / 4;
        const A = Math.pow(energy, 1.6) * 24 * (0.4 + 0.6 * level);
        const base = 50 + i * 20;
        const pts: string[] = [];
        for (let s = 0; s <= 64; s++) {
          const u = s / 64;
          const d =
            A * Math.sin(Math.PI * u) * Math.sin(frame * omegas[i] + i) +
            A *
              0.35 *
              Math.sin(2 * Math.PI * u) *
              Math.sin(frame * omegas[i] * 1.9 + i * 2);
          pts.push(`${(x0 + u * L).toFixed(1)},${(base + d).toFixed(1)}`);
        }
        const d = `M${pts.join(" L")}`;
        return (
          <g key={i} fill="none" stroke="url(#string)">
            <path d={d} strokeWidth={8} opacity={0.16} />
            <path d={d} strokeWidth={i === 3 ? 2.6 : 1.7} />
          </g>
        );
      })}
    </svg>
  );
};

// A hairline that draws outward from its centre
export const Rule: React.FC<{
  at: number;
  until: number;
  width: number;
  align?: "center" | "left";
}> = ({ at, until, width, align = "center" }) => {
  const frame = useCurrentFrame();
  if (frame < at - 1 || frame > until + 1) return null;
  return (
    <div
      style={{
        width,
        opacity: fadeOut(frame, until),
        height: 2,
        margin: align === "center" ? "22px auto" : "18px 0",
        background: `linear-gradient(90deg, rgba(235,203,134,0), ${GOLD} 20%, ${GOLD} 80%, rgba(235,203,134,0))`,
        scale: `${tween(frame, [at, at + 30], [0, 1])} 1`,
        transformOrigin: align === "center" ? "50% 50%" : "0% 50%",
      }}
    />
  );
};

// ─── Text reveals ────────────────────────────────────────────────────────────

// Rise-and-fade for any block
export const Reveal: React.FC<{
  at: number;
  until: number;
  dy?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, until, dy = 36, style, children }) => {
  const frame = useCurrentFrame();
  if (frame < at - 1 || frame > until + 1) return null;
  const p = tween(frame, [at, at + 26], [0, 1]);
  return (
    <div
      style={{
        opacity: p * fadeOut(frame, until),
        translate: `0px ${(1 - p) * dy}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Letter-by-letter rise for Latin text
export const Letters: React.FC<{
  text: string;
  at: number;
  until: number;
  stagger?: number;
  style?: React.CSSProperties;
}> = ({ text, at, until, stagger = 2, style }) => {
  const frame = useCurrentFrame();
  if (frame < at - 1 || frame > until + 1) return null;
  return (
    <div style={{ ...style, opacity: fadeOut(frame, until) }}>
      {text.split("").map((ch, i) => {
        const p = tween(
          frame,
          [at + i * stagger, at + i * stagger + 22],
          [0, 1],
        );
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              translate: `0px ${(1 - p) * 44}px`,
            }}
          >
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </div>
  );
};

// Left-to-right wipe; keeps Devanagari conjuncts and matras intact
export const Wipe: React.FC<{
  at: number;
  until: number;
  dur?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, until, dur = 40, style, children }) => {
  const frame = useCurrentFrame();
  if (frame < at - 1 || frame > until + 1) return null;
  const p = tween(frame, [at, at + dur], [0, 100], Easing.inOut(Easing.cubic));
  return (
    <div
      style={{
        ...style,
        opacity: fadeOut(frame, until),
        clipPath: `inset(-60px ${100 - p}% -60px -60px)`,
      }}
    >
      {children}
    </div>
  );
};
