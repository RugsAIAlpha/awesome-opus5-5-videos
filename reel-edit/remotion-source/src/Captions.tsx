import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FPS, PHRASES, RED_WORDS, GREEN_WORDS, POP} from './theme';
import {clamp, easeOut} from './Parts';

type W = {text: string; s: number; e: number};
type G = {words: W[]; s: number; e: number};

const buildGroups = (): G[] => {
  const groups: G[] = [];
  PHRASES.forEach((p, pi) => {
    const words = p.text.replace(/'/g, '').split(' ');
    const weights = words.map((w) => w.length + 2);
    const tot = weights.reduce((a, b) => a + b, 0);
    let cur = p.s;
    const timed: W[] = words.map((w, i) => {
      const d = ((p.e - p.s) * weights[i]) / tot;
      const o = {text: w, s: cur, e: cur + d};
      cur += d;
      return o;
    });
    let g: W[] = [];
    const flush = () => { if (g.length) { groups.push({words: g, s: g[0].s, e: g[g.length - 1].e}); g = []; } };
    timed.forEach((w) => {
      const chars = [...g, w].map((x) => x.text).join(' ').length;
      if (g.length >= 3 || chars > 15) flush();
      g.push(w);
    });
    flush();
    const last = groups[groups.length - 1];
    last.e = Math.min(p.e + 0.25, (PHRASES[pi + 1]?.s ?? p.e + 0.25));
  });
  // extend each group until next group starts when gap is tiny
  for (let i = 0; i < groups.length - 1; i++) if (groups[i + 1].s - groups[i].e < 0.12) groups[i].e = groups[i + 1].s;
  return groups;
};
const GROUPS = buildGroups();

export const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const now = f / FPS;
  const g = GROUPS.find((x) => now >= x.s && now < x.e);
  if (!g) return null;
  const gp = easeOut(interpolate(now, [g.s, g.s + 0.12], [0, 1], clamp));
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 1555, height: 230, display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '0px 46px', transform: `scale(${0.9 + 0.1 * gp}) translateY(${(1 - gp) * 16}px)`, opacity: gp}}>
      {g.words.map((w, i) => {
        const key = w.text.toLowerCase().replace(/[^a-z0-9']/g, '');
        const active = now >= w.s && now < w.e;
        const kw = RED_WORDS.includes(key) ? C.red : GREEN_WORDS.includes(key) ? C.green : null;
        const pop = active ? 1 + 0.14 * Math.sin(Math.min(1, (now - w.s) / 0.18) * Math.PI) + 0.06 : 1;
        const color = kw ?? (active ? C.yellow : '#fff');
        return (
          <span key={i} style={{fontFamily: POP, fontWeight: 800, fontSize: 92, lineHeight: 1.08, color, textTransform: 'uppercase', transform: `scale(${pop})`, display: 'inline-block', WebkitTextStroke: '12px #0B0F14', paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,.35)', letterSpacing: 1}}>{w.text}</span>
        );
      })}
    </div>
  );
};
