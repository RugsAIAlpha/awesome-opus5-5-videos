import React from "react";
import { AbsoluteFill, Easing, Img, random, staticFile, useCurrentFrame } from "remotion";
import { Mandala } from "../fx";
import { tween } from "../theme";
import { H, W } from "../timeline";

// Paper-collage kit in the style of Vox explainers. Positions are centre points in the 1080×1920 frame.

export type Tex = "cork" | "desk" | "graph" | "wall" | "paper" | "newsprint";
const tex = (t: Tex) => staticFile(`tex/${t}.jpg`);

const back = Easing.out(Easing.back(1.8));

// ─── Motion helpers ──────────────────────────────────────────────────────────

// Stop-motion "boil": a tiny re-placement every few frames, like hand-animated cut-outs
export const Boil: React.FC<{ seed: string; amount?: number; children: React.ReactNode }> = ({ seed, amount = 1, children }) => {
  const frame = useCurrentFrame();
  const step = Math.floor(frame / 3);
  const dx = (random(`${seed}-x-${step}`) - 0.5) * 2.4 * amount;
  const dy = (random(`${seed}-y-${step}`) - 0.5) * 2.4 * amount;
  const dr = (random(`${seed}-r-${step}`) - 0.5) * 0.5 * amount;
  return <AbsoluteFill style={{ translate: `${dx}px ${dy}px`, rotate: `${dr}deg` }}>{children}</AbsoluteFill>;
};

// Element arrives with overshoot: from an offset, a scale and a rotation
export const Pop: React.FC<{
  at: number;
  from?: { x?: number; y?: number; s?: number; r?: number };
  dur?: number;
  origin?: string;
  children: React.ReactNode;
}> = ({ at, from = { s: 0.4 }, dur = 16, origin = "50% 50%", children }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = tween(frame, [at, at + dur], [0, 1], back);
  const q = tween(frame, [at, at + dur * 0.6], [0, 1]);
  return (
    <AbsoluteFill
      style={{
        translate: `${(1 - p) * (from.x ?? 0)}px ${(1 - p) * (from.y ?? 0)}px`,
        scale: `${(from.s ?? 1) + (1 - (from.s ?? 1)) * p}`,
        rotate: `${(1 - p) * (from.r ?? 0)}deg`,
        opacity: q,
        transformOrigin: origin,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ─── Surfaces ────────────────────────────────────────────────────────────────

export const Surface: React.FC<{ t: Tex; blur?: number }> = ({ t, blur = 0 }) => (
  <Img
    src={tex(t)}
    style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover", filter: blur > 0.05 ? `blur(${blur}px)` : undefined, scale: blur > 0.05 ? "1.04" : "1" }}
  />
);

// ─── Prints ──────────────────────────────────────────────────────────────────

const SHADOW = "0 22px 46px rgba(0,0,0,0.42), 0 4px 10px rgba(0,0,0,0.3)";

// A photo print on paper stock; `bottom` > border gives a polaroid
export const Print: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
  border?: number;
  bottom?: number;
  edge?: "plain" | "stamp";
  children: React.ReactNode;
}> = ({ x, y, w, h, rot = 0, border = 20, bottom, edge = "plain", children }) => {
  const b = bottom ?? border;
  // Perforated stamp edge, as on the reference's profile photos
  const mask =
    edge === "stamp"
      ? "radial-gradient(circle at 50% 50%, transparent 6px, black 6.5px) 0 0 / 22px 22px, linear-gradient(black, black) 11px 11px / calc(100% - 22px) calc(100% - 22px) no-repeat"
      : undefined;
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        rotate: `${rot}deg`,
        filter: `drop-shadow(0 22px 26px rgba(0,0,0,0.38)) drop-shadow(0 3px 5px rgba(0,0,0,0.3))`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${tex("paper")})`,
          backgroundSize: "cover",
          WebkitMask: mask,
          mask,
        }}
      />
      <div style={{ position: "absolute", left: border, top: border, right: border, bottom: b, overflow: "hidden", background: "#111" }}>
        {children}
        {/* Print sheen */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(125deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.08) 100%)" }} />
      </div>
    </div>
  );
};

// A full 1080×1920 illustrated scene, scaled to cover a box
export const Fit: React.FC<{ w: number; h: number; children: React.ReactNode }> = ({ w, h, children }) => {
  const k = Math.max(w / W, h / H);
  return (
    <div style={{ position: "absolute", left: (w - W * k) / 2, top: (h - H * k) / 2, width: W, height: H, scale: `${k}`, transformOrigin: "0 0" }}>
      {children}
    </div>
  );
};

// ─── Desk & board props ──────────────────────────────────────────────────────

export const Pin: React.FC<{ x: number; y: number; color?: string }> = ({ x, y, color = "#D7263D" }) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
    <ellipse cx={x + 10} cy={y + 14} rx={16} ry={9} fill="rgba(0,0,0,0.35)" />
    <circle cx={x} cy={y} r={17} fill={color} />
    <circle cx={x - 5} cy={y - 6} r={6} fill="rgba(255,255,255,0.55)" />
  </svg>
);

export const Tape: React.FC<{ x: number; y: number; w?: number; rot?: number }> = ({ x, y, w = 190, rot = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: x - w / 2,
      top: y - 28,
      width: w,
      height: 56,
      rotate: `${rot}deg`,
      background: "linear-gradient(180deg, rgba(246,238,214,0.82), rgba(232,222,196,0.72))",
      clipPath: "polygon(0 6%, 4% 0, 8% 8%, 12% 0, 88% 0, 92% 10%, 96% 0, 100% 8%, 100% 92%, 96% 100%, 92% 90%, 88% 100%, 12% 100%, 8% 92%, 4% 100%, 0 94%)",
      boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
    }}
  />
);

// Hand-drawn marker loop, drawn on over `progress`
export const MarkerCircle: React.FC<{ cx: number; cy: number; rx: number; ry: number; progress: number; color?: string; seed?: string }> = ({
  cx,
  cy,
  rx,
  ry,
  progress,
  color = "#D7263D",
  seed = "mc",
}) => {
  const pts: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const a = -1.9 + (i / 80) * Math.PI * 2.25;
    const wob = 1 + (random(`${seed}-${Math.floor(i / 8)}`) - 0.5) * 0.06 + i * 0.0009;
    pts.push(`${(cx + Math.cos(a) * rx * wob).toFixed(1)},${(cy + Math.sin(a) * ry * wob).toFixed(1)}`);
  }
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <path d={`M${pts.join(" L")}`} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} opacity={0.92} />
    </svg>
  );
};

export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; bend?: number; progress: number; color?: string }> = ({
  x1,
  y1,
  x2,
  y2,
  bend = 80,
  progress,
  color = "#2B2B2B",
}) => {
  const mx = (x1 + x2) / 2 - (y2 - y1) * (bend / 400);
  const my = (y1 + y2) / 2 + (x2 - x1) * (bend / 400);
  const ang = Math.atan2(y2 - my, x2 - mx);
  const head = 34;
  const h1 = [x2 - Math.cos(ang - 0.5) * head, y2 - Math.sin(ang - 0.5) * head];
  const h2 = [x2 - Math.cos(ang + 0.5) * head, y2 - Math.sin(ang + 0.5) * head];
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <g fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
        <path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, progress * 1.25)} />
        {progress > 0.8 ? <path d={`M${h1[0]},${h1[1]} L${x2},${y2} L${h2[0]},${h2[1]}`} /> : null}
      </g>
    </svg>
  );
};

// Red string between two pins on the board
export const RedString: React.FC<{ a: [number, number]; b: [number, number]; progress: number }> = ({ a, b, progress }) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <path
      d={`M${a[0]},${a[1]} Q${(a[0] + b[0]) / 2},${Math.max(a[1], b[1]) + 70} ${b[0]},${b[1]}`}
      fill="none"
      stroke="#B5172E"
      strokeWidth={4}
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - progress}
      style={{ filter: "drop-shadow(0 4px 3px rgba(0,0,0,0.35))" }}
    />
  </svg>
);

// Eighth-note doodle in pencil
const NOTE = "M0,0 L0,-70 Q20,-60 34,-44 M0,0 m-18,0 a18,13 -20 1,0 36,0 a18,13 -20 1,0 -36,0";

export const StickyNote: React.FC<{ x: number; y: number; rot?: number; color?: string; doodle?: number }> = ({ x, y, rot = 0, color = "#FFE36E", doodle = 1 }) => (
  <div style={{ position: "absolute", left: x - 115, top: y - 115, width: 230, height: 230, rotate: `${rot}deg`, background: `linear-gradient(160deg, ${color} 0%, ${color} 70%, rgba(0,0,0,0.06) 100%)`, boxShadow: "0 14px 22px rgba(0,0,0,0.3)" }}>
    <svg width={230} height={230} style={{ position: "absolute", inset: 0 }}>
      <g fill="none" stroke="#3A3A3A" strokeWidth={5} strokeLinecap="round" opacity={0.85}>
        <path d={NOTE} transform="translate(80 150) scale(1.1)" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, doodle)} />
        <path d={NOTE} transform="translate(150 128) scale(0.9)" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, Math.min(1, doodle * 2 - 1))} />
        <path d="M40,190 Q115,175 195,188" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - doodle} />
      </g>
    </svg>
  </div>
);

export const Coffee: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx={14} cy={18} rx={190} ry={190} fill="rgba(0,0,0,0.28)" />
        <circle r={185} fill="#F4F1EA" />
        <circle r={150} fill="#E2DCD0" />
        <rect x={120} y={-34} width={110} height={68} rx={34} fill="#F4F1EA" />
        <circle r={118} fill="#FBF9F4" />
        <circle r={100} fill="#5B341C" />
        <circle r={86} fill="#7A4626" />
        <ellipse cx={-30 + Math.sin(frame / 40) * 4} cy={-34} rx={40} ry={16} fill="rgba(255,240,220,0.35)" transform="rotate(-30)" />
      </g>
    </svg>
  );
};

// Loose sheets of paper scattered on the desk
export const Papers: React.FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, rotate: `${rot}deg` }}>
    {["#F3EFE6", "#E9F0F4", "#F7E7D6"].map((c, i) => (
      <div key={c} style={{ position: "absolute", left: i * 26, top: i * 18, width: 420, height: 300, background: c, rotate: `${i * 4 - 4}deg`, boxShadow: "0 8px 16px rgba(0,0,0,0.25)" }} />
    ))}
  </div>
);

export const Plant: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        {Array.from({ length: 9 }).map((_, i) => {
          const a = -80 + i * 20 + Math.sin(frame / 50 + i) * 2;
          return <path key={i} d="M0,0 Q-30,-120 0,-260 Q30,-120 0,0" fill={i % 2 ? "#3E7D4A" : "#2F6A3C"} transform={`rotate(${a})`} />;
        })}
        <path d="M-80,0 L80,0 L62,120 L-62,120 Z" fill="#D8D2C4" />
      </g>
    </svg>
  );
};

// Comic speech bubble holding music notes (no words)
export const NoteBubble: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
        <path d="M-170,-40 C-170,-140 170,-140 170,-40 C170,50 40,70 -20,60 L-90,120 L-70,52 C-140,40 -170,10 -170,-40 Z" fill="#FFFFFF" stroke="#1D1D1D" strokeWidth={6} style={{ filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.3))" }} />
        <g fill="none" stroke="#1D1D1D" strokeWidth={6} strokeLinecap="round" transform={`scale(${flip ? -1 : 1} 1)`}>
          <path d={NOTE} transform={`translate(-60 ${-10 + Math.sin(frame / 8) * 4}) scale(0.9)`} />
          <path d={NOTE} transform={`translate(40 ${-24 + Math.cos(frame / 8) * 4}) scale(1.05)`} />
        </g>
      </g>
    </svg>
  );
};

// Mandala ink stamp slamming down with a little shake
export const Stamp: React.FC<{ x: number; y: number; at: number; size?: number; color?: string }> = ({ x, y, at, size = 420, color = "#B5172E" }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = tween(frame, [at, at + 7], [0, 1], Easing.in(Easing.quad));
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, scale: `${1.8 - p * 0.8}`, opacity: Math.min(1, p * 1.4) * 0.78, mixBlendMode: "multiply", rotate: "-8deg" }}>
      <Mandala size={size} progress={1} rotate={0} color={color} />
    </div>
  );
};

// Screen-shake offset for a moment of impact
export const shake = (frame: number, at: number, power = 18) => {
  const d = frame - at;
  if (d < 0 || d > 14) return "0px 0px";
  const k = power * Math.exp(-d / 4);
  return `${(random(`sh-x-${frame}`) - 0.5) * k}px ${(random(`sh-y-${frame}`) - 0.5) * k}px`;
};

// ─── Devices ─────────────────────────────────────────────────────────────────

// Hand holding a phone; children fill the screen
export const PhoneInHand: React.FC<{ x: number; y: number; s?: number; rot?: number; children: React.ReactNode }> = ({ x, y, s = 1, rot = 0, children }) => (
  <div style={{ position: "absolute", left: x - 270, top: y - 520, width: 540, height: 1040, scale: `${s}`, rotate: `${rot}deg`, transformOrigin: "50% 80%" }}>
    <svg width={760} height={900} style={{ position: "absolute", left: -110, top: 520, overflow: "visible" }}>
      <path d="M120,120 Q60,320 160,560 L520,640 Q700,420 650,160 Z" fill="#E7A983" />
      <path d="M60,560 L700,620 L760,900 L0,900 Z" fill="#2C5FA8" />
    </svg>
    <div style={{ position: "absolute", inset: 0, borderRadius: 74, background: "linear-gradient(135deg, #3A3A3E, #121214)", boxShadow: "0 30px 60px rgba(0,0,0,0.5), inset 0 0 0 4px #55555A" }} />
    <div style={{ position: "absolute", left: 26, top: 26, right: 26, bottom: 26, borderRadius: 52, overflow: "hidden", background: "#000" }}>
      {children}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 35%)" }} />
    </div>
    <div style={{ position: "absolute", left: 200, top: 44, width: 140, height: 34, borderRadius: 17, background: "#0B0B0D" }} />
    {/* Thumb and fingers over the edges */}
    <svg width={760} height={1100} style={{ position: "absolute", left: -110, top: 0, overflow: "visible" }}>
      <path d="M70,640 Q40,560 90,520 Q150,560 170,700 Q150,760 100,740 Z" fill="#EDB28C" />
      {[600, 680, 760].map((yy) => (
        <path key={yy} d={`M640,${yy} Q700,${yy - 10} 708,${yy + 30} Q700,${yy + 62} 640,${yy + 56} Z`} fill="#E3A47C" />
      ))}
    </svg>
  </div>
);

// Beige CRT monitor on a desk strip; children fill the 4:3 screen
export const CRT: React.FC<{ x: number; y: number; s?: number; children: React.ReactNode }> = ({ x, y, s = 1, children }) => (
  <div style={{ position: "absolute", left: x - 380, top: y - 330, width: 760, height: 660, scale: `${s}` }}>
    <div style={{ position: "absolute", left: 250, top: 620, width: 260, height: 90, background: "linear-gradient(#CFC6B0, #B3A98F)", clipPath: "polygon(15% 0, 85% 0, 100% 100%, 0 100%)" }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: 34, background: "linear-gradient(160deg, #E8E0CB, #C9BFA6)", boxShadow: "0 30px 50px rgba(0,0,0,0.45), inset 0 -10px 0 rgba(0,0,0,0.08)" }} />
    <div style={{ position: "absolute", left: 70, top: 60, width: 620, height: 470, borderRadius: 36, background: "#0E0E10", boxShadow: "inset 0 0 0 10px #B7AD93" }}>
      <div style={{ position: "absolute", left: 22, top: 22, right: 22, bottom: 22, borderRadius: 26, overflow: "hidden" }}>
        {children}
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 5px)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.45) 100%)" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 600, top: 568, width: 26, height: 26, borderRadius: 13, background: "#7FD36B", boxShadow: "0 0 12px #7FD36B" }} />
  </div>
);

// Newspaper sheet with a halftone photo slot; headline and columns are illegible bars
export const Newspaper: React.FC<{ x: number; y: number; rot?: number; photo: React.ReactNode; highlight: number }> = ({ x, y, rot = -3, photo, highlight }) => {
  const W0 = 860;
  const H0 = 1220;
  const bars = (top: number, count: number, left: number, width: number, seed: string) =>
    Array.from({ length: count }).map((_, i) => (
      <div key={`${seed}${i}`} style={{ position: "absolute", left, top: top + i * 26, width: width * (0.75 + random(`${seed}-${i}`) * 0.25), height: 9, background: "rgba(40,36,30,0.55)", borderRadius: 2 }} />
    ));
  return (
    <div style={{ position: "absolute", left: x - W0 / 2, top: y - H0 / 2, width: W0, height: H0, rotate: `${rot}deg`, filter: "drop-shadow(0 26px 30px rgba(0,0,0,0.4))" }}>
      <Img src={tex("newsprint")} style={{ position: "absolute", inset: 0, width: W0, height: H0, objectFit: "cover" }} />
      <div style={{ position: "absolute", left: 40, top: 36, right: 40, height: 64, background: "rgba(30,26,22,0.85)", borderRadius: 4 }} />
      <div style={{ position: "absolute", left: 40, top: 112, right: 40, height: 4, background: "rgba(30,26,22,0.7)" }} />
      {/* Headline bars with a yellow highlighter pass */}
      <div style={{ position: "absolute", left: 40, top: 140, width: 560 * highlight, height: 54, background: "rgba(255,226,60,0.7)", mixBlendMode: "multiply" }} />
      <div style={{ position: "absolute", left: 48, top: 150, width: 520, height: 34, background: "rgba(30,26,22,0.8)", borderRadius: 3 }} />
      <div style={{ position: "absolute", left: 48, top: 206, width: 380, height: 34, background: "rgba(30,26,22,0.8)", borderRadius: 3 }} />
      <div style={{ position: "absolute", left: 40, top: 270, width: 520, height: 600, overflow: "hidden", background: "#222" }}>
        <div style={{ position: "absolute", inset: 0, filter: "grayscale(1) contrast(1.35) brightness(1.05) sepia(0.25)" }}>{photo}</div>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.42) 1.3px, rgba(0,0,0,0) 1.9px)", backgroundSize: "7px 7px", mixBlendMode: "multiply" }} />
      </div>
      {bars(272, 23, 590, 230, "c1")}
      {bars(900, 11, 40, 250, "c2")}
      {bars(900, 11, 320, 250, "c3")}
      {bars(900, 11, 600, 220, "c4")}
    </div>
  );
};

export const Scanlines: React.FC<{ opacity: number }> = ({ opacity }) => (
  <AbsoluteFill style={{ opacity, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 4px)", mixBlendMode: "multiply" }} />
);

// Animated film/paper grain from pre-baked plates
export const GrainPlates: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const i = Math.floor(frame / 2) % 6;
  return (
    <Img
      src={staticFile(`tex/grain${i}.png`)}
      style={{ position: "absolute", inset: 0, width: W, height: H, opacity, mixBlendMode: "overlay", translate: `${(i % 3) * 3}px ${(i % 2) * 3}px`, scale: "1.02" }}
    />
  );
};

export { SHADOW };
