import React, {createContext, useContext} from 'react';
import {Img, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {FPS, PHRASES} from '../src/theme';

export const NAVY = '#1B2350';
export const RED = '#E0263B';
export const WHITE = '#FFFFFF';
export const ANTON = 'Anton, Impact, sans-serif';
export const SMALL = "'Barlow Condensed', 'Arial Narrow', sans-serif";
export const POP = 'Poppins, sans-serif';
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

// ---- word timing (same proportional model as the captions) ----
export const wordStart = (p: number, w: number) => {
  const ph = PHRASES[p];
  const words = ph.text.replace(/'/g, '').split(' ');
  const wt = words.map((x) => x.length + 2);
  const tot = wt.reduce((a, b) => a + b, 0);
  let acc = 0;
  for (let i = 0; i < w; i++) acc += wt[i];
  return ph.s + ((ph.e - ph.s) * acc) / tot;
};

// ---- scene context: absolute start frame so items can be timed in absolute seconds ----
const Ctx = createContext({start: 0, dur: 0});
export const Scene: React.FC<{from: number; to: number; noOut?: boolean; children: React.ReactNode}> = ({from, to, noOut, children}) => {
  const s = Math.round(from * FPS), d = Math.round(to * FPS) - s;
  return (
    <Sequence from={s} durationInFrames={d} layout="none">
      <Ctx.Provider value={{start: s, dur: d}}>
        <SceneBody noOut={noOut}>{children}</SceneBody>
      </Ctx.Provider>
    </Sequence>
  );
};
const SceneBody: React.FC<{noOut?: boolean; children: React.ReactNode}> = ({noOut, children}) => {
  const f = useCurrentFrame();
  const {dur} = useContext(Ctx);
  const out = noOut ? 0 : interpolate(f, [dur - 6, dur], [0, 1], clamp);
  return <div style={{position: 'absolute', inset: 0, opacity: 1 - out, transform: `scale(${1 + out * 0.06})`, transformOrigin: '540px 560px', filter: out > 0 ? `blur(${out * 8}px)` : undefined}}>{children}</div>;
};
// local frame at which absolute second `t` happens
export const useAt = (t: number) => {
  const f = useCurrentFrame();
  const {start} = useContext(Ctx);
  return f - (Math.round(t * FPS) - start);
};
export const useSp = (t: number, damping = 12, stiffness = 170, mass = 0.6) => {
  const f = useAt(t);
  return spring({frame: f, fps: FPS, config: {damping, stiffness, mass}});
};

// ---- typography ----
export const Txt: React.FC<{t: number; txt: string; k: 'big' | 'small'; x: number; y: number; s: number; color?: string; align?: 'left' | 'center' | 'right'; rot?: number; w?: number; strike?: boolean}> = ({t, txt, k, x, y, s, color, align = 'left', rot = 0, w = 1000, strike}) => {
  const sp = useSp(t, k === 'big' ? 10 : 14, k === 'big' ? 190 : 140, 0.55);
  const f = useAt(t);
  const left = align === 'left' ? x : align === 'center' ? x - w / 2 : x - w;
  const big = k === 'big';
  return (
    <div style={{position: 'absolute', left, top: y, width: w, textAlign: align, transformOrigin: align === 'left' ? '0% 100%' : align === 'center' ? '50% 100%' : '100% 100%', opacity: Math.min(1, sp * 2.2), transform: `translateY(${(1 - sp) * (big ? 70 : 30)}px) scale(${big ? 0.7 + 0.3 * sp : 1}) rotate(${rot}deg)`, pointerEvents: 'none'}}>
      <span style={{fontFamily: big ? ANTON : SMALL, fontStyle: big ? 'normal' : 'italic', fontWeight: big ? 400 : 600, fontSize: s, lineHeight: big ? 0.98 : 1, color: color ?? NAVY, letterSpacing: big ? 1 : 0.5, textTransform: big ? 'uppercase' : 'none', textShadow: big ? '0 3px 0 rgba(255,255,255,.28)' : 'none', whiteSpace: 'nowrap', position: 'relative'}}>
        {txt}
        {strike && <span style={{position: 'absolute', left: -8, right: -8, top: '52%', height: s * 0.09, background: RED, transform: `scaleX(${easeOut(interpolate(f, [8, 16], [0, 1], clamp))})`, transformOrigin: 'left', borderRadius: 6}} />}
      </span>
    </div>
  );
};

// ---- hand-drawn style accents ----
export const Loop: React.FC<{t: number; cx: number; cy: number; rx: number; ry: number; rot?: number; color?: string}> = ({t, cx, cy, rx, ry, rot = -12, color = '#fff'}) => {
  const f = useAt(t);
  const sp = useSp(t, 16, 90, 1);
  return (
    <svg width="1080" height="1920" style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', opacity: Math.min(1, sp * 2)}}>
      <g transform={`translate(${cx} ${cy}) rotate(${rot + (1 - sp) * -25}) scale(${0.85 + 0.15 * sp})`}>
        <ellipse rx={rx} ry={ry} fill="none" stroke={color} strokeWidth={5} strokeDasharray="22 14" strokeDashoffset={-f * 1.6} strokeLinecap="round" />
      </g>
    </svg>
  );
};
export const Arrow: React.FC<{t: number; d: string; head: string; color?: string; w?: number}> = ({t, d, head, color = '#fff', w = 5}) => {
  const f = useAt(t);
  const p = easeOut(interpolate(f, [0, 14], [0, 1], clamp));
  return (
    <svg width="1080" height="1920" style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <path d={head} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={p > 0.92 ? 1 : 0} />
    </svg>
  );
};

// ---- image-sequence objects ----
const pad = (n: number) => String(n).padStart(4, '0');
export const Obj: React.FC<{name: string; from?: number; n: number; ext?: 'webp' | 'jpg'; rate?: number; cx: number; cy: number; ax?: number; ay?: number; scale?: number; rot?: number; t: number; fadeBottom?: boolean; w?: number; h?: number; float?: number; style?: React.CSSProperties}> = ({name, from = 1, n, ext = 'webp', rate = 1, cx, cy, ax = 0.5, ay = 0.5, scale = 1, rot = 0, t, fadeBottom, w = 720, h, float = 0, style}) => {
  const f = useCurrentFrame();
  const at = useAt(t);
  const sp = spring({frame: at, fps: FPS, config: {damping: 13, stiffness: 120, mass: 0.7}});
  const idx = Math.min(n, Math.max(1, from + Math.floor(Math.max(0, at) * rate * (24 / 25))));
  const H = h ?? (ext === 'jpg' ? 1200 : 1280);
  const bob = float ? Math.sin(f / 9) * float : 0;
  return (
    <div style={{position: 'absolute', left: cx, top: cy + bob, width: 0, height: 0, opacity: Math.min(1, sp * 2), transform: `scale(${0.55 + 0.45 * sp}) rotate(${(1 - sp) * -9}deg)`}}>
      <div style={{position: 'absolute', left: -ax * w, top: -ay * H, width: w, height: H, transformOrigin: `${ax * w}px ${ay * H}px`, transform: `scale(${scale}) rotate(${rot}deg)`, WebkitMaskImage: fadeBottom ? 'linear-gradient(to bottom, #000 78%, transparent 100%)' : undefined, filter: 'drop-shadow(0 38px 34px rgba(24,32,100,.45))', ...style}}>
        <Img src={staticFile(`seq/${name}/${pad(idx)}.${ext}`)} style={{width: w, height: H, objectFit: 'cover'}} />
      </div>
    </div>
  );
};

// framed photo with tape (collage style from the reference)
export const Card: React.FC<{name: string; n: number; from?: number; rate?: number; t: number; cx: number; cy: number; w: number; h: number; rot?: number}> = ({name, n, from = 1, rate = 1, t, cx, cy, w, h, rot = -4}) => {
  const at = useAt(t);
  const sp = spring({frame: at, fps: FPS, config: {damping: 12, stiffness: 130, mass: 0.7}});
  const idx = Math.min(n, Math.max(1, from + Math.floor(Math.max(0, at) * rate * (24 / 25))));
  const tape = (x: number, y: number, r: number): React.CSSProperties => ({position: 'absolute', left: x, top: y, width: 150, height: 44, background: 'rgba(60,76,200,.78)', transform: `rotate(${r}deg)`, boxShadow: '0 4px 10px rgba(0,0,0,.2)'});
  return (
    <div style={{position: 'absolute', left: cx - w / 2, top: cy - h / 2, width: w, height: h, opacity: Math.min(1, sp * 2), transform: `scale(${0.6 + 0.4 * sp}) rotate(${rot + (1 - sp) * 14}deg)`}}>
      <div style={{position: 'absolute', inset: 0, background: '#F6F6FB', padding: 16, boxShadow: '0 40px 50px rgba(24,32,100,.45)'}}>
        <Img src={staticFile(`seq/${name}/${pad(idx)}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(.15) contrast(1.05)'}} />
      </div>
      <div style={tape(-50, -14, -36)} />
      <div style={tape(w - 100, h - 30, -34)} />
    </div>
  );
};

export const Stamp: React.FC<{t: number; txt: string; x: number; y: number; s?: number; rot?: number; color?: string}> = ({t, txt, x, y, s = 90, rot = -8, color = RED}) => {
  const f = useAt(t);
  const sp = useSp(t, 8, 240, 0.5);
  const sh = f >= 0 && f < 7 ? Math.sin(f * 7) * 7 : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translateX(${sh}px) rotate(${rot}deg) scale(${2.3 - 1.3 * sp})`, opacity: sp > 0.03 ? 1 : 0, transformOrigin: 'center', border: `9px solid ${color}`, color, fontFamily: ANTON, fontSize: s, padding: '0 24px', borderRadius: 14, letterSpacing: 3, background: 'rgba(255,255,255,.55)', whiteSpace: 'nowrap'}}>{txt}</div>
  );
};
