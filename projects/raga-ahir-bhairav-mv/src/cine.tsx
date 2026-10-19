import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { rmsAt } from "./audio";
import { CAPS, CREAM, EASE_OUT, tween } from "./theme";
import { H, LETTERBOX, W } from "./timeline";

// ─── Cinematic captions ──────────────────────────────────────────────────────

const METAL_FILL =
  "linear-gradient(180deg, #FFF6DA 0%, #F6D58C 34%, #C98E35 52%, #F9DD97 70%, #FFF1C8 100%)";
const EXTRUDE =
  "drop-shadow(0 2px 0 #8A5E1E) drop-shadow(0 2px 0 #6B4514) drop-shadow(0 10px 22px rgba(0,0,0,0.65)) drop-shadow(0 0 28px rgba(255,176,84,0.35))";
const SOFT = "drop-shadow(0 4px 18px rgba(0,0,0,0.7)) drop-shadow(0 0 22px rgba(255,190,110,0.25))";

const metal = (sweep: number): React.CSSProperties => ({
  backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0) 42%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 58%), ${METAL_FILL}`,
  backgroundSize: "300% 100%, 100% 100%",
  backgroundPosition: `${sweep}% 0%, 0% 0%`,
  backgroundRepeat: "no-repeat",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
});

export type CineMode = "flip" | "track" | "rise" | "blur";

/**
 * One line of cinematic type.
 * flip  – letters swing up in 3D, one after another, and fly past the camera on exit
 * track – the whole line condenses from wide letter-spacing out of a blur
 * rise  – the line slides up out of a mask
 * blur  – focus-pull from a large blur (safe for Devanagari, which must not be split)
 */
export const Cine: React.FC<{
  text: string;
  at: number;
  until: number;
  mode?: CineMode;
  size: number;
  font?: string;
  weight?: number;
  gold?: boolean;
  color?: string;
  tracking?: number;
  stagger?: number;
  italic?: boolean;
  style?: React.CSSProperties;
}> = ({
  text,
  at,
  until,
  mode = "track",
  size,
  font = CAPS,
  weight = 600,
  gold = false,
  color = CREAM,
  tracking = 0.08,
  stagger = 2,
  italic = false,
  style,
}) => {
  const frame = useCurrentFrame();
  if (frame < at - 1 || frame > until + 1) return null;
  const sweep = tween(frame, [at + 14, at + 70], [160, -60], Easing.inOut(Easing.quad));
  const base: React.CSSProperties = {
    fontFamily: font,
    fontWeight: weight,
    fontSize: size,
    fontStyle: italic ? "italic" : "normal",
    lineHeight: 1.08,
    whiteSpace: "pre",
    ...(gold ? metal(sweep) : { color }),
  };
  const shadow = gold ? EXTRUDE : SOFT;
  const outP = tween(frame, [until - 16, until], [0, 1], Easing.in(Easing.cubic));

  if (mode === "flip") {
    const chars = text.split("");
    return (
      <div style={{ perspective: 900, textAlign: "center", ...style }}>
        <div style={{ display: "inline-block", filter: shadow, letterSpacing: `${tracking}em` }}>
          {chars.map((ch, i) => {
            const p = tween(frame, [at + i * stagger, at + i * stagger + 22], [0, 1], Easing.out(Easing.back(1.6)));
            const o = tween(frame, [until - 18 + i, until - 6 + i], [0, 1], Easing.in(Easing.cubic));
            return (
              <span
                key={i}
                style={{
                  ...base,
                  display: "inline-block",
                  transformOrigin: "50% 100%",
                  opacity: clamp(p * 1.5) * (1 - o),
                  transform: `translateY(${(1 - p) * 40}px) rotateX(${(1 - p) * -95}deg) translateZ(${o * 260}px)`,
                  filter: o > 0 ? `blur(${o * 10}px)` : undefined,
                }}
              >
                {ch === " " ? " " : ch}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  const inP = tween(frame, [at, at + 34], [0, 1]);
  if (mode === "rise") {
    return (
      <div style={{ textAlign: "center", overflow: "hidden", padding: "10px 40px 30px", ...style }}>
        <div
          style={{
            ...base,
            display: "inline-block",
            filter: shadow,
            letterSpacing: `${tracking}em`,
            translate: `0px ${(1 - inP) * 110}% `,
            opacity: 1 - outP,
          }}
        >
          {text}
        </div>
      </div>
    );
  }
  const blur = mode === "blur" ? (1 - inP) * 26 + outP * 16 : (1 - inP) * 16 + outP * 12;
  return (
    <div style={{ textAlign: "center", ...style }}>
      <div
        style={{
          ...base,
          display: "inline-block",
          letterSpacing: mode === "track" ? `${tracking + (1 - inP) * 0.55 + outP * 0.2}em` : undefined,
          scale: mode === "blur" ? `${1.22 - inP * 0.22 + outP * 0.08}` : `${1 + outP * 0.06}`,
          opacity: inP * (1 - outP),
          filter: `blur(${blur.toFixed(2)}px) ${shadow}`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const clamp = (v: number) => Math.max(0, Math.min(1, v));

// Dark pool behind captions over bright 3D scenes
export const CaptionShade: React.FC<{ y: number; h?: number; strength?: number }> = ({ y, h = 620, strength = 0.75 }) => (
  <div
    style={{
      position: "absolute",
      left: -200,
      width: W + 400,
      top: y - h / 2,
      height: h,
      background: `radial-gradient(ellipse closest-side, rgba(4,2,10,${strength}) 0%, rgba(4,2,10,${strength * 0.6}) 50%, rgba(4,2,10,0) 100%)`,
    }}
  />
);

// Absolutely positioned caption stack
export const CaptionBlock: React.FC<{ top: number; children: React.ReactNode }> = ({ top, children }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top }}>{children}</div>
);

// ─── VFX layers ──────────────────────────────────────────────────────────────

// White-gold burst with an anamorphic streak, peaking exactly on a cut
export const Flash: React.FC<{ at: number; half?: number; strength?: number }> = ({ at, half = 14, strength = 1 }) => {
  const frame = useCurrentFrame();
  if (frame < at - half || frame > at + half * 2) return null;
  const o =
    frame <= at
      ? tween(frame, [at - half, at], [0, 1], Easing.in(Easing.quad))
      : tween(frame, [at, at + half * 2], [1, 0], Easing.out(Easing.quad));
  return (
    <AbsoluteFill style={{ opacity: o * strength }}>
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 50% 50%, #FFFFFF 0%, #FFE9BE 30%, #F6A24E 70%, rgba(120,40,40,0.9) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: H / 2 - 6,
          width: W,
          height: 12,
          background: "linear-gradient(90deg, rgba(120,190,255,0), #DDF0FF 50%, rgba(120,190,255,0))",
          scale: `${0.4 + o * 1.4} ${1 + o * 3}`,
        }}
      />
    </AbsoluteFill>
  );
};

// Animated film grain
export const Grain: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity, mixBlendMode: "overlay" }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 12} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
};

// Cinema bars; children render inside the top and bottom bars
export const Letterbox: React.FC<{ top?: React.ReactNode; bottom?: React.ReactNode; amount: number }> = ({
  top,
  bottom,
  amount,
}) => {
  const h = LETTERBOX * amount;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: h, background: "#000", overflow: "hidden" }}>
        {top}
      </div>
      <div style={{ position: "absolute", left: 0, bottom: 0, width: W, height: h, background: "#000", overflow: "hidden" }}>
        {bottom}
      </div>
    </>
  );
};

// Drifting warm light leaks, swelling with the music
export const LightLeaks: React.FC<{ opacity: number; seed: string }> = ({ opacity, seed }) => {
  const frame = useCurrentFrame();
  const level = rmsAt(frame);
  const blobs = [
    { c: "255,140,60", s: 0.9 },
    { c: "255,70,110", s: 0.7 },
    { c: "255,200,120", s: 1.1 },
  ];
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "screen" }}>
      {blobs.map((b, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const x = 50 + 55 * Math.sin(frame / (140 + r("a") * 120) + r("p") * 6);
        const y = 50 + 50 * Math.cos(frame / (170 + r("b") * 140) + r("q") * 6);
        return (
          <AbsoluteFill
            key={i}
            style={{
              background: `radial-gradient(ellipse ${45 * b.s}% ${30 * b.s}% at ${x}% ${y}%, rgba(${b.c},${0.35 + level * 0.35}) 0%, rgba(${b.c},0) 100%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Horizontal lens-flare streak sweeping across the frame
export const AnamorphicFlare: React.FC<{ at: number; y: number; dur?: number; tint?: string }> = ({
  at,
  y,
  dur = 36,
  tint = "150,200,255",
}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > at + dur) return null;
  const t = (frame - at) / dur;
  const o = Math.sin(Math.PI * t);
  const x = interpolate(t, [0, 1], [W * 0.15, W * 0.85], { easing: EASE_OUT });
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", opacity: o }}>
      <div
        style={{
          position: "absolute",
          left: -W * 0.5,
          top: y - 4,
          width: W * 2,
          height: 8,
          background: `linear-gradient(90deg, rgba(${tint},0) 0%, rgba(${tint},0.9) ${((x + W * 0.5) / (W * 2)) * 100}%, rgba(${tint},0) 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 160,
          top: y - 160,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,214,150,0.5) 18%, rgba(255,160,80,0) 60%)",
        }}
      />
      {[0.35, 0.6, 0.8].map((k, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: W - x * k - 40 - i * 20,
            top: y + (H / 2 - y) * k * 0.6 - 40,
            width: 80 + i * 40,
            height: 80 + i * 40,
            borderRadius: "50%",
            border: `2px solid rgba(${tint},0.35)`,
            background: `radial-gradient(circle, rgba(${tint},0.12), rgba(${tint},0))`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// Edge darkening
export const CineVignette: React.FC<{ strength: number }> = ({ strength }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 78% 60% at 50% 48%, rgba(0,0,0,0) 50%, rgba(4,2,10,${strength}) 100%)`,
    }}
  />
);

// ─── Swaras ──────────────────────────────────────────────────────────────────

export const SWARAS = [
  { dev: "सा", lat: "SA" },
  { dev: "रे", lat: "RE", komal: true },
  { dev: "ग", lat: "GA" },
  { dev: "म", lat: "MA" },
  { dev: "प", lat: "PA" },
  { dev: "ध", lat: "DHA" },
  { dev: "नि", lat: "NI", komal: true },
  { dev: "सां", lat: "SA", taar: true },
];
