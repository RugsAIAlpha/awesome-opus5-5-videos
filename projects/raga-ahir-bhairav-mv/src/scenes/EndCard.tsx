import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Letters, Mandala, Reveal, Rule, Wipe } from "../fx";
import {
  CAPS,
  CREAM,
  DEVA,
  GOLD,
  SAFFRON,
  SERIF,
  SHADOW,
  tween,
} from "../theme";
import { T, TOTAL, W } from "../timeline";

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const at = T.endCard;
  if (frame < at) return null;
  const until = TOTAL + 30; // stays up until the final fade to black
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: "#07050D",
          opacity: tween(frame, [at, at + 60], [0, 0.86]),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: W / 2,
          top: 780,
          translate: "-50% -50%",
        }}
      >
        <Mandala
          size={560}
          progress={tween(
            frame,
            [at + 10, at + 110],
            [0, 1],
            Easing.inOut(Easing.cubic),
          )}
          rotate={frame * 0.12}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1140,
          textAlign: "center",
        }}
      >
        <Letters
          text="RAGA"
          at={at + 30}
          until={until}
          stagger={4}
          style={{
            fontFamily: CAPS,
            fontSize: 34,
            letterSpacing: 18,
            color: GOLD,
          }}
        />
        <Letters
          text="Ahir Bhairav"
          at={at + 40}
          until={until}
          stagger={2}
          style={{
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 128,
            color: CREAM,
            textShadow: SHADOW,
          }}
        />
        <Reveal
          at={at + 60}
          until={until}
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: 62,
            color: CREAM,
          }}
        >
          Alabela Sajan Aayo Re
        </Reveal>
        <Rule at={at + 70} until={until} width={300} />
        <Wipe
          at={at + 80}
          until={until}
          style={{
            display: "inline-block",
            fontFamily: DEVA,
            fontSize: 66,
            color: SAFFRON,
          }}
        >
          धन्यवाद
        </Wipe>
        <Reveal
          at={at + 95}
          until={until}
          style={{
            fontFamily: CAPS,
            fontSize: 26,
            letterSpacing: 10,
            color: GOLD,
            marginTop: 12,
          }}
        >
          THANK YOU FOR LISTENING
        </Reveal>
      </div>
      <AbsoluteFill
        style={{
          backgroundColor: "black",
          opacity: tween(
            frame,
            [TOTAL - 24, TOTAL - 1],
            [0, 1],
            Easing.in(Easing.quad),
          ),
        }}
      />
    </AbsoluteFill>
  );
};
