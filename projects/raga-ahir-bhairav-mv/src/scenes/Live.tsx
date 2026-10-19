import React from "react";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { bandsAt, rmsAt } from "../audio";
import {
  Dust,
  Letters,
  Mandala,
  Reveal,
  Rule,
  TanpuraStrings,
  Vignette,
  Wipe,
} from "../fx";
import { CAPS, CREAM, DEVA, GOLD, SERIF, SHADOW, tween } from "../theme";
import { T, W, H } from "../timeline";
import { Swara, SWARAS } from "./Portrait";

const LiveFootage: React.FC = () => {
  // Frame inside this Sequence, mapped back to the absolute timeline
  const frame = useCurrentFrame() + T.videoStart;
  return (
    <AbsoluteFill
      style={{
        // Gentle push-in after the hand-off, easing back out before the outro dissolve
        scale: tween(
          frame,
          [
            T.dissolveInEnd,
            T.dissolveInEnd + 450,
            T.dissolveOutStart - 300,
            T.dissolveOutStart,
          ],
          [1, 1.05, 1.05, 1],
          Easing.inOut(Easing.sin),
        ),
      }}
    >
      <Video
        src={staticFile("source.mp4")}
        trimBefore={T.videoStart}
        muted
        style={{
          width: W,
          height: H,
          objectFit: "cover",
          filter: "contrast(1.06) saturate(1.1) sepia(0.12)",
        }}
      />
    </AbsoluteFill>
  );
};

export const LiveVideo: React.FC = () => (
  <Sequence
    from={T.videoStart}
    durationInFrames={T.videoEnd - T.videoStart}
    name="Live performance"
  >
    <LiveFootage />
  </Sequence>
);

// Text moments in the live section; the rising glyphs clear out while these are up
const MOMENTS = [
  [2870, 3150],
  [4490, 4770],
  [5540, 5890],
];

const quietness = (frame: number) =>
  MOMENTS.reduce(
    (q, [a, b]) =>
      Math.min(
        q,
        1 -
          tween(frame, [a - 20, a + 10], [0, 1]) *
            tween(frame, [b - 10, b + 20], [1, 0]),
      ),
    1,
  );

// Swara glyphs rising in lanes along the frame edges, brighter when the voice swells
const RisingSwaras: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const level = rmsAt(frame);
  const glyphs = ["सा", "रे", "ग", "म", "प", "ध", "नि"];
  const lanes = [60, 150, 240, 860, 950, 1030];
  return (
    <AbsoluteFill style={{ opacity: opacity * quietness(frame) }}>
      {Array.from({ length: 10 }).map((_, i) => {
        const period = 300 + random(`sw-${i}-p`) * 160;
        const shifted = frame + random(`sw-${i}-o`) * period;
        const cycle = Math.floor(shifted / period);
        const t = (shifted % period) / period;
        const r = (k: string) => random(`sw-${i}-${cycle}-${k}`);
        const x = lanes[(i + cycle) % lanes.length] + (r("x") - 0.5) * 40;
        const size = 46 + r("s") * 30;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: 1500 - t * 1000,
              translate: "-50% 0px",
              fontFamily: DEVA,
              fontSize: size,
              color: GOLD,
              rotate: `${Math.sin(frame * 0.03 + i) * 8}deg`,
              opacity: Math.sin(Math.PI * t) * (0.15 + 0.5 * level),
              textShadow:
                "0 0 18px rgba(255,190,100,0.7), 0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            {glyphs[Math.floor(r("g") * glyphs.length)]}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Soft dark pool behind live-section text, for contrast against bright footage
const Backdrop: React.FC<{
  at: number;
  until: number;
  x: number;
  y: number;
  w: number;
  h: number;
}> = ({ at, until, x, y, w, h }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > until + 20) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        opacity:
          tween(frame, [at, at + 30], [0, 1]) *
          tween(frame, [until - 10, until + 20], [1, 0]),
        background:
          "radial-gradient(ellipse closest-side, rgba(9,6,18,0.62) 0%, rgba(9,6,18,0.35) 55%, rgba(9,6,18,0) 100%)",
      }}
    />
  );
};

// Persistent raga badge, top-left
const CornerBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 3150;
  const end = 6330;
  if (frame < start || frame > end) return null;
  const o =
    tween(frame, [start, start + 40], [0, 1]) *
    tween(frame, [end - 40, end], [1, 0]);
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: o,
          background:
            "radial-gradient(ellipse 560px 200px at 220px 140px, rgba(9,6,18,0.5) 0%, rgba(9,6,18,0) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 92,
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: o,
        }}
      >
        <Mandala
          size={96}
          progress={tween(frame, [start, start + 90], [0, 1])}
          rotate={frame * 0.15}
        />
        <div>
          <div
            style={{
              fontFamily: CAPS,
              fontSize: 28,
              letterSpacing: 8,
              color: GOLD,
              textShadow: SHADOW,
            }}
          >
            AHIR BHAIRAV
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: 34,
              color: CREAM,
              textShadow: SHADOW,
            }}
          >
            Alabela Sajan Aayo Re
          </div>
        </div>
      </div>
    </>
  );
};

const LowerThird: React.FC = () => {
  const at = 2880;
  const until = 3140;
  return (
    <div style={{ position: "absolute", left: 70, top: 1440 }}>
      <Rule at={at} until={until} width={420} align="left" />
      <Letters
        text="LIVE · RAGA"
        at={at + 8}
        until={until}
        stagger={2}
        style={{
          fontFamily: CAPS,
          fontSize: 30,
          letterSpacing: 12,
          color: GOLD,
          textShadow: SHADOW,
        }}
      />
      <Letters
        text="Ahir Bhairav"
        at={at + 18}
        until={until}
        stagger={3}
        style={{
          fontFamily: SERIF,
          fontWeight: 600,
          fontSize: 116,
          lineHeight: 1.05,
          color: CREAM,
          textShadow: SHADOW,
        }}
      />
      <Reveal
        at={at + 50}
        until={until}
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 46,
          color: CREAM,
          textShadow: SHADOW,
        }}
      >
        Bandish — Alabela Sajan Aayo Re
      </Reveal>
    </div>
  );
};

// Mid-song title moment
const BandishMoment: React.FC = () => {
  const frame = useCurrentFrame();
  const at = 4500;
  const until = 4760;
  if (frame < at || frame > until + 1) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: W / 2,
          top: 1480,
          translate: "-50% -50%",
        }}
      >
        <Mandala
          size={520}
          progress={tween(frame, [at, at + 120], [0, 1])}
          rotate={frame * 0.1}
          opacity={0.4 * tween(frame, [until - 20, until], [1, 0])}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1380,
          textAlign: "center",
        }}
      >
        <Wipe
          at={at + 10}
          until={until}
          dur={50}
          style={{
            display: "inline-block",
            fontFamily: DEVA,
            fontSize: 104,
            color: GOLD,
            textShadow: `0 0 30px rgba(255,190,100,0.5), ${SHADOW}`,
          }}
        >
          अलबेला सजन आयो रे
        </Wipe>
        <Reveal
          at={at + 60}
          until={until}
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 48,
            color: CREAM,
            textShadow: SHADOW,
            marginTop: 10,
          }}
        >
          “the charming beloved has arrived”
        </Reveal>
      </div>
    </>
  );
};

// Sargam strip whose notes light up with the spectrum
const SargamStrip: React.FC = () => {
  const frame = useCurrentFrame();
  const at = 5550;
  const until = 5880;
  if (frame < at || frame > until + 1) return null;
  const b = bandsAt(frame);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1420,
        textAlign: "center",
      }}
    >
      <Letters
        text="THE SWARAS OF AHIR BHAIRAV"
        at={at}
        until={until}
        stagger={1}
        style={{
          fontFamily: CAPS,
          fontSize: 28,
          letterSpacing: 8,
          color: GOLD,
          textShadow: SHADOW,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          marginTop: 24,
        }}
      >
        {SWARAS.map((note, i) => {
          const glow = Math.min(1, Math.pow((b[i * 2] + b[i * 2 + 1]) / 2, 2));
          return (
            <Reveal key={i} at={at + 20 + i * 6} until={until} dy={40}>
              <div
                style={{
                  scale: `${1 + glow * 0.18}`,
                  opacity: 0.55 + glow * 0.45,
                }}
              >
                <Swara note={note} size={70} glow={glow} />
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
};

export const LiveOverlays: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.dissolveInStart || frame > T.dissolveOutEnd) return null;
  const g =
    tween(frame, [2790, 2850], [0, 1]) * tween(frame, [6380, 6420], [1, 0]);
  return (
    <AbsoluteFill>
      {/* Warm grade and framing */}
      <AbsoluteFill
        style={{
          opacity: g * 0.55,
          mixBlendMode: "soft-light",
          background:
            "linear-gradient(160deg, rgba(255,170,80,0.7) 0%, rgba(255,140,70,0.3) 45%, rgba(90,40,140,0.5) 100%)",
        }}
      />
      <AbsoluteFill style={{ opacity: g }}>
        <Vignette strength={0.55} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: g,
          background:
            "linear-gradient(to top, rgba(9,6,18,0.82) 0%, rgba(9,6,18,0) 34%), linear-gradient(to bottom, rgba(9,6,18,0.5) 0%, rgba(9,6,18,0) 14%)",
        }}
      />
      <RisingSwaras opacity={g} />
      <Dust count={26} seed="live" opacity={g} />
      <TanpuraStrings y={1800} opacity={g * 0.8} />
      <Backdrop at={2870} until={3140} x={330} y={1600} w={1000} h={520} />
      <Backdrop at={4500} until={4760} x={540} y={1480} w={1150} h={480} />
      <Backdrop at={5550} until={5880} x={540} y={1540} w={1150} h={460} />
      <CornerBadge />
      <LowerThird />
      <BandishMoment />
      <SargamStrip />
    </AbsoluteFill>
  );
};
