import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TanpuraStrings } from "./fx";
import { Flash, Grain, Letterbox } from "./cine";
import { Intro } from "./scenes/Intro";
import { Live } from "./scenes/Live";
import { Outro } from "./scenes/Outro";
import { CAPS, GOLD, tween } from "./theme";
import { CUTS, H, LETTERBOX, SCENES, W } from "./timeline";

const BarLabels: React.FC = () => {
  const frame = useCurrentFrame();
  const live = frame >= SCENES.live[0] && frame < SCENES.live[1];
  const style: React.CSSProperties = {
    position: "absolute",
    top: LETTERBOX / 2 - 12,
    fontFamily: CAPS,
    fontSize: 22,
    letterSpacing: "0.32em",
    color: GOLD,
    opacity: 0.85,
  };
  return (
    <>
      <div style={{ ...style, left: 44 }}>RAGA AHIR BHAIRAV</div>
      <div style={{ ...style, right: 44, display: "flex", alignItems: "center", gap: 12 }}>
        {live ? (
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              background: "#FF3B3B",
              opacity: Math.floor(frame / 15) % 2 ? 1 : 0.35,
            }}
          />
        ) : null}
        {live ? "LIVE" : "ALABELA SAJAN AAYO RE"}
      </div>
    </>
  );
};

// Back to front: 3D scenes / footage, film grain, cinema bars, cut flashes.
// The soundtrack is muxed back in from the source after rendering, so it stays bit-exact.
export const MusicVideo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Intro />
      <Live />
      <Outro />
      <Grain opacity={0.16} />
      <Letterbox amount={tween(frame, [0, 50], [3, 1])} top={<BarLabels />} />
      <TanpuraStrings y={H - LETTERBOX / 2 + 6} opacity={0.9} />
      {CUTS.map((at) => (
        <Flash key={at} at={at} half={at === SCENES.live[0] || at === SCENES.live[1] ? 20 : 12} />
      ))}
      {/* Open from black */}
      <AbsoluteFill style={{ background: "#000", opacity: tween(frame, [0, 40], [1, 0]), width: W }} />
    </AbsoluteFill>
  );
};
