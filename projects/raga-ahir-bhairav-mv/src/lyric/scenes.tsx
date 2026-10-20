import { Video } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Easing, random, Sequence, staticFile, useCurrentFrame } from "remotion";
import { rmsAt } from "../audio";
import { tween } from "../theme";
import { H, W } from "../timeline";
import { Boat, Bokeh, City, Disc, Diya, FlowLines, Lanterns, Musician, Rangoli, Ridge, Sea, Sky, Stars, Walker } from "./art";

const FADE = 18;
const inOut = Easing.inOut(Easing.sin);

// Scene windows (absolute frames). Each scene fades in over the previous one.
export const LYRIC_SCENES = {
  nightHill: [0, 480],
  duskWalk: [480, 960],
  city: [960, 1440],
  boat: [1440, 1920],
  spotlight: [1920, 2479],
  dawn: [2479, 2820],
  photo: [2820, 3540],
  window: [3540, 4380],
  screen: [4380, 4920],
  tiles: [4920, 5640],
  portal: [5640, 6385],
  outro: [6385, 6941],
} as const;

export type Range = readonly [number, number];
export type SceneProps = { range?: Range; bare?: boolean };

// Visible window plus fade-in and a slow camera push
const Scene: React.FC<{ range: Range; first?: boolean; bare?: boolean; push?: number; origin?: string; children: (local: number) => React.ReactNode }> = ({
  range,
  first,
  bare,
  push = 0.05,
  origin = "50% 50%",
  children,
}) => {
  const frame = useCurrentFrame();
  const [a, b] = range;
  if (frame < a || frame >= b + (bare ? 0 : FADE)) return null;
  const local = frame - a;
  // Bare: no fade or camera push, for scenes printed on a collage card
  if (bare) return <AbsoluteFill style={{ overflow: "hidden" }}>{children(local)}</AbsoluteFill>;
  return (
    <AbsoluteFill
      style={{
        opacity: first ? 1 : tween(frame, [a, a + FADE], [0, 1], inOut),
        scale: `${tween(frame, [a, b + FADE], [1, 1 + push], inOut)}`,
        transformOrigin: origin,
        overflow: "hidden",
      }}
    >
      {children(local)}
    </AbsoluteFill>
  );
};

// The live performance, cover-fitted to its frame
export const Footage: React.FC<{ from: number; position?: string }> = ({ from }) => (
  <Sequence from={from} layout="none" name="Footage">
    <Video
      src={staticFile("source.mp4")}
      trimBefore={from}
      muted
      objectFit="cover"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  </Sequence>
);

// ─── Intro: the alaap, before any words ──────────────────────────────────────

export const NightHill: React.FC<SceneProps> = ({ range = LYRIC_SCENES.nightHill, bare }) => (
  <Scene range={range} bare={bare} first origin="50% 70%">
    {(t) => (
      <>
        <Sky id="sky-night" stops={[[0, "#27324F"], [0.55, "#56658A"], [1, "#8B98B4"]]} />
        <Stars seed="nh" count={60} region={{ x0: 0, y0: 0, x1: W, y1: 900 }} />
        <FlowLines seed="nh" count={190} colors={["#DCE3F2", "#B8C4DE", "#FFFFFF"]} region={{ x0: 0, y0: 80, x1: W, y1: 1300 }} swirls={[[760, 520, 0.9]]} opacity={0.75} />
        <Disc x={830} y={700} r={48} color="#F4F1E6" glow="#FFFFFF" />
        <Ridge seed="nh-far" y={1330} amp={30} freq={0.006} color="#3A4465" />
        <Ridge seed="nh-near" y={1440} amp={16} freq={0.004} color="#232A42" />
        <Walker x={540} y={1446} scale={1.5} phase={0} walking={false} lookUp={tween(t, [40, 160], [0, 1])} color="#141A2C" />
      </>
    )}
  </Scene>
);

export const DuskWalk: React.FC<SceneProps> = ({ range = LYRIC_SCENES.duskWalk, bare }) => (
  <Scene range={range} bare={bare}>
    {(t) => (
      <>
        <Sky id="sky-dusk" stops={[[0, "#3A2961"], [0.55, "#B5719D"], [1, "#F2B8A2"]]} />
        <Disc x={300} y={1170} r={72} color="#FFE8C9" glow="#FFC9A0" />
        <FlowLines seed="dw" count={190} colors={["#FCD5E5", "#E7B6F0", "#FFFFFF", "#FFD7B5"]} region={{ x0: 0, y0: 60, x1: W, y1: 1250 }} swirls={[[760, 760, 0.9]]} />
        <Ridge seed="dw-far" y={1290} amp={36} freq={0.005} color="#7B4F87" shift={t * 0.4} />
        <Ridge seed="dw-near" y={1430} amp={10} freq={0.004} color="#3B2550" shift={t * 1.4} />
        {/* Weathered posts drifting past at walking pace */}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 6 }).map((_, i) => {
            const x = ((i * 260 - t * 1.4) % 1560 + 1560) % 1560 - 240;
            const h = 150 + random(`post-${i}`) * 120;
            return <rect key={i} x={x} y={1436 - h} width={22} height={h + 10} rx={4} fill="#2A1A3D" transform={`rotate(${(random(`pr-${i}`) - 0.5) * 8} ${x} 1436)`} />;
          })}
        </svg>
        <Walker x={480} y={1438} scale={1.4} phase={t * 0.17} color="#22163A" />
      </>
    )}
  </Scene>
);

export const NightCity: React.FC<SceneProps> = ({ range = LYRIC_SCENES.city, bare }) => (
  <Scene range={range} bare={bare}>
    {(t) => (
      <>
        <Sky id="sky-city" stops={[[0, "#24125A"], [0.6, "#68299C"], [1, "#9B4DCA"]]} />
        <FlowLines seed="ct" count={180} colors={["#FF7AD9", "#7BD3FF", "#C9A2FF", "#FFFFFF"]} region={{ x0: 0, y0: 40, x1: W, y1: 980 }} swirls={[[640, 420, 1.0]]} />
        <City seed="ct-far" base={1450} color="#3B1F7A" lit="#F7C873" scale={0.8} shift={-t * 0.3} />
        <City seed="ct-near" base={1530} color="#27124F" lit="#FFD98A" scale={1.05} shift={-t * 0.75} />
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <rect x={0} y={1528} width={W} height={400} fill="#1B0C3B" />
          <ellipse cx={560} cy={1532} rx={140} ry={10} fill="#FF7AD9" opacity={0.25} />
        </svg>
        <Walker x={560} y={1532} scale={1.25} phase={t * 0.16} color="#100824" />
      </>
    )}
  </Scene>
);

export const CosmicBoat: React.FC<SceneProps> = ({ range = LYRIC_SCENES.boat, bare }) => {
  const frame = useCurrentFrame();
  const t = frame - range[0];
  // Organic blob outline that slowly breathes
  const pts: string[] = [];
  for (let k = 0; k <= 64; k++) {
    const a = (k / 64) * Math.PI * 2;
    const rad = 430 + 40 * Math.sin(a * 3 + t / 70) + 26 * Math.sin(a * 5 - t / 50);
    pts.push(`${(540 + Math.cos(a) * rad * 1.05).toFixed(1)},${(960 + Math.sin(a) * rad * 0.92).toFixed(1)}`);
  }
  return (
    <Scene range={range} bare={bare}>
      {() => (
        <>
          <Sky id="sky-boat" stops={[[0, "#16133A"], [1, "#0F0D2A"]]} />
          <Bokeh seed="bt" count={10} colors={["#4D7BFF", "#B05CFF", "#FF5FA8"]} />
          <Stars seed="bt" count={80} region={{ x0: 0, y0: 0, x1: W, y1: H }} />
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <clipPath id="blob">
                <polygon points={pts.join(" ")} />
              </clipPath>
              <linearGradient id="blob-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#7A2FD0" />
                <stop offset="1" stopColor="#3A1C9A" />
              </linearGradient>
            </defs>
            <polygon points={pts.join(" ")} fill="url(#blob-fill)" />
          </svg>
          <FlowLines seed="bt" count={150} colors={["#FF6EC7", "#6FD6FF", "#B48CFF", "#FFFFFF"]} region={{ x0: 60, y0: 480, x1: 1020, y1: 1440 }} swirls={[[540, 960, 2.4]]} clipId="blob" width={3.4} />
          <Boat x={tween(t, [0, 480], [430, 650], inOut)} y={960 + Math.sin(t / 22) * 10} scale={1.1} tilt={Math.sin(t / 26) * 6} />
        </>
      )}
    </Scene>
  );
};

export const Spotlight: React.FC<SceneProps> = ({ range = LYRIC_SCENES.spotlight, bare }) => {
  const frame = useCurrentFrame();
  const beam = 0.28 + rmsAt(frame) * 0.16;
  return (
    <Scene range={range} bare={bare} push={0.07} origin="50% 70%">
      {() => (
        <>
          <Sky id="sky-wall" stops={[[0, "#2B1D4F"], [1, "#1C1338"]]} />
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: 34 }).map((_, row) =>
              Array.from({ length: 9 }).map((__, col) => (
                <rect key={`${row}-${col}`} x={col * 130 - (row % 2) * 65} y={row * 56} width={122} height={48} rx={4} fill="#33245C" opacity={0.55 + random(`br-${row}-${col}`) * 0.3} />
              )),
            )}
            <defs>
              <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#FFF4DA" stopOpacity={0.95} />
                <stop offset="1" stopColor="#FFF4DA" stopOpacity={0.15} />
              </linearGradient>
            </defs>
            <polygon points="540,250 200,1560 880,1560" fill="url(#beam)" opacity={beam} />
            <ellipse cx={540} cy={1560} rx={360} ry={40} fill="#FFF4DA" opacity={beam * 0.9} />
            <path d="M500,250 L580,250 L560,210 L520,210 Z" fill="#E8E0F0" />
            <rect x={536} y={0} width={8} height={212} fill="#E8E0F0" />
          </svg>
          <Stars seed="motes" count={50} region={{ x0: 330, y0: 400, x1: 750, y1: 1500 }} color="#FFF4DA" />
          <Musician x={540} y={1556} scale={1.3} color="#140E28" />
        </>
      )}
    </Scene>
  );
};

const DawnBeach: React.FC<{ range: Range; bare?: boolean; sunFrom: number; sunTo: number; children?: (t: number) => React.ReactNode }> = ({ range, bare, sunFrom, sunTo, children }) => (
  <Scene range={range} bare={bare} push={0.04}>
    {(t) => (
      <>
        <Sky id={`sky-dawn-${range[0]}`} stops={[[0, "#2B2E69"], [0.42, "#B86A8E"], [0.56, "#F4AE7C"], [0.6, "#FFD9AB"]]} />
        <FlowLines seed={`dawn-${range[0]}`} count={90} colors={["#FFE3C9", "#F7C4D9", "#FFFFFF"]} region={{ x0: 0, y0: 60, x1: W, y1: 1000 }} swirls={[[300, 500, 1]]} opacity={0.55} />
        <Disc x={540} y={tween(t, [0, range[1] - range[0]], [sunFrom, sunTo], inOut)} r={84} color="#FFF2D6" glow="#FFB37A" />
        <Sea top={1100} colors={["#7A5E9E", "#2D2A5A"]} glint="#FFE1B5" />
        <Ridge seed={`sand-${range[0]}`} y={1520} amp={20} freq={0.004} color="#3A2647" />
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          {[80, 170, 930, 1010].map((x, i) => (
            <g key={x} transform={`translate(${x} 1560) rotate(${Math.sin(t / 40 + i) * 3})`} fill="#24162F">
              <path d={`M0,0 Q${i % 2 ? 12 : -12},-120 ${i % 2 ? -8 : 8},-220`} stroke="#24162F" strokeWidth={6} fill="none" />
              <circle cx={i % 2 ? -8 : 8} cy={-226} r={22} />
              <circle cx={i % 2 ? 18 : -18} cy={-150} r={14} />
            </g>
          ))}
        </svg>
        {children?.(t)}
      </>
    )}
  </Scene>
);

export const Dawn: React.FC<SceneProps> = ({ range = LYRIC_SCENES.dawn, bare }) => (
  <DawnBeach range={range} bare={bare} sunFrom={1150} sunTo={1040} />
);

// ─── Bandish: the live performance framed inside the story ──────────────────

const Hands: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    {/* Sleeves */}
    <path d="M-60,1920 L-60,1500 Q60,1420 250,1395 L300,1500 Q140,1560 120,1920 Z" fill="#2F6FD6" />
    <path d="M1140,1920 L1140,1500 Q1020,1420 830,1395 L780,1500 Q940,1560 960,1920 Z" fill="#2F6FD6" />
    {/* Palms behind the card's lower corners, thumbs in front */}
    <path d="M220,1420 Q240,1330 330,1330 L360,1350 L360,1460 Q280,1500 220,1420 Z" fill="#F2B58C" />
    <path d="M860,1420 Q840,1330 750,1330 L720,1350 L720,1460 Q800,1500 860,1420 Z" fill="#F2B58C" />
  </svg>
);

export const PhotoInHands: React.FC<SceneProps> = ({ range = LYRIC_SCENES.photo, bare }) => {
  const frame = useCurrentFrame();
  const [a] = range;
  const breathe = 1 + rmsAt(frame) * 0.012;
  return (
    <Scene range={range} bare={bare} push={0.06} origin="50% 55%">
      {(t) => (
        <>
          <Sky id="sky-photo" stops={[[0, "#14123A"], [1, "#1F1B52"]]} />
          <Bokeh seed="ph" count={16} colors={["#4D7BFF", "#B05CFF", "#FF5FA8", "#FFC36B"]} />
          <Stars seed="ph" count={70} region={{ x0: 0, y0: 0, x1: W, y1: H }} />
          <div style={{ position: "absolute", inset: 0, rotate: `${Math.sin(t / 60) * 1.6}deg`, scale: `${breathe}`, transformOrigin: "50% 80%" }}>
            <div style={{ position: "absolute", left: 210, top: 330, width: 660, height: 1080, background: "#FBF7EE", borderRadius: 10, boxShadow: "0 30px 70px rgba(0,0,0,0.5)" }}>
              <div style={{ position: "absolute", left: 30, top: 30, width: 600, height: 920, overflow: "hidden", borderRadius: 4, background: "#000" }}>
                <Footage from={a} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,214,170,0.12), rgba(120,60,140,0.18))" }} />
              </div>
            </div>
            <Hands />
            <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
              <ellipse cx={318} cy={1404} rx={24} ry={50} fill="#E9A57B" transform="rotate(-24 318 1404)" />
              <ellipse cx={762} cy={1404} rx={24} ry={50} fill="#E9A57B" transform="rotate(24 762 1404)" />
            </svg>
          </div>
        </>
      )}
    </Scene>
  );
};

const archPath = (x: number, y: number, w: number, h: number) => `M${x},${y + h} L${x},${y + w / 2} A${w / 2},${w / 2} 0 0 1 ${x + w},${y + w / 2} L${x + w},${y + h} Z`;

export const WindowAtDawn: React.FC<SceneProps> = ({ range = LYRIC_SCENES.window, bare }) => {
  const frame = useCurrentFrame();
  const [a] = range;
  // The rangoli draws itself as "chauk puraao" is sung (118.2 s)
  const rangoli = tween(frame, [a + 6, a + 240], [0, 1], inOut);
  const win = { x: 210, y: 300, w: 660, h: 960 };
  return (
    <Scene range={range} bare={bare} push={0.05} origin="50% 45%">
      {(t) => (
        <>
          <Sky id="sky-wall2" stops={[[0, "#F6D2B4"], [0.7, "#EBAE8F"], [1, "#D98B6E"]]} />
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <clipPath id="arch">
                <path d={archPath(win.x, win.y, win.w, win.h)} />
              </clipPath>
            </defs>
            <rect x={0} y={1400} width={W} height={520} fill="#C9765C" />
            <path d={archPath(win.x - 26, win.y - 26, win.w + 52, win.h + 26)} fill="#8A4632" />
          </svg>
          <div style={{ position: "absolute", inset: 0, clipPath: `path('${archPath(win.x, win.y, win.w, win.h)}')`, background: "#000" }}>
            <div style={{ position: "absolute", left: win.x, top: win.y, width: win.w, height: win.h }}>
              <Footage from={a} position="50% 30%" />
            </div>
          </div>
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            <rect x={win.x - 60} y={win.y + win.h} width={win.w + 120} height={34} rx={6} fill="#6E3424" />
            {/* Marigold toran swaying across the top */}
            {Array.from({ length: 23 }).map((_, i) => {
              const u = i / 22;
              const x = 120 + u * 840;
              const y = 230 + Math.sin(u * Math.PI) * 70 + Math.sin(t / 30 + u * 6) * 4;
              return <circle key={i} cx={x} cy={y} r={17} fill={i % 3 === 0 ? "#F6C445" : "#F08A24"} />;
            })}
            {[130, 950].map((x) => (
              <g key={x}>
                {Array.from({ length: 6 }).map((_, k) => (
                  <circle key={k} cx={x + Math.sin(t / 25 + k) * 3} cy={250 + k * 36} r={15} fill={k % 2 ? "#F6C445" : "#F08A24"} />
                ))}
              </g>
            ))}
          </svg>
          <Diya x={330} y={win.y + win.h} seed={1} />
          <Diya x={540} y={win.y + win.h} seed={2} scale={1.15} />
          <Diya x={750} y={win.y + win.h} seed={3} />
          <Rangoli x={540} y={1640} size={330} progress={rangoli} />
        </>
      )}
    </Scene>
  );
};

export const ProjectionRoom: React.FC<SceneProps> = ({ range = LYRIC_SCENES.screen, bare }) => {
  const frame = useCurrentFrame();
  const [a] = range;
  const flicker = 0.22 + rmsAt(frame) * 0.1 + Math.sin(frame * 0.9) * 0.015;
  return (
    <Scene range={range} bare={bare} push={0.06} origin="50% 40%">
      {() => (
        <>
          <Sky id="sky-room" stops={[[0, "#150F2C"], [1, "#0B0818"]]} />
          <div style={{ position: "absolute", left: 140, top: 260, width: 800, height: 1100, overflow: "hidden", boxShadow: "0 0 90px rgba(190,170,255,0.35)" }}>
            <Footage from={a} />
          </div>
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <linearGradient id="proj" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#E6E0FF" stopOpacity={0.9} />
                <stop offset="1" stopColor="#E6E0FF" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <polygon points="525,1750 555,1750 940,260 140,260" fill="url(#proj)" opacity={flicker} />
            {Array.from({ length: 11 }).map((_, i) => {
              const x = 40 + i * 100 + (i % 2) * 20;
              const y = 1740 + (i % 3) * 30;
              return (
                <g key={i} fill="#07050E">
                  <circle cx={x} cy={y} r={40} />
                  <rect x={x - 62} y={y + 30} width={124} height={200} rx={50} />
                </g>
              );
            })}
          </svg>
          <Stars seed="proj-dust" count={45} region={{ x0: 260, y0: 500, x1: 820, y1: 1650 }} color="#E6E0FF" />
        </>
      )}
    </Scene>
  );
};

// Grid geometry for the tile scene
const TILE = 128;
const GAP = 12;
const X0 = (W - (7 * TILE + 6 * GAP)) / 2;
const Y0 = 120;
const tileXY = (c: number, rr: number) => [X0 + c * (TILE + GAP) + TILE / 2, Y0 + rr * (TILE + GAP) + TILE / 2];
const PATH: [number, number][] = [[0, 12], [0, 10], [2, 10], [2, 9], [5, 9], [5, 11], [6, 11], [6, 8], [3, 8], [3, 7]];

export const TilePath: React.FC<SceneProps> = ({ range = LYRIC_SCENES.tiles, bare }) => {
  const frame = useCurrentFrame();
  const [a, b] = range;
  const draw = tween(frame, [a + 20, b - 60], [0, 1], inOut);
  const d = PATH.map(([c, rr], i) => {
    const [x, y] = tileXY(c, rr);
    return `${i ? "L" : "M"}${x},${y}`;
  }).join(" ");
  const panel = { x: X0 + TILE + GAP, y: Y0 + 1 * (TILE + GAP), w: 5 * TILE + 4 * GAP, h: 6 * TILE + 5 * GAP };
  return (
    <Scene range={range} bare={bare} push={0.05} origin="50% 40%">
      {() => (
        <>
          <Sky id="sky-tiles" stops={[[0, "#111848"], [1, "#0B0F33"]]} />
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: 13 }).map((_, rr) =>
              Array.from({ length: 7 }).map((__, c) => {
                const [x, y] = tileXY(c, rr);
                return (
                  <g key={`${c}-${rr}`}>
                    <rect x={x - TILE / 2} y={y - TILE / 2} width={TILE} height={TILE} rx={10} fill="#1C2A70" />
                    {Array.from({ length: 4 }).map((___, s) => (
                      <circle key={s} cx={x - 50 + random(`ts${c}${rr}${s}x`) * 100} cy={y - 50 + random(`ts${c}${rr}${s}y`) * 100} r={1.6 + random(`ts${c}${rr}${s}r`) * 1.4} fill="#DDE6FF" opacity={0.4 + 0.6 * Math.abs(Math.sin(frame / 40 + c + rr + s))} />
                    ))}
                  </g>
                );
              }),
            )}
            <path d={d} fill="none" stroke="#FFD86B" strokeWidth={22} opacity={0.25} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
            <path d={d} fill="none" stroke="#FFE89A" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          </svg>
          <div style={{ position: "absolute", left: panel.x, top: panel.y, width: panel.w, height: panel.h, borderRadius: 14, overflow: "hidden", boxShadow: "0 0 0 6px #FFE89A, 0 0 60px rgba(255,216,107,0.55)" }}>
            <Footage from={a} />
          </div>
        </>
      )}
    </Scene>
  );
};

export const MoonPortal: React.FC<SceneProps> = ({ range = LYRIC_SCENES.portal, bare }) => {
  const frame = useCurrentFrame();
  const [a, b] = range;
  const rim = 0.6 + rmsAt(frame) * 0.4;
  const R = 360;
  return (
    <Scene range={range} bare={bare} push={0.05} origin="50% 45%">
      {(t) => (
        <>
          <Sky id="sky-portal" stops={[[0, "#170F40"], [0.5, "#3B2878"], [0.66, "#6A4A9E"]]} />
          <Stars seed="pt" count={90} region={{ x0: 0, y0: 0, x1: W, y1: 1200 }} />
          <FlowLines seed="pt" count={170} colors={["#B9A2FF", "#FF9BD2", "#FFFFFF"]} region={{ x0: 0, y0: 100, x1: W, y1: 1240 }} swirls={[[540, 760, 2]]} opacity={0.6} />
          <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <radialGradient id="rim">
                <stop offset="0.7" stopColor="#FFE2A8" stopOpacity={0.9} />
                <stop offset="1" stopColor="#FFE2A8" stopOpacity={0} />
              </radialGradient>
            </defs>
            <circle cx={540} cy={760} r={R + 120} fill="url(#rim)" opacity={rim * 0.6} />
          </svg>
          <div style={{ position: "absolute", left: 540 - R, top: 760 - R, width: R * 2, height: R * 2, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 8px #FFE2A8" }}>
            <Footage from={a} position="50% 28%" />
          </div>
          <Sea top={1250} colors={["#2E2463", "#140F33"]} glint="#FFE6B0" />
          <Boat x={tween(t, [0, b - a], [150, 930], inOut)} y={1330 + Math.sin(t / 20) * 6} scale={0.7} tilt={Math.sin(t / 24) * 5} />
          {/* "Mangal gaao": lanterns rise as the celebration line is sung (188.2 s) */}
          <Lanterns seed="ln" count={22} start={a + 6} />
        </>
      )}
    </Scene>
  );
};

export const Meeting: React.FC<SceneProps> = ({ range = LYRIC_SCENES.outro, bare }) => (
  <DawnBeach range={range} bare={bare} sunFrom={1060} sunTo={880}>
    {(t) => {
      const meet = 330;
      const walking = t < meet;
      return (
        <>
          <Walker x={tween(t, [0, meet], [120, 470], Easing.out(Easing.quad))} y={1530} scale={1.3} phase={t * 0.17} walking={walking} color="#1E1230" />
          <Walker x={tween(t, [0, meet], [960, 610], Easing.out(Easing.quad))} y={1530} scale={1.2} phase={t * 0.17 + 1.5} walking={walking} color="#1E1230" flip />
        </>
      );
    }}
  </DawnBeach>
);

export const LyricScenes: React.FC = () => (
  <>
    <NightHill />
    <DuskWalk />
    <NightCity />
    <CosmicBoat />
    <Spotlight />
    <Dawn />
    <PhotoInHands />
    <WindowAtDawn />
    <ProjectionRoom />
    <TilePath />
    <MoonPortal />
    <Meeting />
  </>
);

