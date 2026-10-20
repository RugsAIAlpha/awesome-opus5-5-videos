import React from "react";
import { random, useCurrentFrame } from "remotion";
import { rmsAt } from "../audio";
import { H, W } from "../timeline";

// Flat-illustration kit: every piece is plain SVG in a 1080×1920 space.

export const INK = "#1B1430";

const r = (seed: string) => (k: string | number) => random(`${seed}-${k}`);

// ─── Sky & atmosphere ────────────────────────────────────────────────────────

export const Sky: React.FC<{ stops: [number, string][]; id: string }> = ({ stops, id }) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        {stops.map(([o, c]) => (
          <stop key={o} offset={o} stopColor={c} />
        ))}
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill={`url(#${id})`} />
  </svg>
);

type Region = { x0: number; y0: number; x1: number; y1: number };
const streamCache = new Map<string, { d: string; len: number }[]>();

// Streamlines through a gently curling flow field, with optional vortices
const streamlines = (seed: string, count: number, region: Region, swirls: [number, number, number][], tilt: number) => {
  const key = `${seed}|${count}|${JSON.stringify(region)}|${JSON.stringify(swirls)}|${tilt}`;
  const hit = streamCache.get(key);
  if (hit) return hit;
  const rnd = r(seed);
  const s1 = rnd("s1") * 10;
  const s2 = rnd("s2") * 10;
  const out: { d: string; len: number }[] = [];
  for (let i = 0; i < count; i++) {
    let x = region.x0 - 200 + rnd(`x${i}`) * (region.x1 - region.x0 + 200);
    let y = region.y0 + rnd(`y${i}`) * (region.y1 - region.y0);
    const pts: string[] = [`M${x.toFixed(0)},${y.toFixed(0)}`];
    const steps = 44 + Math.floor(rnd(`n${i}`) * 44);
    for (let s = 0; s < steps; s++) {
      // Long, mostly parallel currents with slow waves, like wind across a painted sky
      const a = tilt + 0.32 * Math.sin(y * 0.0024 + x * 0.0011 + s1) + 0.22 * Math.sin(x * 0.0032 + s2);
      let vx = Math.cos(a);
      let vy = Math.sin(a);
      for (const [cx, cy, str] of swirls) {
        const dx = x - cx;
        const dy = y - cy;
        const d = Math.hypot(dx, dy) + 1;
        const fall = Math.exp(-d / 360) * str;
        vx += (-dy / d) * fall;
        vy += (dx / d) * fall;
      }
      const m = Math.hypot(vx, vy) || 1;
      x += (vx / m) * 14;
      y += (vy / m) * 14;
      pts.push(`L${x.toFixed(0)},${y.toFixed(0)}`);
    }
    out.push({ d: pts.join(""), len: steps * 14 });
  }
  streamCache.set(key, out);
  return out;
};

// Wind-streak texture: dashes travelling along streamlines
export const FlowLines: React.FC<{
  seed: string;
  count: number;
  colors: string[];
  region?: Region;
  swirls?: [number, number, number][];
  tilt?: number;
  speed?: number;
  width?: number;
  opacity?: number;
  clipId?: string;
}> = ({ seed, count, colors, region = { x0: 0, y0: 0, x1: W, y1: H }, swirls = [], tilt = -0.06, speed = 2.6, width = 2.6, opacity = 0.8, clipId }) => {
  const frame = useCurrentFrame();
  const lines = streamlines(seed, count, region, swirls, tilt);
  const rnd = r(seed);
  const boost = 1 + rmsAt(frame) * 0.6;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity }}>
      <g clipPath={clipId ? `url(#${clipId})` : undefined} fill="none" strokeLinecap="round">
        {lines.map((l, i) => {
          const dash = 140 + rnd(`d${i}`) * 260;
          const cycle = l.len + dash;
          const off = -((frame * speed * boost * (0.6 + rnd(`v${i}`)) + rnd(`p${i}`) * cycle) % cycle);
          return (
            <path
              key={i}
              d={l.d}
              stroke={colors[i % colors.length]}
              strokeWidth={width * (0.6 + rnd(`w${i}`) * 0.8)}
              strokeDasharray={`${dash.toFixed(0)} ${l.len}`}
              strokeDashoffset={off.toFixed(1)}
              opacity={0.45 + rnd(`o${i}`) * 0.55}
            />
          );
        })}
      </g>
    </svg>
  );
};

export const Stars: React.FC<{ seed: string; count: number; region: Region; color?: string }> = ({ seed, count, region, color = "#FFF6E0" }) => {
  const frame = useCurrentFrame();
  const rnd = r(seed);
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: count }).map((_, i) => {
        const tw = 0.35 + 0.65 * Math.pow(Math.max(0, Math.sin(frame * (0.03 + rnd(`f${i}`) * 0.06) + rnd(`p${i}`) * 20)), 2);
        return (
          <circle
            key={i}
            cx={region.x0 + rnd(`x${i}`) * (region.x1 - region.x0)}
            cy={region.y0 + rnd(`y${i}`) * (region.y1 - region.y0)}
            r={1.2 + rnd(`s${i}`) * 2.6}
            fill={color}
            opacity={tw}
          />
        );
      })}
    </svg>
  );
};

// Soft out-of-focus lights
export const Bokeh: React.FC<{ seed: string; count: number; colors: string[] }> = ({ seed, count, colors }) => {
  const frame = useCurrentFrame();
  const rnd = r(seed);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: count }).map((_, i) => {
        const s = 60 + rnd(`s${i}`) * 160;
        const x = rnd(`x${i}`) * W + Math.sin(frame / (90 + rnd(`a${i}`) * 80) + i) * 30;
        const y = rnd(`y${i}`) * H + Math.cos(frame / (110 + rnd(`b${i}`) * 90) + i) * 30;
        const c = colors[i % colors.length];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - s / 2,
              top: y - s / 2,
              width: s,
              height: s,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${c} 0%, ${c}88 35%, ${c}00 70%)`,
              opacity: 0.35 + 0.35 * Math.sin(frame / 50 + i * 1.7) ** 2,
            }}
          />
        );
      })}
    </div>
  );
};

export const Disc: React.FC<{ x: number; y: number; r: number; color: string; glow: string; crescent?: string }> = ({ x, y, r: rad, color, glow, crescent }) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id={`glow-${x}-${y}`}>
        <stop offset="0" stopColor={glow} stopOpacity={0.75} />
        <stop offset="1" stopColor={glow} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={rad * 3.2} fill={`url(#glow-${x}-${y})`} />
    <circle cx={x} cy={y} r={rad} fill={color} />
    {crescent ? <circle cx={x + rad * 0.45} cy={y - rad * 0.25} r={rad * 0.9} fill={crescent} /> : null}
  </svg>
);

// A layer of rolling hills or dunes
export const Ridge: React.FC<{ seed: string; y: number; amp: number; freq: number; color: string; shift?: number }> = ({ seed, y, amp, freq, color, shift = 0 }) => {
  const rnd = r(seed);
  const p1 = rnd("p1") * 6;
  const p2 = rnd("p2") * 6;
  const pts: string[] = [];
  for (let x = -40; x <= W + 40; x += 20) {
    const xx = x + shift;
    const yy = y + amp * (0.6 * Math.sin(xx * freq + p1) + 0.4 * Math.sin(xx * freq * 2.3 + p2));
    pts.push(`${x},${yy.toFixed(1)}`);
  }
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <path d={`M-40,${H} L${pts.join(" L")} L${W + 40},${H} Z`} fill={color} />
    </svg>
  );
};

// ─── Figures ─────────────────────────────────────────────────────────────────

// Silhouette with a walk cycle; (x, y) is where the feet meet the ground
export const Walker: React.FC<{ x: number; y: number; scale: number; phase: number; walking?: boolean; color?: string; flip?: boolean; lookUp?: number }> = ({
  x,
  y,
  scale,
  phase,
  walking = true,
  color = INK,
  flip = false,
  lookUp = 0,
}) => {
  const a = walking ? Math.sin(phase) * 0.42 : 0;
  const bob = walking ? Math.abs(Math.cos(phase)) * 4 : 0;
  const leg = (ang: number) => `M0,-92 L${(Math.sin(ang) * 50).toFixed(1)},${(-46 + Math.cos(ang) * 4).toFixed(1)} L${(Math.sin(ang) * 92).toFixed(1)},${(-92 + Math.cos(ang) * 92).toFixed(1)}`;
  const arm = (ang: number) => `M0,-152 L${(Math.sin(ang) * 66).toFixed(1)},${(-152 + Math.cos(ang) * 66).toFixed(1)}`;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g transform={`translate(${x} ${y - bob}) scale(${flip ? -scale : scale} ${scale})`} stroke={color} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={leg(a)} strokeWidth={17} />
        <path d={leg(-a)} strokeWidth={17} />
        <path d={arm(-a * 0.8)} strokeWidth={13} />
        <path d="M0,-162 L1,-94" strokeWidth={34} />
        <path d={arm(a * 0.8)} strokeWidth={13} />
        <ellipse cx={2} cy={-186 - lookUp * 2} rx={15} ry={17} fill={color} stroke="none" transform={`rotate(${-lookUp * 18} 2 -186)`} />
      </g>
    </svg>
  );
};

// Seated musician cradling a tanpura, swaying slightly with the music
export const Musician: React.FC<{ x: number; y: number; scale: number; color?: string }> = ({ x, y, scale, color = INK }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 40) * 2.5;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${sway} 0 -60)`} fill={color}>
        <ellipse cx={0} cy={-20} rx={95} ry={26} />
        <path d="M-40,-30 Q-46,-120 0,-140 Q46,-120 40,-30 Z" />
        <circle cx={0} cy={-168} r={24} />
        <g transform="rotate(-14 60 -40)">
          <ellipse cx={62} cy={-30} rx={38} ry={34} fill="#3A2A55" />
          <rect x={56} y={-250} width={12} height={220} rx={5} fill="#3A2A55" />
          <rect x={52} y={-262} width={20} height={16} rx={4} fill="#3A2A55" />
        </g>
        <path d="M-30,-110 Q20,-100 50,-60" stroke={color} strokeWidth={14} strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
};

// Origami paper boat
export const Boat: React.FC<{ x: number; y: number; scale: number; tilt?: number }> = ({ x, y, scale, tilt = 0 }) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${tilt})`}>
      <path d="M-90,0 L90,0 L60,34 L-60,34 Z" fill="#E9ECF5" />
      <path d="M-30,0 L0,-70 L30,0 Z" fill="#FFFFFF" />
      <path d="M0,-70 L30,0 L60,0 Z" fill="#CBD1E3" />
      <path d="M-90,0 L-60,34 L0,0 Z" fill="#D7DCEB" />
    </g>
  </svg>
);

// ─── Places ──────────────────────────────────────────────────────────────────

// Night skyline with flickering lit windows
export const City: React.FC<{ seed: string; base: number; color: string; lit: string; scale?: number; shift?: number }> = ({ seed, base, color, lit, scale = 1, shift = 0 }) => {
  const frame = useCurrentFrame();
  const rnd = r(seed);
  const blocks: React.ReactNode[] = [];
  let x = -60 + shift;
  let i = 0;
  while (x < W + 60) {
    const w = (90 + rnd(`w${i}`) * 110) * scale;
    const h = (260 + rnd(`h${i}`) * 520) * scale;
    const top = base - h;
    const win: React.ReactNode[] = [];
    for (let wy = top + 24; wy < base - 30; wy += 34 * scale) {
      for (let wx = x + 14; wx < x + w - 20; wx += 28 * scale) {
        const k = `${i}-${Math.round(wx)}-${Math.round(wy)}`;
        const on = rnd(`l${k}`) < 0.55;
        const flick = rnd(`f${k}`) < 0.08 ? Math.floor(frame / 45 + rnd(`q${k}`) * 9) % 2 : 1;
        if (on && flick) win.push(<rect key={k} x={wx} y={wy} width={13 * scale} height={17 * scale} rx={2} fill={lit} />);
      }
    }
    blocks.push(
      <g key={i}>
        <rect x={x} y={top} width={w} height={h + 400} fill={color} />
        {win}
      </g>,
    );
    x += w + rnd(`g${i}`) * 14;
    i++;
  }
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {blocks}
    </svg>
  );
};

// Sea bands with drifting highlight dashes
export const Sea: React.FC<{ top: number; colors: [string, string]; glint: string; centerX?: number }> = ({ top, colors, glint, centerX = W / 2 }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id={`sea-${top}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colors[0]} />
          <stop offset="1" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      <rect x={0} y={top} width={W} height={H - top} fill={`url(#sea-${top})`} />
      {Array.from({ length: 40 }).map((_, i) => {
        const y = top + 14 + Math.pow(random(`sea-y-${i}`), 1.3) * 520;
        const spread = 60 + (y - top) * 0.9;
        const x = centerX + (random(`sea-x-${i}`) - 0.5) * 2 * spread + Math.sin(frame / 30 + i) * 12;
        const w = 30 + random(`sea-w-${i}`) * 90;
        const on = 0.25 + 0.75 * Math.pow(Math.max(0, Math.sin(frame * (0.05 + random(`sea-f-${i}`) * 0.08) + i * 3)), 2);
        return <rect key={i} x={x - w / 2} y={y} width={w} height={4} rx={2} fill={glint} opacity={on} />;
      })}
    </svg>
  );
};

// Rangoli (chauk) drawing itself on the floor, seen in perspective
export const Rangoli: React.FC<{ x: number; y: number; size: number; progress: number }> = ({ x, y, size, progress }) => {
  const ring = (n: number, rad: number, len: number, w: number, color: string, delay: number) => {
    const p = Math.max(0, Math.min(1, (progress - delay) / 0.3));
    return Array.from({ length: n }).map((_, i) => (
      <path
        key={`${rad}-${i}`}
        d={`M0,${-rad} Q${w},${-rad - len / 2} 0,${-rad - len} Q${-w},${-rad - len / 2} 0,${-rad}`}
        transform={`rotate(${(i * 360) / n})`}
        fill={color}
        opacity={p}
        style={{ transformBox: "fill-box" }}
      />
    ));
  };
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${x} ${y}) scale(${size} ${size * 0.36})`}>
        <circle r={1.05} fill="none" stroke="#FFF2D6" strokeWidth={0.02} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, progress * 1.4)} />
        {ring(8, 0.12, 0.28, 0.12, "#F2536B", 0.1)}
        {ring(16, 0.42, 0.26, 0.08, "#F6B93B", 0.3)}
        {ring(24, 0.7, 0.24, 0.06, "#4DB6AC", 0.5)}
        <circle r={0.1} fill="#FFF2D6" opacity={Math.min(1, progress * 3)} />
      </g>
    </svg>
  );
};

// Oil lamp with a flickering flame
export const Diya: React.FC<{ x: number; y: number; scale?: number; seed: number }> = ({ x, y, scale = 1, seed }) => {
  const frame = useCurrentFrame();
  const f = 1 + Math.sin(frame * 0.5 + seed) * 0.08 + Math.sin(frame * 1.3 + seed * 2) * 0.05;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <circle cx={0} cy={-34} r={46} fill="#FFB347" opacity={0.25} />
        <path d="M-34,0 Q0,30 34,0 L26,-8 L-26,-8 Z" fill="#B5542D" />
        <ellipse cx={0} cy={-8} rx={26} ry={6} fill="#7A3418" />
        <path d={`M0,${-12} Q10,${-26 * f} 0,${-46 * f} Q-10,${-26 * f} 0,-12`} fill="#FFD36B" />
        <path d={`M0,${-14} Q5,${-24 * f} 0,${-34 * f} Q-5,${-24 * f} 0,-14`} fill="#FFF6D5" />
      </g>
    </svg>
  );
};

// Sky lanterns rising
export const Lanterns: React.FC<{ seed: string; count: number; start: number }> = ({ seed, count, start }) => {
  const frame = useCurrentFrame();
  const rnd = r(seed);
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: count }).map((_, i) => {
        const t = frame - start - rnd(`d${i}`) * 300;
        if (t < 0) return null;
        const y = 1500 - t * (1.1 + rnd(`v${i}`) * 1.2);
        if (y < -80) return null;
        const x = rnd(`x${i}`) * W + Math.sin(t / 50 + i) * 20;
        const s = 0.6 + rnd(`s${i}`) * 0.8;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <circle r={40} fill="#FFB347" opacity={0.22} />
            <path d="M-14,-22 L14,-22 L18,18 L-18,18 Z" fill="#FFC861" />
            <rect x={-18} y={14} width={36} height={6} fill="#E8892E" />
          </g>
        );
      })}
    </svg>
  );
};
