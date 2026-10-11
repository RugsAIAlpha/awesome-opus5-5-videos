import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, staticFile, interpolate, spring, useCurrentFrame, delayRender, continueRender} from 'remotion';
import {FPS, TOTAL, PHRASES} from '../src/theme';
import {Scene, Txt, Loop, Arrow, Obj, Card, Stamp, useAt, useSp, wordStart as W, NAVY, RED, ANTON, SMALL, POP, clamp, easeOut} from './kit';

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const defs: [string, string, string, string][] = [
      ['Anton', 'fonts/anton.woff2', '400', 'normal'], ['Poppins', 'fonts/poppins-600.woff2', '600', 'normal'], ['Poppins', 'fonts/poppins-800.woff2', '800', 'normal'],
      ['Barlow Condensed', 'fonts/barlow-600i.woff2', '600', 'italic'],
    ];
    Promise.all(defs.map(([n, u, w, s]) => new FontFace(n, `url(${staticFile(u)})`, {weight: w, style: s}).load().then((ff) => document.fonts.add(ff)))).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
};

// ---------- background ----------
const Bg: React.FC = () => {
  const f = useCurrentFrame();
  const sx = 50 + Math.sin(f / 70) * 6, sy = 30 + Math.cos(f / 90) * 4;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 85% 60% at ${sx}% ${sy}%, #E4E7FE 0%, #B4BDF5 28%, #7480DE 60%, #4E5AC0 100%)`}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(40,48,140,0) 55%, rgba(30,38,120,.55) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: `url(${staticFile('grain.png')})`, backgroundSize: '1080px 1920px', backgroundPosition: `${(f * 37) % 97}px ${(f * 53) % 89}px`, mixBlendMode: 'overlay', opacity: 0.32}} />
    </AbsoluteFill>
  );
};

// ---------- presenter cutout (bottom of the poster) ----------
const PUNCH = [1.0, 1.05, 1.0, 1.04, 1.0, 1.06, 1.0, 1.04, 1.07, 1.0, 1.04, 1.07, 1.02];
const punchAt = (f: number) => {
  const now = f / FPS;
  let i = 0;
  PHRASES.forEach((p, k) => { if (now >= p.s - 0.05) i = k; });
  const p = PHRASES[i];
  const prev = i > 0 ? PUNCH[i - 1] : 1;
  const k = easeOut(interpolate(now, [p.s - 0.05, p.s + 0.18], [0, 1], clamp));
  return prev + (PUNCH[i] - prev) * k;
};
export const PRES = {scale: 1.2, ox: 540, oy: 1470, dy: 500};
const Presenter: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.min(656, f + 1);
  const z = punchAt(f);
  return (
    <div style={{position: 'absolute', inset: 0, transformOrigin: `${PRES.ox}px 1920px`, transform: `scale(${z})`}}>
      <Img src={staticFile(`seq/${process.env.REMOTION_PNAME ?? 'P'}/${String(idx).padStart(4, '0')}.webp`)} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: `${PRES.ox}px ${PRES.oy}px`, transform: `translateY(${PRES.dy}px) scale(${PRES.scale})`, filter: 'drop-shadow(0 -6px 30px rgba(20,28,110,.45)) saturate(1.05) contrast(1.04)'}} />
    </div>
  );
};

export const Poster: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{background: '#4E5AC0'}}>
      <Bg />

      {/* S1 hook */}
      <Scene from={0} to={2.62}>
        <Obj name="A1" n={96} cx={760} cy={600} ay={0.55} scale={0.86} t={0.05} fadeBottom />
        <Txt t={W(0, 0)} txt="dukandaar" k="big" x={50} y={140} s={150} />
        <Txt t={W(0, 1)} txt="ki" k="small" x={58} y={296} s={48} />
        <Txt t={W(0, 2)} txt="salah" k="big" x={50} y={352} s={215} />
        <Txt t={W(0, 3)} txt="par" k="small" x={58} y={566} s={48} />
        <Txt t={W(0, 4)} txt="construction" k="big" x={50} y={622} s={104} />
        <Txt t={W(0, 5)} txt="ka" k="small" x={58} y={730} s={48} />
        <Txt t={W(0, 6)} txt="maal" k="big" x={104} y={776} s={150} />
        <Txt t={W(0, 7)} txt="khareed rahe hain?" k="small" x={58} y={935} s={52} />
        <Loop t={0.7} cx={640} cy={470} rx={330} ry={140} rot={-14} />
      </Scene>

      {/* S2 jeb par bhaari */}
      <Scene from={2.7} to={4.3}>
        <Obj name="C2" from={8} n={52} cx={290} cy={470} ax={0.38} ay={0.25} scale={1.2} t={2.74} float={6} />
        <Txt t={W(1, 0)} txt="yeh" k="small" x={524} y={190} s={50} />
        <Txt t={W(1, 1)} txt="jeb par" k="big" x={520} y={225} s={150} />
        <Txt t={W(1, 3)} txt="bahut" k="small" x={504} y={392} s={50} />
        <Txt t={W(1, 4)} txt="bhaari" k="big" x={500} y={430} s={190} color={RED} />
        <Loop t={3.0} cx={330} cy={640} rx={250} ry={200} rot={18} />
      </Scene>

      {/* S3 margin */}
      <Scene from={4.34} to={7.4}>
        <Obj name="A4" n={72} cx={770} cy={520} ax={0.5} ay={0.38} scale={0.76} t={4.33} />
        <Txt t={W(2, 0)} txt="dukandaar" k="big" x={50} y={150} s={120} />
        <Txt t={W(2, 1)} txt="wahi" k="small" x={58} y={262} s={50} />
        <Txt t={W(2, 2)} txt="brand" k="big" x={50} y={290} s={185} />
        <Txt t={W(2, 3)} txt="bechega" k="small" x={58} y={462} s={50} />
        <Txt t={W(3, 0)} txt="jisme uska" k="small" x={58} y={640} s={50} />
        <Txt t={W(3, 2)} txt="margin" k="big" x={50} y={680} s={200} color={RED} />
        <Txt t={W(3, 3)} txt="zyada ho" k="big" x={56} y={880} s={96} />
        <Loop t={W(3, 2)} cx={290} cy={810} rx={290} ry={120} rot={-4} color="#fff" />
      </Scene>

      {/* S3b na ki jo aapke ghar ke liye sahi */}
      <Scene from={7.44} to={9.14}>
        <Obj name="A1" from={60} n={96} cx={300} cy={620} ay={0.55} scale={0.8} t={7.47} fadeBottom />
        <Txt t={W(4, 0)} txt="na ki jo" k="small" x={560} y={170} s={52} />
        <Txt t={W(4, 3)} txt="aapke ghar" k="big" x={500} y={205} s={108} />
        <Txt t={W(4, 5)} txt="ke liye" k="small" x={508} y={330} s={52} />
        <Txt t={W(4, 7)} txt="sahi hai" k="big" x={500} y={372} s={140} />
        <Arrow t={W(4, 3)} d="M 520 190 C 440 250 470 330 520 380" head="M 495 372 L 522 384 L 530 354" />
        <Stamp t={W(4, 0) + 0.15} txt="NA KI" x={150} y={760} s={96} rot={-8} />
      </Scene>

      {/* S4a eentey */}
      <Scene from={9.18} to={10.1}>
        <Obj name="C1" n={26} cx={680} cy={560} ax={0.45} ay={0.5} scale={0.8} t={9.22} float={4} />
        <Txt t={W(5, 0)} txt="baad mein" k="small" x={58} y={200} s={52} />
        <Txt t={W(5, 2)} txt="eentey" k="big" x={50} y={235} s={200} />
      </Scene>
      {/* S4b wall */}
      <Scene from={10.1} to={10.86}>
        <Obj name="B2" n={32} cx={360} cy={580} ax={0.47} ay={0.45} scale={1.15} t={10.1} />
        <Txt t={W(5, 3)} txt="paani" k="big" x={560} y={230} s={170} color="#2F6FE0" />
        <Txt t={W(5, 4)} txt="sookenge" k="big" x={540} y={410} s={118} />
      </Scene>
      {/* S4c mistri */}
      <Scene from={10.86} to={12.1}>
        <Obj name="B5" n={32} cx={380} cy={620} ax={0.45} ay={0.5} scale={1.25} t={10.88} />
        <Txt t={W(5, 5)} txt="aur" k="small" x={560} y={170} s={50} />
        <Txt t={W(5, 6)} txt="mistri" k="big" x={540} y={200} s={175} />
        <Txt t={W(5, 7)} txt="kaam" k="small" x={560} y={400} s={50} />
        <Txt t={W(5, 8)} txt="rok dega" k="big" x={540} y={430} s={118} color={RED} />
        <Stamp t={W(5, 8) + 0.1} txt="STOP" x={620} y={700} s={110} rot={7} />
      </Scene>

      {/* S5 galat cement */}
      <Scene from={12.14} to={13.78}>
        <Obj name="B3" n={36} cx={680} cy={620} ax={0.52} ay={0.52} scale={1.5} t={12.16} />
        <Txt t={W(6, 0)} txt="ek client ne" k="small" x={58} y={170} s={52} />
        <Txt t={W(6, 3)} txt="galat" k="big" x={50} y={205} s={235} color={RED} />
        <Txt t={W(6, 4)} txt="cement" k="big" x={50} y={430} s={150} />
        <Txt t={W(6, 5)} txt="khareeda" k="small" x={58} y={590} s={52} />
        <Stamp t={W(6, 3) + 0.4} txt="GALAT" x={560} y={760} s={96} rot={-12} />
      </Scene>

      {/* S6 chhat */}
      <Scene from={13.8} to={14.96}>
        <Card name="B1" n={84} cx={710} cy={600} w={500} h={700} rot={3} t={13.8} />
        <Txt t={W(7, 0)} txt="chhat" k="big" x={50} y={190} s={200} />
        <Txt t={W(7, 1)} txt="dobara" k="small" x={58} y={420} s={54} />
        <Txt t={W(7, 2)} txt="daalni padi" k="big" x={50} y={455} s={100} color={RED} />
      </Scene>

      {/* S7 1 lakh */}
      <Scene from={14.98} to={17.16}>
        <Card name="A5" n={84} from={6} cx={540} cy={470} w={760} h={680} rot={-3} t={14.98} />
        <Txt t={W(8, 0)} txt="aur" k="small" x={58} y={150} s={50} />
        <Lakh />
        <Txt t={W(8, 4)} txt="faltu kharcha" k="big" x={540} y={905} s={104} align="center" color={RED} w={1040} />
      </Scene>

      {/* S8a solution + clipboard */}
      <Scene from={17.2} to={18.42}>
        <Obj name="A3" n={40} cx={620} cy={560} ax={0.5} ay={0.48} scale={0.95} t={17.2} />
        <Txt t={W(9, 0)} txt="solution hai" k="small" x={58} y={150} s={54} />
        <Txt t={W(9, 0) + 0.12} txt="solution" k="big" x={50} y={208} s={190} color="#16A34A" />
        <Txt t={W(9, 2)} txt="khareedne se pehle" k="small" x={58} y={410} s={54} />
      </Scene>
      {/* S8b sheet */}
      <Scene from={18.42} to={20.9}>
        <SheetScene />
      </Scene>

      {/* S9 sahi maal sahi rate */}
      <Scene from={20.92} to={22.38}>
        <Obj name="B4" n={48} cx={830} cy={640} ay={0.55} scale={0.85} t={20.93} fadeBottom />
        <Txt t={W(10, 0)} txt="sahi" k="big" x={50} y={170} s={190} />
        <Txt t={W(10, 1)} txt="maal" k="big" x={50} y={360} s={190} />
        <Txt t={W(10, 3)} txt="sahi rate" k="big" x={50} y={610} s={150} color="#16A34A" />
        <Check t={W(10, 1) + 0.1} x={470} y={330} />
        <Check t={W(10, 4) + 0.1} x={560} y={620} />
      </Scene>

      {/* S10 comment */}
      <Scene from={22.4} to={23.74}>
        <Obj name="A2" n={96} cx={760} cy={540} ay={0.5} scale={1.15} t={22.4} float={8} />
        <Txt t={W(11, 0)} txt="comment karein" k="small" x={58} y={160} s={60} />
        <CommentPill />
      </Scene>

      {/* S11 DM */}
      <Scene from={23.74} to={26.24} noOut>
        <Obj name="A2" from={36} n={96} cx={270} cy={560} ay={0.5} scale={1.0} t={23.74} float={8} />
        <Txt t={W(12, 0)} txt="aur main aapko" k="small" x={420} y={150} s={52} />
        <Txt t={W(12, 3)} txt="DM mein" k="big" x={410} y={190} s={150} color={RED} />
        <Txt t={W(12, 5)} txt="poori" k="big" x={410} y={355} s={120} />
        <Txt t={W(12, 6)} txt="jaankari" k="big" x={410} y={500} s={150} />
        <Txt t={W(12, 7)} txt="bhej doonga" k="small" x={414} y={632} s={56} />
        <DmBubbles />
      </Scene>

      <Presenter />
    </AbsoluteFill>
  );
};

// ---------- scene helpers ----------
const indian = (n: number) => {
  const s = Math.round(n).toString();
  if (s.length <= 3) return s;
  return s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + s.slice(-3);
};
const Lakh: React.FC = () => {
  const f = useAt(W(8, 1));
  const p = easeOut(interpolate(f, [0, 30], [0, 1], clamp));
  const sp = useSp(W(8, 1), 9, 200, 0.5);
  const sh = f > 30 && f < 40 ? Math.sin(f * 6) * 8 : 0;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 540, textAlign: 'center', transform: `translateX(${sh}px) scale(${0.6 + 0.4 * sp})`, opacity: Math.min(1, sp * 2)}}>
      <span style={{fontFamily: ANTON, fontSize: 250, color: '#fff', WebkitTextStroke: `10px ${NAVY}`, paintOrder: 'stroke fill', letterSpacing: 2, textShadow: `0 10px 0 ${NAVY}`}}>₹{indian(100000 * p)}</span>
    </div>
  );
};
const Check: React.FC<{t: number; x: number; y: number}> = ({t, x, y}) => {
  const f = useAt(t);
  const p = easeOut(interpolate(f, [0, 10], [0, 1], clamp));
  return (
    <svg width="1080" height="1920" style={{position: 'absolute', left: 0, top: 0}}>
      <circle cx={x + 55} cy={y + 55} r={60} fill="#16A34A" opacity={Math.min(1, p * 1.5)} transform={`scale(${p})`} style={{transformOrigin: `${x + 55}px ${y + 55}px`}} />
      <path d={`M ${x + 28} ${y + 58} L ${x + 50} ${y + 80} L ${x + 86} ${y + 34}`} fill="none" stroke="#fff" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, (p - 0.4) / 0.6)} />
    </svg>
  );
};
const CommentPill: React.FC = () => {
  const f = useAt(W(11, 1));
  const sp = useSp(W(11, 1), 12, 160, 0.6);
  const word = 'MATERIAL';
  const n = Math.min(word.length, Math.max(0, Math.floor((f - 8) / 2.2)));
  const caret = Math.floor(f / 6) % 2 === 0 && n < word.length;
  return (
    <div style={{position: 'absolute', left: 50, top: 300, width: 600, height: 150, borderRadius: 75, background: '#fff', display: 'flex', alignItems: 'center', gap: 20, padding: '0 28px', boxShadow: '0 30px 40px rgba(24,32,100,.35)', opacity: Math.min(1, sp * 2), transform: `translateY(${(1 - sp) * 40}px) scale(${0.85 + 0.15 * sp})`}}>
      <div style={{width: 84, height: 84, borderRadius: '50%', background: `conic-gradient(#FFC21A, #E0263B, #5F6ACA, #FFC21A)`, flex: 'none'}} />
      <div style={{fontFamily: POP, fontWeight: 800, fontSize: 70, color: NAVY, letterSpacing: 2, whiteSpace: 'nowrap'}}>{word.slice(0, n)}<span style={{opacity: caret ? 1 : 0, color: '#3B82F6'}}>|</span></div>
    </div>
  );
};
const DmBubbles: React.FC = () => {
  const b1 = useSp(W(12, 4), 11, 160), b2 = useSp(W(12, 6), 11, 160), file = useSp(W(12, 7), 10, 170);
  return (
    <>
      <div style={{position: 'absolute', left: 410, top: 740, opacity: b1, transform: `scale(${0.7 + 0.3 * b1})`, transformOrigin: 'left center', background: '#3B82F6', color: '#fff', fontFamily: POP, fontWeight: 800, fontSize: 40, borderRadius: '32px 32px 32px 8px', padding: '14px 32px'}}>Material sheet 📄</div>
      <div style={{position: 'absolute', left: 410, top: 830, opacity: file, transform: `translateY(${(1 - file) * 30}px)`, background: '#fff', borderRadius: 26, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 18, boxShadow: '0 22px 30px rgba(24,32,100,.35)'}}>
        <div style={{width: 58, height: 70, borderRadius: 10, background: '#EEF0FF', border: `4px solid ${NAVY}`}} />
        <div><div style={{fontFamily: POP, fontWeight: 800, fontSize: 30, color: NAVY}}>Material_Rate_Sheet</div><div style={{fontFamily: POP, fontWeight: 600, fontSize: 22, color: '#16A34A'}}>✓✓ sent</div></div>
      </div>
    </>
  );
};
const SheetScene: React.FC = () => {
  const f = useAt(18.42);
  const sheet = useSp(18.45, 13, 130, 0.7);
  const rows = [
    {n: 'CEMENT', v: ['385', '402', '398'], best: 0},
    {n: 'SARIA', v: ['66', '61', '64'], best: 1},
    {n: 'EENT', v: ['9', '8', '8.5'], best: 1},
    {n: 'RETI', v: ['55', '52', '58'], best: 1},
  ];
  return (
    <>
      <Txt t={W(9, 5)} txt="material" k="big" x={50} y={150} s={150} />
      <Txt t={W(9, 6)} txt="sheet" k="big" x={640} y={150} s={150} />
      <Txt t={W(9, 7)} txt="aur" k="small" x={58} y={300} s={46} />
      <Txt t={W(9, 8)} txt="rate comparison" k="big" x={50} y={362} s={112} />
      <div style={{position: 'absolute', left: 90, top: 560, width: 900, padding: 26, background: '#fff', borderRadius: 18, boxShadow: '0 40px 50px rgba(24,32,100,.4)', transform: `rotate(-2deg) scale(${0.5 + 0.5 * sheet})`, opacity: Math.min(1, sheet * 2), transformOrigin: 'center'}}>
        <div style={{display: 'grid', gridTemplateColumns: '210px 1fr 1fr 1fr', gap: 8, fontFamily: ANTON, fontSize: 34, color: NAVY, marginBottom: 8}}>
          <div>MATERIAL</div><div style={{textAlign: 'center'}}>DUKAAN A</div><div style={{textAlign: 'center'}}>DUKAAN B</div><div style={{textAlign: 'center'}}>DUKAAN C</div>
        </div>
        {rows.map((r, i) => {
          const g = Math.min(1, Math.max(0, (f - (Math.round((18.8 + i * 0.25 - 18.42) * FPS))) / 6));
          return (
            <div key={i} style={{display: 'grid', gridTemplateColumns: '210px 1fr 1fr 1fr', gap: 8, marginBottom: 6, opacity: g, transform: `translateX(${(1 - g) * 40}px)`}}>
              <div style={{fontFamily: ANTON, fontSize: 38, color: NAVY, padding: '4px 0'}}>{r.n}</div>
              {r.v.map((v, j) => (
                <div key={j} style={{textAlign: 'center', fontFamily: POP, fontWeight: 800, fontSize: 36, padding: '4px 0', borderRadius: 10, background: j === r.best ? '#CFF5DC' : '#EEF0FF', color: j === r.best ? '#0F7A3A' : NAVY, border: j === r.best ? '3px solid #16A34A' : '3px solid transparent'}}>₹{v}{j === r.best ? ' ✓' : ''}</div>
              ))}
            </div>
          );
        })}
        <div style={{fontFamily: SMALL, fontStyle: 'italic', fontWeight: 600, fontSize: 24, color: '#6B74B8', textAlign: 'right'}}>*sample rates, example ke liye</div>
      </div>
    </>
  );
};
