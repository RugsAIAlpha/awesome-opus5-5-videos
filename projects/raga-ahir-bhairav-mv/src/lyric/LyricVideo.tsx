import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tween } from "../theme";
import { TOTAL } from "../timeline";
import { LyricScenes } from "./scenes";

// Illustrated music video: story scenes throughout, with the live performance framed inside them. The soundtrack is muxed back in from the source after rendering.
export const LyricVideo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0818" }}>
      <LyricScenes />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 65% at 50% 46%, rgba(0,0,0,0) 60%, rgba(10,6,24,0.45) 100%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: tween(frame, [0, 30], [1, 0]) + tween(frame, [TOTAL - 30, TOTAL - 1], [0, 1]) }} />
    </AbsoluteFill>
  );
};
