import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { kickAt } from "../audio";
import { CosmicBoat, Dawn, DuskWalk, Footage, Meeting, MoonPortal, NightCity, NightHill, PhotoInHands, ProjectionRoom, Range, SceneProps, Spotlight, TilePath, WindowAtDawn } from "../lyric/scenes";
import { tween } from "../theme";
import { TOTAL } from "../timeline";
import {
  Arrow,
  Boil,
  Coffee,
  CRT,
  Fit,
  MarkerCircle,
  Newspaper,
  NoteBubble,
  Papers,
  PhoneInHand,
  Pin,
  Plant,
  Pop,
  Print,
  RedString,
  shake,
  Stamp,
  StickyNote,
  Surface,
  Tape,
} from "./props";

// What goes inside a print, phone or monitor: an illustrated scene or the live footage
type Content = (r: Range, w: number, h: number) => React.ReactNode;
const footage: Content = ([a]) => <Footage from={a} />;
const scene =
  (C: React.FC<SceneProps>): Content =>
  (r, w, h) => (
    <Fit w={w} h={h}>
      <C range={r} bare />
    </Fit>
  );

type SetupProps = { r: Range; c: Content; seed: string; side?: Content };

const useLocal = (r: Range) => {
  const frame = useCurrentFrame();
  return { frame, t: frame - r[0], dur: r[1] - r[0] };
};

// ─── Set-ups ─────────────────────────────────────────────────────────────────

// Top-down desk: a print slides in over coffee and papers, a sticky note follows
const DeskSlide: React.FC<SetupProps> = ({ r, c, seed }) => {
  const { t } = useLocal(r);
  const a = r[0];
  return (
    <>
      <Surface t="desk" blur={tween(t, [4, 20], [0, 3])} />
      <Coffee x={170} y={250} s={0.85} />
      <Papers x={560} y={1480} rot={9} />
      <Pop at={a + 2} from={{ y: 1500, r: 16, s: 1 }} dur={18}>
        <Boil seed={seed}>
          <Print x={540} y={880} w={780} h={1270} rot={-3}>
            {c(r, 740, 1230)}
          </Print>
        </Boil>
      </Pop>
      <Pop at={a + 20} from={{ s: 0.2, r: -30 }} dur={14}>
        <StickyNote x={850} y={1580} rot={9} doodle={tween(t, [26, 60], [0, 1])} />
      </Pop>
      <Arrow x1={760} y1={1500} x2={660} y2={1400} bend={-120} progress={tween(t, [40, 58], [0, 1])} />
    </>
  );
};

// Corkboard: a print pinned up, a loop of red marker and a string to a note
const CorkPinned: React.FC<SetupProps> = ({ r, c, seed }) => {
  const { t } = useLocal(r);
  const a = r[0];
  return (
    <>
      <Surface t="cork" blur={tween(t, [4, 20], [0, 2.5])} />
      <Pop at={a + 1} from={{ s: 1.35, r: -6 }} dur={14}>
        <Boil seed={seed}>
          <Print x={540} y={800} w={720} h={1120} rot={2}>
            {c(r, 680, 1080)}
          </Print>
        </Boil>
      </Pop>
      <Pop at={a + 12} from={{ s: 0.1 }} dur={10}>
        <Pin x={250} y={270} />
        <Pin x={830} y={290} color="#2F6FD6" />
      </Pop>
      <Pop at={a + 22} from={{ x: -400, r: -20, s: 0.8 }} dur={14}>
        <StickyNote x={250} y={1600} rot={-7} color="#FFB3C7" doodle={tween(t, [30, 64], [0, 1])} />
        <Pin x={250} y={1500} color="#F6C445" />
      </Pop>
      <RedString a={[830, 290]} b={[250, 1500]} progress={tween(t, [30, 60], [0, 1])} />
      <MarkerCircle cx={560} cy={760} rx={300} ry={330} progress={tween(t, [36, 56], [0, 1])} seed={seed} />
    </>
  );
};

// Graph paper: a big print taped down, pencil arrows sketched around it
const GraphTaped: React.FC<SetupProps> = ({ r, c, seed }) => {
  const { t } = useLocal(r);
  const a = r[0];
  return (
    <>
      <Surface t="graph" blur={tween(t, [4, 20], [0, 2])} />
      <Pop at={a + 1} from={{ x: 900, r: 20, s: 0.9 }} dur={16}>
        <Boil seed={seed}>
          <Print x={540} y={900} w={840} h={1330} rot={-2} border={18}>
            {c(r, 804, 1294)}
          </Print>
        </Boil>
      </Pop>
      <Pop at={a + 14} from={{ s: 0.2 }} dur={10}>
        <Tape x={170} y={260} rot={-35} />
        <Tape x={910} y={250} rot={32} />
      </Pop>
      <Arrow x1={140} y1={1760} x2={300} y2={1530} bend={90} progress={tween(t, [24, 44], [0, 1])} />
      <Arrow x1={950} y1={1780} x2={820} y2={1560} bend={-90} progress={tween(t, [30, 50], [0, 1])} />
    </>
  );
};

// Office wall: the content plays on an old CRT, a speech bubble of notes pops out
const WallMonitor: React.FC<SetupProps> = ({ r, c, seed }) => {
  const { t } = useLocal(r);
  const a = r[0];
  return (
    <>
      <Surface t="wall" blur={tween(t, [4, 20], [0, 2.5])} />
      <div style={{ position: "absolute", left: 0, top: 1290, width: 1080, height: 630, overflow: "hidden", boxShadow: "0 -6px 18px rgba(0,0,0,0.3)" }}>
        <Surface t="desk" />
      </div>
      <Plant x={940} y={1300} s={1.1} />
      <Pop at={a + 2} from={{ y: 900, s: 1 }} dur={16}>
        <Boil seed={seed}>
          <CRT x={520} y={980} s={1.18}>
            {c(r, 576, 426)}
          </CRT>
        </Boil>
      </Pop>
      <Pop at={a + 18} from={{ s: 0.1, r: -15 }} dur={14} origin="30% 30%">
        <NoteBubble x={300} y={430} s={1.1} />
      </Pop>
    </>
  );
};

// A hand slides a phone up into frame over a blurred desk, like the reference
const PhoneHand: React.FC<SetupProps> = ({ r, c, seed }) => {
  const { t } = useLocal(r);
  const a = r[0];
  return (
    <>
      <Surface t="desk" blur={tween(t, [0, 14], [1, 7])} />
      <div style={{ position: "absolute", inset: 0, filter: `blur(${tween(t, [0, 14], [1, 6])}px)` }}>
        <Coffee x={220} y={300} />
        <Papers x={520} y={180} rot={-6} />
      </div>
      <Pop at={a} from={{ y: 1300, r: -10, s: 1 }} dur={18} origin="50% 100%">
        <Boil seed={seed} amount={0.6}>
          <PhoneInHand x={560} y={960} rot={-3}>
            {c(r, 488, 988)}
          </PhoneInHand>
        </Boil>
      </Pop>
      <Pop at={a + 16} from={{ s: 0.1, r: 20 }} dur={14} origin="20% 80%">
        <NoteBubble x={290} y={330} s={1} />
      </Pop>
    </>
  );
};

// Newspaper clipping with a halftone photo, highlighted and circled in red
const NewsClip: React.FC<SetupProps> = ({ r, c, seed }) => {
  const { t } = useLocal(r);
  const a = r[0];
  return (
    <>
      <Surface t="graph" blur={tween(t, [4, 20], [0, 2])} />
      <Pop at={a + 1} from={{ y: -1500, r: -14, s: 1 }} dur={16}>
        <Boil seed={seed}>
          <Newspaper x={540} y={930} rot={-3} photo={c(r, 520, 600)} highlight={tween(t, [16, 34], [0, 1])} />
        </Boil>
      </Pop>
      <MarkerCircle cx={406} cy={930} rx={330} ry={370} progress={tween(t, [26, 46], [0, 1])} seed={seed} />
      <Arrow x1={960} y1={1700} x2={760} y2={1220} bend={-110} progress={tween(t, [34, 54], [0, 1])} color="#D7263D" />
    </>
  );
};

// Corkboard: a polaroid of the content with two small prints, joined by red string
const PolaroidBoard: React.FC<SetupProps> = ({ r, c, seed, side }) => {
  const { t } = useLocal(r);
  const a = r[0];
  return (
    <>
      <Surface t="cork" blur={tween(t, [4, 20], [0, 2.5])} />
      <Pop at={a + 1} from={{ s: 1.4, r: 8 }} dur={14}>
        <Boil seed={seed}>
          <Print x={540} y={740} w={660} h={900} rot={-3} border={22} bottom={150}>
            {c(r, 616, 728)}
          </Print>
        </Boil>
      </Pop>
      {side ? (
        <Pop at={a + 12} from={{ x: -500, r: -25, s: 0.8 }} dur={14}>
          <Print x={250} y={1520} w={360} h={500} rot={-8} edge="stamp" border={26}>
            {side(r, 308, 448)}
          </Print>
          <Pin x={250} y={1300} color="#2F6FD6" />
        </Pop>
      ) : null}
      <Pop at={a + 18} from={{ x: 500, r: 25, s: 0.8 }} dur={14}>
        <StickyNote x={830} y={1540} rot={6} doodle={tween(t, [26, 60], [0, 1])} />
        <Pin x={830} y={1440} color="#F6C445" />
      </Pop>
      <Pin x={540} y={310} />
      <Pin x={262} y={1150} color="#2F6FD6" />
      <Pin x={808} y={1140} color="#F6C445" />
      <RedString a={[262, 1150]} b={[250, 1300]} progress={tween(t, [24, 44], [0, 1])} />
      <RedString a={[808, 1140]} b={[830, 1440]} progress={tween(t, [30, 50], [0, 1])} />
    </>
  );
};

// A huge cut-out slammed onto paper with a shake, taped at the corners, stamped
const FullCutout: React.FC<SetupProps> = ({ r, c, seed }) => {
  const { frame } = useLocal(r);
  const a = r[0];
  return (
    <div style={{ position: "absolute", inset: 0, translate: frame < a + 28 ? shake(frame, a + 8, 22) : shake(frame, a + 29, 14) }}>
      <Surface t="paper" />
      <Pop at={a} from={{ s: 1.35 }} dur={8}>
        <Boil seed={seed} amount={0.7}>
          <Print x={540} y={930} w={940} h={1580} rot={1.5} border={24}>
            {c(r, 892, 1532)}
          </Print>
        </Boil>
      </Pop>
      <Pop at={a + 10} from={{ s: 0.2 }} dur={8}>
        <Tape x={110} y={190} rot={-40} />
        <Tape x={980} y={190} rot={40} />
        <Tape x={110} y={1690} rot={40} />
        <Tape x={980} y={1690} rot={-40} />
      </Pop>
      <Stamp x={860} y={1580} at={a + 22} size={300} />
    </div>
  );
};

// ─── Shot list ───────────────────────────────────────────────────────────────

type Shot = { r: Range; Setup: React.FC<SetupProps>; c: Content; side?: Content };

const B = (r: Range, Setup: React.FC<SetupProps>, c: Content, side?: Content): Shot => ({ r, Setup, c, side });

export const SHOTS: Shot[] = [
  // Alaap: illustrated story prints moving across desks and boards
  B([0, 200], DeskSlide, scene(NightHill)),
  B([200, 420], CorkPinned, scene(NightHill)),
  B([420, 640], GraphTaped, scene(DuskWalk)),
  B([640, 860], WallMonitor, scene(DuskWalk)),
  B([860, 1080], PhoneHand, scene(NightCity)),
  B([1080, 1260], NewsClip, scene(NightCity)),
  B([1260, 1440], PolaroidBoard, scene(NightCity), scene(NightHill)),
  B([1440, 1680], DeskSlide, scene(CosmicBoat)),
  B([1680, 1920], GraphTaped, scene(CosmicBoat)),
  B([1920, 2200], WallMonitor, scene(Spotlight)),
  B([2200, 2479], CorkPinned, scene(Spotlight)),
  B([2479, 2660], DeskSlide, scene(Dawn)),
  B([2660, 2820], FullCutout, scene(Dawn)),
  // Bandish: the live performance, cutting on vocal phrases
  B([2820, 3000], FullCutout, footage),
  B([3000, 3165], PhoneHand, footage),
  B([3165, 3375], PolaroidBoard, footage, scene(DuskWalk)),
  B([3375, 3546], DeskSlide, scene(PhotoInHands)),
  B([3546, 3792], GraphTaped, scene(WindowAtDawn)),
  B([3792, 3927], NewsClip, footage),
  B([3927, 4170], WallMonitor, footage),
  B([4170, 4404], CorkPinned, scene(ProjectionRoom)),
  B([4404, 4548], PhoneHand, footage),
  B([4548, 4722], FullCutout, footage),
  B([4722, 4860], PolaroidBoard, footage, scene(NightCity)),
  B([4860, 4941], NewsClip, footage),
  B([4941, 5220], DeskSlide, scene(TilePath)),
  B([5220, 5289], PhoneHand, footage),
  B([5289, 5448], WallMonitor, footage),
  B([5448, 5646], PolaroidBoard, footage, scene(CosmicBoat)),
  B([5646, 5811], GraphTaped, scene(MoonPortal)),
  B([5811, 5931], NewsClip, footage),
  B([5931, 5997], FullCutout, footage),
  B([5997, 6159], DeskSlide, scene(MoonPortal)),
  B([6159, 6258], PhoneHand, footage),
  B([6258, 6336], PolaroidBoard, footage, scene(Dawn)),
  B([6336, 6405], FullCutout, footage),
  // Outro
  B([6405, TOTAL], DeskSlide, scene(Meeting)),
];

// Camera per shot: whip in with motion blur, punch-zoom kick, slow push, music pulse
const ShotCamera: React.FC<{ r: Range; index: number; children: React.ReactNode }> = ({ r, index, children }) => {
  const frame = useCurrentFrame();
  const t = frame - r[0];
  const dur = r[1] - r[0];
  const dir = index % 2 ? 1 : -1;
  const whip = tween(t, [0, 7], [1, 0], Easing.out(Easing.cubic));
  const kick = 0.07 * Math.exp(-t / 5);
  const push = (t / dur) * 0.06;
  return (
    <AbsoluteFill
      style={{
        translate: `${dir * 300 * whip}px 0px`,
        scale: `${1 + kick + push + kickAt(frame) * 0.012}`,
        rotate: `${dir * 0.6 * (t / dur)}deg`,
        filter: whip > 0.02 ? `blur(${(whip * 14).toFixed(1)}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Shots: React.FC = () => {
  const frame = useCurrentFrame();
  const index = SHOTS.findIndex((s) => frame >= s.r[0] && frame < s.r[1]);
  if (index < 0) return null;
  const { r, Setup, c, side } = SHOTS[index];
  return (
    <ShotCamera key={index} r={r} index={index}>
      <Setup r={r} c={c} side={side} seed={`shot${index}`} />
    </ShotCamera>
  );
};
