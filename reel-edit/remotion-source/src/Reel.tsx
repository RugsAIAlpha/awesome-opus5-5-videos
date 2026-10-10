import React, {useEffect, useState} from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile, interpolate, useCurrentFrame, delayRender, continueRender} from 'remotion';
import {C, FPS, TOTAL, PHRASES, t} from './theme';
import {Beat, clamp, easeOut} from './Parts';
import {Hook, Jeb, MarginBars, NotEqual, BrickStop, GalatCement, Chhat, Lakh, SheetCard, SahiPair, CommentCard, DmCard} from './Beats';
import {Captions} from './Captions';

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const defs: [string, string, string][] = [['Anton', 'fonts/anton.woff2', '400'], ['Poppins', 'fonts/poppins-600.woff2', '600'], ['Poppins', 'fonts/poppins-800.woff2', '800']];
    Promise.all(defs.map(([n, u, w]) => new FontFace(n, `url(${staticFile(u)})`, {weight: w}).load().then((ff) => document.fonts.add(ff)))).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
};

// presenter punch-ins: [base scale per phrase]; slow push inside each phrase
const BASE = [1.0, 1.1, 1.0, 1.06, 1.0, 1.08, 1.0, 1.06, 1.11, 1.0, 1.06, 1.1, 1.04];
const zoomAt = (f: number) => {
  const now = f / FPS;
  let i = 0;
  PHRASES.forEach((p, k) => { if (now >= p.s - 0.05) i = k; });
  const p = PHRASES[i];
  const prev = i > 0 ? BASE[i - 1] + 0.025 : BASE[0];
  const k = easeOut(interpolate(now, [p.s - 0.05, p.s + 0.14], [0, 1], clamp));
  const drift = 0.025 * interpolate(now, [p.s, p.e], [0, 1], clamp);
  return prev + (BASE[i] - prev) * k + drift * k;
};

export const Reel: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  const z = zoomAt(f);
  const prog = interpolate(f, [0, TOTAL], [0, 100]);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '540px 900px'}}>
        <OffthreadVideo src={staticFile('src.mp4')} style={{width: 1080, height: 1920, filter: 'contrast(1.07) saturate(1.12) brightness(1.02)'}} />
      </AbsoluteFill>
      {/* readability scrims */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,10,16,.55) 0%, rgba(8,10,16,.25) 28%, rgba(8,10,16,0) 40%, rgba(8,10,16,0) 78%, rgba(8,10,16,.28) 100%)'}} />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 220px rgba(0,0,0,.35)'}} />

      <Beat from={0.0} to={2.62}><Hook /></Beat>
      <Beat from={2.7} to={4.24}><Jeb /></Beat>
      <Beat from={4.3} to={7.4}><MarginBars /></Beat>
      <Beat from={7.44} to={9.1}><NotEqual /></Beat>
      <Beat from={9.16} to={12.06}><BrickStop /></Beat>
      <Beat from={12.1} to={13.76}><GalatCement /></Beat>
      <Beat from={13.78} to={14.92}><Chhat /></Beat>
      <Beat from={14.96} to={17.14}><Lakh /></Beat>
      <Beat from={17.16} to={20.86}><SheetCard /></Beat>
      <Beat from={20.88} to={22.34}><SahiPair /></Beat>
      <Beat from={22.36} to={23.7}><CommentCard /></Beat>
      <Beat from={23.7} to={26.24} noOut><DmCard /></Beat>

      <Captions />
      <div style={{position: 'absolute', left: 60, right: 60, top: 66, height: 8, borderRadius: 4, background: 'rgba(255,255,255,.28)'}}>
        <div style={{width: `${prog}%`, height: '100%', borderRadius: 4, background: C.yellow}} />
      </div>
    </AbsoluteFill>
  );
};
