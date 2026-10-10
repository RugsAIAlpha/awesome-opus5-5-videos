import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, ANTON, POP} from './theme';
import {Panel, Pill, CementBag, Brick, HouseIcon, WarnTriangle, Coin, Stamp, Word3D, useSpring, clamp, easeOut} from './Parts';

const shakeOf = (f: number, at: number, amp = 8, len = 9) => (f >= at && f < at + len ? Math.sin((f - at) * 5.3) * amp * (1 - (f - at) / len) : 0);

// ---------------- B1 HOOK ----------------
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const tape = useSpring(0, 14, 120);
  const bag = useSpring(6, 12, 90);
  return (
    <>
      <Panel accent={C.red}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1000, height: 46, transform: `translateX(${(1 - tape) * -1000}px)`, background: `repeating-linear-gradient(45deg, ${C.yellow} 0 26px, ${C.ink} 26px 52px)`}} />
        <div style={{position: 'absolute', left: 48, top: 92}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6}}>
            <div style={{transform: `rotate(${Math.sin(f * 0.9) * 8}deg)`}}><WarnTriangle size={78} /></div>
            <Pill text="SAAVDHAAN!" bg={C.red} color="#fff" size={34} />
          </div>
          <div><Word3D text="DUKAANDAAR" start={3} size={104} /><Word3D text="KI" start={6} size={104} /></div>
          <div><Word3D text="SALAH" start={9} size={150} color={C.yellow} /><Word3D text="PAR?" start={12} size={150} color={C.yellow} /></div>
          <div style={{fontFamily: POP, fontWeight: 600, color: '#cfd6e2', fontSize: 33, marginTop: 4, opacity: interpolate(f, [18, 26], [0, 1], clamp)}}>construction ka maal khareed rahe hain?</div>
        </div>
        <div style={{position: 'absolute', right: 34, top: 190, opacity: bag, transform: `scale(${0.5 + 0.5 * bag}) translateY(${Math.sin(f / 7) * 8}px)`}}>
          <CementBag ry={-28 + f * 3.2} scale={0.95} />
        </div>
        <div style={{position: 'absolute', right: 52, top: 96, fontFamily: ANTON, fontSize: 100, color: C.red, opacity: interpolate(f, [14, 20], [0, 1], clamp), transform: `rotate(${12 + Math.sin(f / 5) * 5}deg)`}}>?</div>
      </Panel>
    </>
  );
};

// ---------------- B2 JEB PAR BHAARI ----------------
export const Jeb: React.FC = () => {
  const f = useCurrentFrame();
  const w = useSpring(0, 10, 130);
  const slam = useSpring(8, 8, 240, 0.5);
  const sh = shakeOf(f, 8, 10, 12);
  const coins = Array.from({length: 9}, (_, i) => {
    const t0 = 5 + i * 2.2;
    const tt = Math.max(0, f - t0);
    return {x: 190 + i * 14 + (i % 3) * 18 + 2.2 * tt * (i % 2 ? 1 : -0.4) * 3, y: 250 + (-9 + (i % 4)) * tt + 0.62 * tt * tt, r: tt * (i % 2 ? 14 : -11), on: f >= t0};
  });
  return (
    <Panel accent={C.red} style={{transform: `translateX(${sh}px)`}}>
      <div style={{position: 'absolute', left: 60, top: 120, transform: `scale(${0.6 + 0.4 * w}) rotate(${(1 - w) * -20}deg)`, opacity: w}}>
        <svg width="320" height="280" viewBox="0 0 320 280">
          <rect x="20" y="70" width="270" height="180" rx="30" fill="#8A4B1F" />
          <rect x="20" y="70" width="270" height="180" rx="30" fill="none" stroke="#5a2f10" strokeWidth="6" />
          <path d="M40 70 Q150 10 280 70" fill="#A55E2B" stroke="#5a2f10" strokeWidth="6" />
          <rect x="215" y="130" width="100" height="62" rx="26" fill="#C07A3F" stroke="#5a2f10" strokeWidth="6" />
          <circle cx="248" cy="161" r="11" fill={C.yellow} />
        </svg>
      </div>
      {coins.map((c, i) => c.on && c.y < 560 && <Coin key={i} size={62} style={{position: 'absolute', left: c.x, top: c.y, transform: `rotate(${c.r}deg)`}} />)}
      <div style={{position: 'absolute', left: 430, top: 110}}>
        <div style={{fontFamily: ANTON, fontSize: 118, color: '#fff', lineHeight: 1.0, opacity: interpolate(f, [0, 6], [0, 1], clamp), textShadow: '0 5px 0 rgba(0,0,0,.35)'}}>YEH JEB PAR</div>
        <div style={{fontFamily: ANTON, fontSize: 196, color: C.red, lineHeight: 1.0, transform: `scale(${2 - slam}) `, transformOrigin: 'left center', opacity: slam > 0.05 ? 1 : 0, textShadow: '0 8px 0 rgba(0,0,0,.4)'}}>BHAARI</div>
        <div style={{height: 12, width: 470 * easeOut(interpolate(f, [14, 28], [0, 1], clamp)), background: C.red, borderRadius: 8, marginTop: 4}} />
      </div>
    </Panel>
  );
};

// ---------------- B3 MARGIN BARS ----------------
export const MarginBars: React.FC = () => {
  const f = useCurrentFrame();
  const head = useSpring(0);
  const a = easeOut(interpolate(f, [8, 26], [0, 1], clamp));
  const b = easeOut(interpolate(f, [30, 62], [0, 1], clamp));
  const glow = 0.5 + 0.5 * Math.sin(f / 4);
  return (
    <Panel accent={C.orange}>
      <div style={{position: 'absolute', left: 48, top: 34, opacity: head, transform: `translateY(${(1 - head) * -20}px)`}}>
        <div style={{fontFamily: POP, fontWeight: 800, fontSize: 30, color: C.orange, letterSpacing: 4}}>DUKAANDAAR KA</div>
        <div style={{fontFamily: ANTON, fontSize: 100, color: '#fff', lineHeight: 1}}>MARGIN <span style={{color: C.red}}>↑↑</span></div>
      </div>
      {/* bars */}
      <div style={{position: 'absolute', left: 120, bottom: 54, width: 260, height: 90 * a, background: `linear-gradient(180deg, ${C.green}, #139a55)`, borderRadius: '18px 18px 6px 6px'}} />
      <div style={{position: 'absolute', left: 90, bottom: 14, width: 320, textAlign: 'center', fontFamily: POP, fontWeight: 800, fontSize: 26, color: C.green}}>AAPKE LIYE SAHI</div>
      <div style={{position: 'absolute', left: 520, bottom: 54, width: 260, height: 330 * b, background: `linear-gradient(180deg, ${C.red}, #b3162b)`, borderRadius: '18px 18px 6px 6px', boxShadow: `0 0 ${30 + glow * 40}px ${C.red}99`}} />
      <div style={{position: 'absolute', left: 480, bottom: 14, width: 340, textAlign: 'center', fontFamily: POP, fontWeight: 800, fontSize: 26, color: C.red}}>ZYADA MARGIN WALA</div>
      <div style={{position: 'absolute', left: 800, bottom: 40, opacity: interpolate(f, [40, 52], [0, 1], clamp), transform: `translateY(${Math.sin(f / 3) * 8}px)`}}>
        <CementBag ry={-20 + f * 2} scale={0.8} label="BRAND X" band={C.orange} />
      </div>
      {/* tag */}
      <div style={{position: 'absolute', left: 560, top: 40, opacity: interpolate(f, [34, 44], [0, 1], clamp)}}><Pill text="DUKAANDAAR YAHI BECHEGA" bg={C.red} color="#fff" size={26} /></div>
    </Panel>
  );
};

// ---------------- B3b NOT EQUAL ----------------
export const NotEqual: React.FC = () => {
  const f = useCurrentFrame();
  const l = useSpring(0, 11, 150);
  const r = useSpring(7, 11, 150);
  const ne = useSpring(14, 7, 260, 0.5);
  return (
    <Panel accent={C.yellow}>
      <div style={{position: 'absolute', left: 50, top: 70, width: 380, textAlign: 'center', opacity: l, transform: `translateX(${(1 - l) * -120}px)`}}>
        <div style={{display: 'flex', justifyContent: 'center', height: 150}}>
          <Coin size={132} style={{transform: `rotateY(${f * 9}deg)`}} />
        </div>
        <div style={{fontFamily: ANTON, fontSize: 56, color: '#fff', marginTop: 14, lineHeight: 1.05}}>DUKAAN KA<br /><span style={{color: C.red}}>MARGIN</span></div>
      </div>
      <div style={{position: 'absolute', left: 570, top: 70, width: 380, textAlign: 'center', opacity: r, transform: `translateX(${(1 - r) * 120}px)`}}>
        <div style={{display: 'flex', justifyContent: 'center', height: 150}}><HouseIcon size={160} /></div>
        <div style={{fontFamily: ANTON, fontSize: 56, color: '#fff', marginTop: 14, lineHeight: 1.05}}>AAPKE GHAR KI<br /><span style={{color: C.green}}>ZAROORAT</span></div>
      </div>
      <div style={{position: 'absolute', left: 405, top: 105, width: 190, textAlign: 'center', fontFamily: ANTON, fontSize: 240, color: C.yellow, lineHeight: 1, transform: `scale(${ne * 1.0}) rotate(${(1 - ne) * 40}deg)`, textShadow: '0 8px 0 rgba(0,0,0,.45)'}}>≠</div>
    </Panel>
  );
};

// ---------------- B4 BRICKS + STOP ----------------
export const BrickStop: React.FC = () => {
  const f = useCurrentFrame();
  const wall = useSpring(0, 13, 120);
  const rows = 6, cols = 5, bw = 84, bh = 40;
  const crack = easeOut(interpolate(f, [18, 38], [0, 1], clamp));
  const stop = useSpring(46, 8, 240, 0.5);
  const sh = shakeOf(f, 46, 12, 12);
  const dark = interpolate(f, [4, 30], [0, 1], clamp);
  const bricks: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols + 1; c++) {
    const off = r % 2 ? -bw / 2 : 0;
    const x = c * (bw + 6) + off;
    if (x < -bw / 2 || x > cols * (bw + 6)) continue;
    const base = [194, 90, 52];
    const wet = [50, 120, 190];
    const mix = (i: number) => Math.round(base[i] * (1 - 0.0) + (wet[i] - base[i]) * 0);
    bricks.push(<Brick key={`${r}-${c}`} x={x} y={r * (bh + 6)} w={bw} h={bh} c={`rgb(${mix(0)},${Math.round(base[1] - dark * 18)},${Math.round(base[2] + dark * 10)})`} />);
  }
  const drops = [0, 1, 2, 3].map((i) => {
    const tt = (f * 1.0 - i * 5) % 22;
    return {x: 60 + i * 110 + (i % 2) * 20, y: -30 + tt * 18, on: f > i * 5};
  });
  return (
    <Panel accent={C.blue} style={{transform: `translateX(${sh}px)`}}>
      <div style={{position: 'absolute', left: 60, top: 70, width: 560, height: 330, transform: `perspective(900px) rotateY(14deg) rotateX(8deg) scale(${0.7 + 0.3 * wall})`, opacity: wall}}>
        {bricks}
        <svg width="560" height="330" style={{position: 'absolute', left: 0, top: 0}} viewBox="0 0 560 330">
          <polyline points="250,0 270,60 236,110 290,165 252,220 300,280 280,330" fill="none" stroke="#0B0F14" strokeWidth="9" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crack} />
          <polyline points="290,165 350,150 380,196" fill="none" stroke="#0B0F14" strokeWidth="7" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crack} />
        </svg>
        {drops.map((d, i) => d.on && <div key={i} style={{position: 'absolute', left: d.x, top: d.y, width: 20, height: 30, background: '#6EC1FF', borderRadius: '50% 50% 50% 50% / 62% 62% 38% 38%', boxShadow: '0 0 12px #6EC1FF'}} />)}
      </div>
      {f < 44 ? (
        <div style={{position: 'absolute', left: 640, top: 100, width: 340, opacity: interpolate(f, [2, 9], [0, 1], clamp)}}>
          <div style={{fontFamily: ANTON, fontSize: 96, color: '#fff', lineHeight: 1.0}}>EENTEY</div>
          <div style={{fontFamily: ANTON, fontSize: 78, color: '#6EC1FF', lineHeight: 1.0}}>PAANI</div>
          <div style={{fontFamily: ANTON, fontSize: 96, color: C.red, lineHeight: 1.0}}>SOOKENGE</div>
        </div>
      ) : (
        <div style={{position: 'absolute', left: 640, top: 70, width: 340, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{transform: `scale(${2.2 - 1.2 * stop}) rotate(${(1 - stop) * 25}deg)`, opacity: stop > 0.02 ? 1 : 0}}>
            <svg width="200" height="200" viewBox="0 0 200 200"><polygon points="60,6 140,6 194,60 194,140 140,194 60,194 6,140 6,60" fill={C.red} stroke="#fff" strokeWidth="10" /><text x="100" y="118" textAnchor="middle" fontFamily="Anton" fontSize="64" fill="#fff" letterSpacing="2">STOP</text></svg>
          </div>
          <div style={{fontFamily: ANTON, fontSize: 70, color: '#fff', lineHeight: 1.0, textAlign: 'center', marginTop: 6, opacity: interpolate(f, [50, 56], [0, 1], clamp)}}>MISTRI <span style={{color: C.red}}>KAAM<br />ROK DEGA</span></div>
        </div>
      )}
    </Panel>
  );
};

// ---------------- Client story tag ----------------
const StoryTag: React.FC = () => {
  const s = useSpring(0);
  return <div style={{position: 'absolute', left: 44, top: 30, transform: `translateX(${(1 - s) * -80}px)`, opacity: s}}><Pill text="REAL CLIENT STORY" bg={C.yellow} size={26} /></div>;
};

// ---------------- B5 GALAT CEMENT ----------------
export const GalatCement: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Panel accent={C.red}>
      <StoryTag />
      <div style={{position: 'absolute', left: 70, top: 120}}>
        <CementBag ry={-35 + f * 2.6} scale={1.28} label="BRAND ??" band="#6b7280" />
      </div>
      <div style={{position: 'absolute', left: 120, top: 190, opacity: f > 16 ? 1 : 0}}><Stamp text="GALAT" color={C.red} size={92} rot={-14} start={16} /></div>
      <div style={{position: 'absolute', left: 430, top: 130, width: 540}}>
        <div style={{fontFamily: ANTON, fontSize: 112, color: '#fff', lineHeight: 1.0, opacity: interpolate(f, [2, 8], [0, 1], clamp)}}>CLIENT NE</div>
        <div style={{fontFamily: ANTON, fontSize: 168, color: C.red, lineHeight: 1.0, opacity: interpolate(f, [8, 14], [0, 1], clamp), transform: `translateX(${(1 - easeOut(interpolate(f, [8, 18], [0, 1], clamp))) * 90}px)`}}>GALAT</div>
        <div style={{fontFamily: ANTON, fontSize: 112, color: '#fff', lineHeight: 1.0, opacity: interpolate(f, [14, 20], [0, 1], clamp)}}>CEMENT</div>
      </div>
    </Panel>
  );
};

// ---------------- B6 CHHAT ----------------
export const Chhat: React.FC = () => {
  const f = useCurrentFrame();
  const fall = easeOut(interpolate(f, [4, 16], [0, 1], clamp));
  const re = useSpring(14, 10, 120);
  const roofOffset = f < 14 ? fall * 150 : -100 * (1 - re) - 0;
  const roofRot = f < 14 ? fall * 38 : 0;
  const roofOpacity = f < 14 ? 1 - fall : re;
  return (
    <Panel accent={C.orange}>
      <StoryTag />
      <div style={{position: 'absolute', left: 90, top: 100}}>
        <HouseIcon size={330} roof={f < 14 ? C.red : C.green} roofOffset={roofOffset} roofRot={roofRot} roofOpacity={roofOpacity} />
        {f >= 4 && f < 14 && Array.from({length: 7}, (_, i) => (
          <div key={i} style={{position: 'absolute', left: 80 + i * 28, top: 150 + ((f * (4 + i)) % 80), width: 14, height: 14, background: '#caa97a', borderRadius: 3, opacity: 0.8, transform: `rotate(${f * (8 + i)}deg)`}} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 470, top: 110, width: 520}}>
        <div style={{fontFamily: ANTON, fontSize: 150, color: C.orange, lineHeight: 1.0, opacity: interpolate(f, [3, 9], [0, 1], clamp)}}>CHHAT</div>
        <div style={{fontFamily: ANTON, fontSize: 86, color: '#fff', lineHeight: 1.05, opacity: interpolate(f, [10, 16], [0, 1], clamp)}}>DOBARA<br />DAALNI PADI</div>
        <div style={{marginTop: 14, opacity: interpolate(f, [18, 24], [0, 1], clamp)}}><Pill text="REPAIR + DOUBLE KHARCHA" bg={C.red} color="#fff" size={26} /></div>
      </div>
    </Panel>
  );
};

// ---------------- B7 1 LAKH ----------------
const indian = (n: number) => {
  const s = Math.round(n).toString();
  if (s.length <= 3) return s;
  const last = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return rest + ',' + last;
};
export const Lakh: React.FC = () => {
  const f = useCurrentFrame();
  const p = easeOut(interpolate(f, [4, 34], [0, 1], clamp));
  const val = 100000 * p;
  const sh = shakeOf(f, 34, 14, 14);
  const pulse = f > 34 ? 1 + 0.03 * Math.sin(f / 2.2) : 1;
  const flash = interpolate(f, [34, 36, 44], [0, 0.55, 0], clamp);
  return (
    <Panel accent={C.red} style={{transform: `translateX(${sh}px)`, background: 'linear-gradient(145deg,#2A0D14,#0B0F14)'}}>
      <StoryTag />
      <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 96, textAlign: 'center', fontFamily: ANTON, fontSize: 236, color: C.red, lineHeight: 1, transform: `scale(${pulse})`, textShadow: `0 0 ${20 + (f > 34 ? 30 : 0)}px ${C.red}88, 0 8px 0 rgba(0,0,0,.5)`, letterSpacing: 2}}>₹{indian(val)}</div>
      {f >= 34 && Array.from({length: 12}, (_, i) => {
        const tt = f - 34, a = (i / 12) * Math.PI * 2;
        return <Coin key={i} size={44} style={{position: 'absolute', left: 500 + Math.cos(a) * tt * 24, top: 190 + Math.sin(a) * tt * 17 + tt * tt * 0.5, opacity: Math.max(0, 1 - tt / 14), transform: `rotate(${tt * 20}deg)`}} />;
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 335, textAlign: 'center'}}>
        {f >= 24 && <Stamp text="FALTU KHARCHA" color={C.yellow} size={84} rot={-4} start={24} />}
      </div>
    </Panel>
  );
};

// ---------------- B8 SOLUTION SHEET ----------------
export const SheetCard: React.FC = () => {
  const f = useCurrentFrame();
  const head = useSpring(0);
  const rows = [
    {n: 'CEMENT (50kg)', v: ['₹ 385', '₹ 402', '₹ 398'], best: 0},
    {n: 'SARIA (per kg)', v: ['₹ 66', '₹ 61', '₹ 64'], best: 1},
    {n: 'EENT (per pc)', v: ['₹ 9', '₹ 8', '₹ 8.5'], best: 1},
    {n: 'RETI (per cft)', v: ['₹ 55', '₹ 52', '₹ 58'], best: 1},
  ];
  return (
    <Panel accent={C.green}>
      <div style={{position: 'absolute', left: 40, top: 26, display: 'flex', alignItems: 'center', gap: 18, opacity: head, transform: `translateY(${(1 - head) * -16}px)`}}>
        <Pill text="SOLUTION" bg={C.green} size={30} />
        <div style={{fontFamily: ANTON, fontSize: 42, color: '#fff', letterSpacing: 1, whiteSpace: 'nowrap'}}>MATERIAL SHEET + RATE COMPARISON</div>
      </div>
      <div style={{position: 'absolute', left: 40, top: 112, width: 920}}>
        <div style={{display: 'grid', gridTemplateColumns: '300px 1fr 1fr 1fr', gap: 8, marginBottom: 8, fontFamily: POP, fontWeight: 800, fontSize: 24, color: '#9fb0c8', opacity: interpolate(f, [4, 10], [0, 1], clamp)}}>
          <div>MATERIAL</div><div style={{textAlign: 'center'}}>DUKAAN A</div><div style={{textAlign: 'center'}}>DUKAAN B</div><div style={{textAlign: 'center'}}>DUKAAN C</div>
        </div>
        {rows.map((r, i) => {
          const s = Math.min(1, Math.max(0, (f - (8 + i * 6)) / 8));
          const chk = easeOut(interpolate(f, [26 + i * 6, 34 + i * 6], [0, 1], clamp));
          return (
            <div key={i} style={{display: 'grid', gridTemplateColumns: '300px 1fr 1fr 1fr', gap: 8, marginBottom: 10, opacity: s, transform: `translateX(${(1 - s) * 60}px)`}}>
              <div style={{background: '#1B2638', borderRadius: 14, padding: '12px 16px', fontFamily: POP, fontWeight: 800, fontSize: 25, color: '#fff'}}>{r.n}</div>
              {r.v.map((v, j) => {
                const best = j === r.best;
                return (
                  <div key={j} style={{position: 'relative', textAlign: 'center', borderRadius: 14, padding: '12px 0', fontFamily: POP, fontWeight: 800, fontSize: 30, background: best ? `rgba(34,214,123,${0.18 + 0.7 * chk * 0.35})` : '#1B2638', color: best ? C.green : '#cfd6e2', border: best ? `3px solid ${C.green}` : '3px solid transparent', boxShadow: best ? `0 0 ${24 * chk}px ${C.green}77` : 'none'}}>
                    {v}
                    {best && <span style={{position: 'absolute', right: 8, top: 4, fontSize: 22, opacity: chk}}>✓</span>}
                  </div>
                );
              })}
            </div>
          );
        })}
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 4, opacity: interpolate(f, [40, 48], [0, 1], clamp)}}>
          <Pill text="BEST RATE = GREEN" bg={C.green} size={24} />
          <div style={{fontFamily: POP, fontWeight: 600, fontSize: 20, color: '#8191aa', alignSelf: 'center'}}>*sample rates, sirf example ke liye</div>
        </div>
      </div>
    </Panel>
  );
};

// ---------------- B9 SAHI MAAL + SAHI RATE ----------------
export const SahiPair: React.FC = () => {
  const a = useSpring(0, 9, 200, 0.5);
  const b = useSpring(10, 9, 200, 0.5);
  const f = useCurrentFrame();
  const chip = (s: number, text: string, color: string, icon: React.ReactNode, y: number) => (
    <div style={{position: 'absolute', left: 80, top: y, width: 840, height: 190, borderRadius: 30, background: `${color}22`, border: `5px solid ${color}`, display: 'flex', alignItems: 'center', gap: 34, padding: '0 40px', transform: `scale(${0.7 + 0.3 * s}) translateX(${(1 - s) * -200}px)`, opacity: s, boxShadow: `0 0 36px ${color}55`}}>
      {icon}
      <div style={{fontFamily: ANTON, fontSize: 112, color: '#fff', letterSpacing: 2, lineHeight: 1, whiteSpace: 'nowrap'}}><span style={{color}}>SAHI</span> {text}</div>
      <div style={{marginLeft: 'auto', width: 92, height: 92, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: POP, fontWeight: 800, fontSize: 64, color: C.ink}}>✓</div>
    </div>
  );
  return (
    <Panel accent={C.green}>
      {chip(a, 'MAAL', C.yellow, <div style={{width: 100, display: 'flex', justifyContent: 'center', transform: `translateY(-4px)`}}><CementBag ry={-30 + f * 4} scale={0.58} /></div>, 50)}
      {chip(b, 'RATE', C.green, <Coin size={96} style={{transform: `rotateY(${f * 10}deg)`}} />, 262)}
    </Panel>
  );
};

// ---------------- B10 COMMENT TYPING ----------------
export const CommentCard: React.FC = () => {
  const f = useCurrentFrame();
  const word = 'MATERIAL';
  const n = Math.min(word.length, Math.max(0, Math.floor((f - 5) / 2.2)));
  const done = n >= word.length;
  const post = useSpring(24, 8, 220, 0.5);
  const caretOn = Math.floor(f / 6) % 2 === 0;
  return (
    <Panel accent={C.yellow}>
      <div style={{position: 'absolute', left: 50, top: 34, fontFamily: POP, fontWeight: 800, fontSize: 36, color: '#cfd6e2', letterSpacing: 2}}>COMMENT KAREIN</div>
      <div style={{position: 'absolute', left: 50, right: 50, top: 100, height: 150, borderRadius: 75, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 34px', gap: 24, boxShadow: '0 12px 40px rgba(0,0,0,.4)'}}>
        <div style={{width: 92, height: 92, borderRadius: '50%', background: `conic-gradient(${C.orange}, ${C.red}, ${C.yellow}, ${C.orange})`, flex: 'none'}} />
        <div style={{fontFamily: POP, fontWeight: 800, fontSize: 82, color: C.ink, letterSpacing: 3, whiteSpace: 'nowrap'}}>{word.slice(0, n)}<span style={{opacity: caretOn && !done ? 1 : 0, color: C.blue}}>|</span></div>
        <div style={{marginLeft: 'auto', fontFamily: POP, fontWeight: 800, fontSize: 40, color: done ? C.blue : '#b9c1cf', transform: `scale(${done ? 1 + 0.12 * Math.sin(post * Math.PI) : 1})`}}>Post</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', opacity: interpolate(f, [8, 16], [0, 1], clamp)}}>
        <div style={{fontFamily: ANTON, fontSize: 120, color: C.yellow, lineHeight: 1}}>"MATERIAL"</div>
        <div style={{fontFamily: POP, fontWeight: 600, fontSize: 34, color: '#cfd6e2', marginTop: 6}}>bas ye ek word comment karo</div>
      </div>
    </Panel>
  );
};

// ---------------- B11 DM ----------------
export const DmCard: React.FC = () => {
  const f = useCurrentFrame();
  const plane = interpolate(f, [0, 16], [0, 1], clamp);
  const b1 = useSpring(14, 10, 160);
  const b2 = useSpring(30, 10, 160);
  const file = useSpring(40, 9, 180);
  return (
    <Panel accent={C.blue}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 96, background: '#16213A', display: 'flex', alignItems: 'center', gap: 22, padding: '0 40px'}}>
        <div style={{width: 62, height: 62, borderRadius: '50%', background: `conic-gradient(${C.yellow}, ${C.orange}, ${C.yellow})`}} />
        <div style={{fontFamily: POP, fontWeight: 800, fontSize: 38, color: '#fff'}}>DM</div>
        <div style={{marginLeft: 'auto', fontFamily: POP, fontWeight: 800, fontSize: 28, color: C.green}}>● poori jaankari</div>
      </div>
      {plane < 1 && (
        <svg width="110" height="110" viewBox="0 0 24 24" style={{position: 'absolute', left: -60 + plane * 760, top: 360 - Math.sin(plane * Math.PI) * 240, transform: `rotate(${-20 + plane * 40}deg)`, opacity: 1 - Math.max(0, plane - 0.85) * 6}}>
          <path d="M2 12L22 3l-6 18-4-7-8-2z" fill={C.blue} stroke="#fff" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      )}
      <div style={{position: 'absolute', right: 50, top: 124, opacity: b1, transform: `scale(${0.7 + 0.3 * b1}) translateY(${(1 - b1) * 30}px)`, transformOrigin: 'right center', background: C.blue, borderRadius: '36px 36px 8px 36px', padding: '14px 36px', fontFamily: POP, fontWeight: 800, fontSize: 48, color: '#fff'}}>MATERIAL</div>
      <div style={{position: 'absolute', left: 50, top: 226, opacity: b2, transform: `scale(${0.7 + 0.3 * b2}) translateY(${(1 - b2) * 30}px)`, transformOrigin: 'left center', background: '#232F47', borderRadius: '36px 36px 36px 8px', padding: '16px 34px', fontFamily: POP, fontWeight: 700, fontSize: 40, color: '#fff'}}>Ye lijiye, poori jaankari</div>
      <div style={{position: 'absolute', left: 50, top: 332, width: 640, opacity: file, transform: `translateY(${(1 - file) * 40}px) scale(${0.85 + 0.15 * file})`, transformOrigin: 'left center', background: '#232F47', borderRadius: 28, padding: '18px 26px', display: 'flex', alignItems: 'center', gap: 22, border: `3px solid ${C.green}`}}>
        <div style={{width: 70, height: 84, borderRadius: 12, background: '#fff', position: 'relative', flex: 'none'}}>
          <div style={{position: 'absolute', left: 8, right: 8, top: 12, height: 8, background: C.red, borderRadius: 4}} />
          {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 8, right: i === 2 ? 28 : 8, top: 30 + i * 14, height: 6, background: '#c7ccd6', borderRadius: 3}} />)}
        </div>
        <div>
          <div style={{fontFamily: POP, fontWeight: 800, fontSize: 32, color: '#fff'}}>Material_Rate_Sheet</div>
          <div style={{fontFamily: POP, fontWeight: 600, fontSize: 24, color: C.green}}>✓✓ Delivered</div>
        </div>
      </div>
    </Panel>
  );
};
