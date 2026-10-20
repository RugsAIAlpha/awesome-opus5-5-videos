import React from "react";
import { useCurrentFrame } from "remotion";
import { SERIF, tween } from "../theme";
import { PHRASES } from "./lyrics";

const GOLD = "#F7C948";

// Word-by-word lyric line: words arrive as they are sung, the current one glows gold
export const Karaoke: React.FC<{ top?: number }> = ({ top = 1500 }) => {
  const frame = useCurrentFrame();
  const phrase = PHRASES.find((p) => frame >= p.start - 4 && frame < p.end + 24);
  if (!phrase) return null;
  const out = tween(frame, [phrase.end + 8, phrase.end + 24], [1, 0]);
  const current = phrase.words.reduce((idx, w, i) => (frame >= w.at ? i : idx), -1);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top, textAlign: "center", opacity: out }}>
      {phrase.words.map((w, i) => {
        const p = tween(frame, [w.at - 2, w.at + 8], [0, 1]);
        const lit = i === current && frame < phrase.end + 6;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              margin: "0 12px",
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: 66,
              lineHeight: 1.25,
              color: lit ? GOLD : "#FFF7EA",
              opacity: p,
              translate: `0px ${(1 - p) * 14}px`,
              scale: lit ? "1.06" : "1",
              textShadow: lit
                ? "0 0 22px rgba(247,201,72,0.55), 0 2px 10px rgba(0,0,0,0.55)"
                : "0 2px 12px rgba(0,0,0,0.6)",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
