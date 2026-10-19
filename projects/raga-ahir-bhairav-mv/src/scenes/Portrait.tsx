import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { rmsAt } from "../audio";
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
import {
  CAPS,
  CREAM,
  DEVA,
  GOLD,
  INK,
  SAFFRON,
  SERIF,
  SHADOW,
  tween,
} from "../theme";
import { T, W, H } from "../timeline";

const kicker: React.CSSProperties = {
  fontFamily: CAPS,
  fontSize: 34,
  letterSpacing: 18,
  color: GOLD,
  textShadow: SHADOW,
};
const display: React.CSSProperties = {
  fontFamily: SERIF,
  fontWeight: 600,
  fontSize: 140,
  lineHeight: 1,
  color: CREAM,
  textShadow: SHADOW,
};
const italic: React.CSSProperties = {
  fontFamily: SERIF,
  fontStyle: "italic",
  fontWeight: 500,
  color: CREAM,
  textShadow: SHADOW,
};
const deva: React.CSSProperties = {
  display: "inline-block",
  fontFamily: DEVA,
  fontSize: 62,
  color: SAFFRON,
  textShadow: SHADOW,
};

// Text area over the lower (chest) half of the portrait
const Stage: React.FC<{ top?: number; children: React.ReactNode }> = ({
  top = 1130,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top,
      textAlign: "center",
    }}
  >
    {children}
  </div>
);

export const SWARAS = [
  { dev: "सा", lat: "Sa" },
  { dev: "रे", lat: "Re", komal: true },
  { dev: "ग", lat: "Ga" },
  { dev: "म", lat: "Ma" },
  { dev: "प", lat: "Pa" },
  { dev: "ध", lat: "Dha" },
  { dev: "नि", lat: "Ni", komal: true },
  { dev: "सां", lat: "Sa", taar: true },
];

// A single swara glyph; komal notes get a saffron underline, taar Sa a dot above
export const Swara: React.FC<{
  note: (typeof SWARAS)[number];
  size: number;
  glow: number;
}> = ({ note, size, glow }) => (
  <div style={{ textAlign: "center", width: size * 1.4 }}>
    <div
      style={{
        fontFamily: DEVA,
        fontSize: size,
        lineHeight: 1.1,
        color: note.komal ? SAFFRON : CREAM,
        textShadow: `0 0 ${12 + glow * 40}px rgba(255,200,110,${0.25 + glow * 0.6}), ${SHADOW}`,
      }}
    >
      {note.dev}
    </div>
    <div
      style={{
        height: 4,
        width: size * 0.6,
        margin: "4px auto 8px",
        borderRadius: 2,
        background: note.komal ? SAFFRON : "transparent",
      }}
    />
    <div
      style={{
        position: "relative",
        fontFamily: CAPS,
        fontSize: size * 0.34,
        color: GOLD,
        textShadow: SHADOW,
      }}
    >
      {note.taar ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -8,
            width: 7,
            height: 7,
            marginLeft: -3.5,
            borderRadius: "50%",
            background: GOLD,
          }}
        />
      ) : null}
      {note.lat}
    </div>
  </div>
);

const Aaroh: React.FC = () => {
  const frame = useCurrentFrame();
  const start = 1200;
  const until = 1670;
  if (frame < start || frame > until + 1) return null;
  const sweepStart = 1420;
  const active =
    frame >= sweepStart ? Math.floor((frame - sweepStart) / 14) % 10 : -1;
  return (
    <>
      <Stage top={1120}>
        <Letters
          text="AAROH"
          at={start}
          until={until}
          stagger={3}
          style={kicker}
        />
        <Reveal
          at={start + 12}
          until={until}
          style={{ ...italic, fontSize: 52, marginTop: 10 }}
        >
          the ascending scale
        </Reveal>
      </Stage>
      {SWARAS.map((note, i) => {
        const x = 150 + i * 111;
        const y = 1560 - i * 30;
        const lit = active === i ? 1 : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              translate: "-50% -50%",
              scale: `${1 + lit * 0.16}`,
            }}
          >
            <Reveal at={start + 30 + i * 14} until={until} dy={60}>
              <Swara note={note} size={78} glow={lit} />
            </Reveal>
          </div>
        );
      })}
      <Stage top={1690}>
        <Reveal
          at={start + 170}
          until={until}
          style={{ ...italic, fontSize: 40, color: GOLD }}
        >
          Re and Ni are komal — softened, flattened
        </Reveal>
      </Stage>
    </>
  );
};

const RagaFacts: React.FC = () => {
  const rows = [
    { label: "PRAHAR", value: "Dawn · the first light" },
    { label: "THAAT", value: "Bhairav" },
    { label: "VADI · SAMVADI", value: "Ma · Sa" },
  ];
  const at = 690;
  const until = 1100;
  return (
    <Stage top={1110}>
      <Letters
        text="THE RAGA"
        at={at}
        until={until}
        stagger={3}
        style={kicker}
      />
      <Rule at={at + 10} until={until} width={300} />
      {rows.map((row, i) => (
        <Reveal
          key={row.label}
          at={at + 30 + i * 50}
          until={until}
          style={{ marginTop: 26 }}
        >
          <div
            style={{
              fontFamily: CAPS,
              fontSize: 28,
              letterSpacing: 10,
              color: GOLD,
              textShadow: SHADOW,
            }}
          >
            {row.label}
          </div>
          <div
            style={{ ...display, fontSize: 76, fontWeight: 500, marginTop: 4 }}
          >
            {row.value}
          </div>
        </Reveal>
      ))}
    </Stage>
  );
};

export const PortraitScene: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > T.portraitEnd + 1) return null;
  const level = rmsAt(frame);
  const end = T.portraitEnd;

  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      {/* Slow push-in towards the face */}
      <AbsoluteFill
        style={{
          scale: tween(frame, [0, end], [1.02, 1.16], Easing.inOut(Easing.sin)),
          translate: `${tween(frame, [0, end], [0, -16], Easing.inOut(Easing.sin))}px 0px`,
          transformOrigin: "50% 26%",
        }}
      >
        <Img
          src={staticFile("portrait.jpg")}
          style={{ width: W, height: H, objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Lantern glow breathing with the music, and a drifting light leak */}
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          background: `radial-gradient(circle at 6% 34%, rgba(255,184,92,${0.22 + 0.38 * level}) 0%, rgba(255,150,60,0) 30%)`,
        }}
      />
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          opacity: 0.3 + 0.15 * Math.sin(frame / 90),
          background: `radial-gradient(ellipse 60% 40% at ${72 + 20 * Math.sin(frame / 240)}% ${10 + 8 * Math.cos(frame / 300)}%, rgba(255,170,90,0.5), rgba(255,120,60,0) 70%)`,
        }}
      />
      <Vignette strength={0.7} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(9,6,18,0.94) 0%, rgba(9,6,18,0.62) 28%, rgba(9,6,18,0) 52%)",
        }}
      />
      <Dust
        count={42}
        seed="portrait"
        opacity={tween(frame, [20, 120], [0, 1])}
      />

      {/* 1 · Raga title */}
      <div
        style={{
          position: "absolute",
          left: W / 2,
          top: 1390,
          translate: "-50% -50%",
        }}
      >
        {frame < 270 ? (
          <Mandala
            size={660}
            progress={tween(
              frame,
              [15, 150],
              [0, 1],
              Easing.inOut(Easing.cubic),
            )}
            rotate={frame * 0.08}
            opacity={0.38 * tween(frame, [240, 268], [1, 0])}
          />
        ) : null}
      </div>
      <Stage top={1180}>
        <Letters text="RAGA" at={40} until={262} stagger={4} style={kicker} />
        <Letters
          text="Ahir Bhairav"
          at={55}
          until={262}
          stagger={3}
          style={{ ...display, marginTop: 18 }}
        />
        <Rule at={100} until={262} width={280} />
        <Wipe at={110} until={262} style={deva}>
          राग अहीर भैरव
        </Wipe>
      </Stage>

      {/* 2 · The bandish */}
      <Stage top={1140}>
        <Letters
          text="THE BANDISH"
          at={330}
          until={592}
          stagger={3}
          style={kicker}
        />
        <Reveal
          at={348}
          until={592}
          style={{ ...italic, fontSize: 124, lineHeight: 1, marginTop: 22 }}
        >
          Alabela Sajan
        </Reveal>
        <Reveal
          at={366}
          until={592}
          style={{ ...italic, fontSize: 124, lineHeight: 1 }}
        >
          Aayo Re
        </Reveal>
        <Rule at={400} until={592} width={280} />
        <Wipe at={410} until={592} style={deva}>
          अलबेला सजन आयो रे
        </Wipe>
      </Stage>

      {/* 3 · Raga facts */}
      <RagaFacts />

      {/* 4 · Ascending scale */}
      <Aaroh />

      {/* 5 · Mood line */}
      <Stage top={1210}>
        <Letters
          text="PRATAH · MORNING RAGA"
          at={1760}
          until={2100}
          stagger={2}
          style={{ ...kicker, fontSize: 28, letterSpacing: 10 }}
        />
        <Reveal
          at={1785}
          until={2100}
          style={{ ...italic, fontSize: 80, marginTop: 26 }}
        >
          A morning raga,
        </Reveal>
        <Reveal at={1815} until={2100} style={{ ...italic, fontSize: 80 }}>
          sung as night
        </Reveal>
        <Reveal at={1845} until={2100} style={{ ...italic, fontSize: 80 }}>
          gives way to first light.
        </Reveal>
      </Stage>

      {/* 6 · Invitation, blooming into the transition */}
      <div
        style={{
          position: "absolute",
          left: W / 2,
          top: 1380,
          translate: "-50% -50%",
        }}
      >
        {frame >= 2160 ? (
          <Mandala
            size={tween(
              frame,
              [2160, end],
              [420, 980],
              Easing.inOut(Easing.sin),
            )}
            progress={tween(
              frame,
              [2160, 2300],
              [0, 1],
              Easing.inOut(Easing.cubic),
            )}
            rotate={frame * -0.1}
            opacity={0.45}
          />
        ) : null}
      </div>
      <Stage top={1250}>
        <Reveal at={2180} until={2470} style={{ ...italic, fontSize: 84 }}>
          Close your eyes.
        </Reveal>
        <Letters
          text="Listen."
          at={2240}
          until={2470}
          stagger={5}
          style={{ ...display, fontSize: 160, color: GOLD }}
        />
      </Stage>

      <TanpuraStrings
        y={1800}
        opacity={
          tween(frame, [60, 150], [0, 0.85]) *
          tween(frame, [end - 60, end], [1, 0])
        }
      />

      {/* Fade up from black */}
      <AbsoluteFill
        style={{
          backgroundColor: "black",
          opacity: tween(frame, [0, 45], [1, 0]),
        }}
      />
    </AbsoluteFill>
  );
};
