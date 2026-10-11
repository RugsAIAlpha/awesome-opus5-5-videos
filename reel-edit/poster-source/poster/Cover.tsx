import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, staticFile, delayRender, continueRender} from 'remotion';
import {ANTON, SMALL, POP, NAVY, RED} from './kit';

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const defs: [string, string, string, string][] = [
      ['Anton', 'fonts/anton.woff2', '400', 'normal'], ['Poppins', 'fonts/poppins-800.woff2', '800', 'normal'],
      ['Barlow Condensed', 'fonts/barlow-600i.woff2', '600', 'italic'],
    ];
    Promise.all(defs.map(([n, u, w, s]) => new FontFace(n, `url(${staticFile(u)})`, {weight: w, style: s}).load().then((ff) => document.fonts.add(ff)))).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
};

const pad = (n: number) => String(n).padStart(4, '0');
// a cut-out prop placed like a sticker
const Prop: React.FC<{name: string; frame: number; cx: number; cy: number; scale: number; rot: number; ax?: number; ay?: number; z?: number}> = ({name, frame, cx, cy, scale, rot, ax = 0.5, ay = 0.5, z = 2}) => (
  <div style={{position: 'absolute', left: cx, top: cy, width: 0, height: 0, zIndex: z}}>
    <div style={{position: 'absolute', left: -ax * 720, top: -ay * 1280, width: 720, height: 1280, transformOrigin: `${ax * 720}px ${ay * 1280}px`, transform: `scale(${scale}) rotate(${rot}deg)`, filter: 'drop-shadow(0 22px 22px rgba(30,30,40,.38)) drop-shadow(0 0 0 #fff)'}}>
      <Img src={staticFile(`seq/${name}/${pad(frame)}.webp`)} style={{width: 720, height: 1280}} />
    </div>
  </div>
);

export const Cover: React.FC = () => {
  useFonts();
  const OUT = '#16162B';
  return (
    <AbsoluteFill style={{background: '#ECE9E0'}}>
      {/* graph-paper background */}
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(150,146,130,.22) 2px, transparent 2px), linear-gradient(90deg, rgba(150,146,130,.22) 2px, transparent 2px)', backgroundSize: '72px 72px', backgroundPosition: '20px 30px'}} />
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '1080px 1920px', mixBlendMode: 'multiply', opacity: 0.1}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 60% at 50% 55%, rgba(255,255,255,.55), rgba(255,255,255,0) 70%)'}} />

      {/* headline (kept inside the central 3:4 area so the Instagram grid crop never cuts it) */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 262, textAlign: 'center'}}>
        <div style={{fontFamily: SMALL, fontStyle: 'italic', fontWeight: 600, fontSize: 64, color: OUT, letterSpacing: 0.5}}>dukandaar ki salah par maal khareeda toh…</div>
        <div style={{fontFamily: ANTON, fontSize: 300, lineHeight: 0.98, color: RED, letterSpacing: 2, marginTop: 6, textShadow: '0 8px 0 rgba(22,22,43,.16)', transform: 'rotate(-2deg)'}}>₹1 LAKH</div>
        <div style={{fontFamily: ANTON, fontSize: 178, lineHeight: 1, color: OUT, letterSpacing: 2, marginTop: -6}}>KA NUKSAAN!</div>
        {/* hand-drawn underline */}
        <svg width="860" height="46" viewBox="0 0 860 46" style={{marginTop: 4}}>
          <path d="M 12 30 C 150 8, 280 40, 430 22 S 700 12, 848 28" fill="none" stroke={RED} strokeWidth="14" strokeLinecap="round" />
        </svg>
      </div>

      {/* props behind the presenter */}
      <Prop name="C1" frame={1} cx={905} cy={1205} scale={0.56} rot={6} ax={0.45} ay={0.55} z={1} />
      <Prop name="B2" frame={10} cx={170} cy={1130} scale={0.52} rot={-8} ax={0.47} ay={0.45} z={1} />

      {/* presenter cutout */}
      <div style={{position: 'absolute', inset: 0, zIndex: 3}}>
        <Img src={staticFile('seq/P2/0340.webp')} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '540px 1470px', transform: 'translateY(619px) scale(1.35)', filter: 'drop-shadow(0 -4px 26px rgba(30,30,40,.30))'}} />
      </div>

      {/* props in front */}
      <Prop name="B3" frame={1} cx={170} cy={1380} scale={0.78} rot={-9} ax={0.52} ay={0.55} z={4} />
      <Prop name="B5" frame={1} cx={880} cy={1520} scale={0.66} rot={7} ax={0.45} ay={0.5} z={4} />

      {/* sticker tag */}
      <div style={{position: 'absolute', left: 540, top: 905, zIndex: 5, transform: 'rotate(-3deg) translateX(-50%)', background: RED, color: '#fff', fontFamily: POP, fontWeight: 800, fontSize: 44, padding: '10px 32px', borderRadius: 14, boxShadow: '0 12px 20px rgba(30,30,40,.35)', letterSpacing: 1, whiteSpace: 'nowrap'}}>GALAT CEMENT = FALTU KHARCHA</div>
    </AbsoluteFill>
  );
};
