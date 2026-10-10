import React from 'react';
import {interpolate, spring, useCurrentFrame, Sequence} from 'remotion';
import {C, FPS, t, ANTON, POP} from './theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const useSpring = (start = 0, damping = 11, stiffness = 150, mass = 0.6) => {
  const f = useCurrentFrame();
  return spring({frame: f - start, fps: FPS, config: {damping, stiffness, mass}});
};
export const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

// ---------- Beat wrapper: places content in the free curtain area above the presenter ----------
const BeatFrame: React.FC<{dur: number; noOut?: boolean; children: React.ReactNode}> = ({dur, noOut, children}) => {
  const f = useCurrentFrame();
  const inn = spring({frame: f, fps: FPS, config: {damping: 14, stiffness: 170, mass: 0.7}});
  const out = noOut ? 1 : interpolate(f, [dur - 5, dur], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 0, top: 120, width: 1080, height: 540}}>
      <div
        style={{
          width: 1080,
          height: 540,
          opacity: Math.min(1, inn * 1.6) * out,
          transform: `translateY(${(1 - inn) * 46}px) scale(${0.9 + 0.1 * inn + (1 - out) * -0.05})`,
          transformOrigin: '540px 270px',
        }}
      >
        {children}
      </div>
    </div>
  );
};
export const Beat: React.FC<{from: number; to: number; noOut?: boolean; children: React.ReactNode}> = ({from, to, noOut, children}) => (
  <Sequence from={t(from)} durationInFrames={t(to) - t(from)} layout="none">
    <BeatFrame dur={t(to) - t(from)} noOut={noOut}>{children}</BeatFrame>
  </Sequence>
);

export const Panel: React.FC<{x?: number; y?: number; w?: number; h?: number; accent?: string; children?: React.ReactNode; style?: React.CSSProperties}> = ({
  x = 40, y = 20, w = 1000, h = 500, accent = C.yellow, children, style,
}) => (
  <div
    style={{
      position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 40, overflow: 'hidden',
      background: `linear-gradient(145deg, #131C2A 0%, ${C.ink} 100%)`,
      border: `4px solid ${accent}`,
      boxShadow: `0 24px 60px rgba(0,0,0,.45), 0 0 0 8px ${accent}22`,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<{text: string; bg?: string; color?: string; size?: number; style?: React.CSSProperties}> = ({text, bg = C.yellow, color = C.ink, size = 34, style}) => (
  <div style={{display: 'inline-block', background: bg, color, fontFamily: POP, fontWeight: 800, fontSize: size, padding: `${size * 0.18}px ${size * 0.6}px`, borderRadius: 999, letterSpacing: 1, ...style}}>{text}</div>
);

// ---------- True 3D box (CSS 3D) ----------
export const Box3D: React.FC<{
  w: number; h: number; d: number; rx?: number; ry?: number; rz?: number;
  front: React.ReactNode; side: string; top: string; frontBg: string; back?: string;
}> = ({w, h, d, rx = 0, ry = 0, rz = 0, front, side, top, frontBg, back}) => {
  const face: React.CSSProperties = {position: 'absolute', backfaceVisibility: 'hidden'};
  return (
    <div style={{width: w, height: h, position: 'relative', transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`}}>
      <div style={{...face, width: w, height: h, background: frontBg, transform: `translateZ(${d / 2}px)`, overflow: 'hidden'}}>{front}</div>
      <div style={{...face, width: w, height: h, background: back ?? frontBg, transform: `rotateY(180deg) translateZ(${d / 2}px)`, filter: 'brightness(.8)'}} />
      <div style={{...face, width: d, height: h, left: (w - d) / 2, background: side, transform: `rotateY(90deg) translateZ(${w / 2}px)`}} />
      <div style={{...face, width: d, height: h, left: (w - d) / 2, background: side, filter: 'brightness(.75)', transform: `rotateY(-90deg) translateZ(${w / 2}px)`}} />
      <div style={{...face, width: w, height: d, top: (h - d) / 2, background: top, transform: `rotateX(90deg) translateZ(${h / 2}px)`}} />
      <div style={{...face, width: w, height: d, top: (h - d) / 2, background: side, filter: 'brightness(.6)', transform: `rotateX(-90deg) translateZ(${h / 2}px)`}} />
    </div>
  );
};

export const CementBag: React.FC<{ry: number; rx?: number; label?: string; scale?: number; band?: string}> = ({ry, rx = -12, label = 'CEMENT', scale = 1, band = C.red}) => (
  <div style={{perspective: 900, transform: `scale(${scale})`}}>
    <Box3D
      w={170} h={230} d={78} rx={rx} ry={ry}
      frontBg="linear-gradient(180deg,#D8D1C0,#BDB5A2)" side="#A9A18E" top="#CFC8B6"
      front={
        <div style={{width: '100%', height: '100%', position: 'relative'}}>
          <div style={{position: 'absolute', top: 20, left: 0, right: 0, height: 56, background: band}} />
          <div style={{position: 'absolute', top: 28, left: 0, right: 0, textAlign: 'center', fontFamily: ANTON, color: '#fff', fontSize: 38, letterSpacing: 2}}>{label}</div>
          <div style={{position: 'absolute', top: 100, left: 0, right: 0, textAlign: 'center', fontFamily: ANTON, color: '#2B2B2B', fontSize: 64}}>50</div>
          <div style={{position: 'absolute', top: 168, left: 0, right: 0, textAlign: 'center', fontFamily: POP, fontWeight: 800, color: '#2B2B2B', fontSize: 26}}>KG</div>
          <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 14, background: '#8d8572'}} />
        </div>
      }
    />
  </div>
);

export const Brick: React.FC<{x: number; y: number; w: number; h: number; c: string}> = ({x, y, w, h, c}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: c, borderRadius: 4, boxShadow: 'inset 0 -5px 0 rgba(0,0,0,.18), inset 0 3px 0 rgba(255,255,255,.12)'}} />
);

export const HouseIcon: React.FC<{size?: number; roof?: string; wall?: string; roofOffset?: number; roofRot?: number; roofOpacity?: number}> = ({size = 220, roof = C.red, wall = C.cream, roofOffset = 0, roofRot = 0, roofOpacity = 1}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <rect x="35" y="92" width="130" height="86" rx="6" fill={wall} />
    <rect x="86" y="118" width="28" height="60" rx="4" fill="#7a5a3a" />
    <rect x="48" y="108" width="26" height="26" rx="4" fill="#7FC8FF" />
    <rect x="126" y="108" width="26" height="26" rx="4" fill="#7FC8FF" />
    <g style={{transform: `translateY(${roofOffset}px) rotate(${roofRot}deg)`, transformOrigin: '100px 92px', opacity: roofOpacity}}>
      <polygon points="20,98 100,30 180,98" fill={roof} />
      <polygon points="20,98 100,30 180,98" fill="none" stroke="rgba(0,0,0,.25)" strokeWidth="4" />
    </g>
  </svg>
);

export const WarnTriangle: React.FC<{size?: number}> = ({size = 190}) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <polygon points="100,16 188,172 12,172" fill={C.yellow} stroke={C.ink} strokeWidth="10" strokeLinejoin="round" />
    <rect x="92" y="66" width="16" height="62" rx="8" fill={C.ink} />
    <circle cx="100" cy="148" r="10" fill={C.ink} />
  </svg>
);

export const Coin: React.FC<{size?: number; style?: React.CSSProperties}> = ({size = 64, style}) => (
  <div style={{width: size, height: size, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FFE680, #F2A900 70%)', border: `${size * 0.07}px solid #B87800`, color: '#7A4B00', fontFamily: ANTON, fontSize: size * 0.58, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(0,0,0,.4)', ...style}}>₹</div>
);

export const Stamp: React.FC<{text: string; color: string; size?: number; rot?: number; start?: number}> = ({text, color, size = 74, rot = -8, start = 0}) => {
  const s = useSpring(start, 9, 220, 0.5);
  const f = useCurrentFrame();
  const shake = f >= start && f < start + 6 ? Math.sin(f * 7) * 6 : 0;
  return (
    <div style={{opacity: s > 0.02 ? 1 : 0, transform: `translateX(${shake}px) rotate(${rot}deg) scale(${2.4 - 1.4 * s})`, border: `8px solid ${color}`, color, fontFamily: ANTON, fontSize: size, padding: '2px 22px', borderRadius: 14, letterSpacing: 3, background: 'rgba(11,15,20,.78)', whiteSpace: 'nowrap', display: 'inline-block'}}>{text}</div>
  );
};

export const Word3D: React.FC<{text: string; start: number; size: number; color?: string; stroke?: boolean}> = ({text, start, size, color = '#fff'}) => {
  const s = useSpring(start, 12, 170, 0.6);
  return (
    <div style={{display: 'inline-block', fontFamily: ANTON, fontSize: size, lineHeight: 1.02, color, transform: `perspective(700px) rotateX(${(1 - s) * -80}deg) translateY(${(1 - s) * 30}px)`, opacity: Math.min(1, s * 2), transformOrigin: '50% 100%', textShadow: '0 5px 0 rgba(0,0,0,.35)', marginRight: size * 0.22, letterSpacing: 1}}>{text}</div>
  );
};
