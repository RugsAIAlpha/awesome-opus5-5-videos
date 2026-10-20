import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Flash, LightLeaks } from "../cine";
import { tween } from "../theme";
import { TOTAL } from "../timeline";
import { GrainPlates, Scanlines } from "./props";
import { Shots } from "./shots";

// Vox-style paper-collage cut: the illustrated story and the live performance as prints, phones,
// monitors and clippings on real-world surfaces. No on-screen text.
// The soundtrack is muxed back in from the source after rendering.
export const VoxVideo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#1A1410" }}>
      <Shots />
      {/* Warm, slightly faded print grade */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,214,160,0.10), rgba(120,70,40,0.12))", mixBlendMode: "soft-light" }} />
      <AbsoluteFill style={{ background: "rgba(255,244,228,0.05)" }} />
      <LightLeaks opacity={0.28} seed="vox" />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 62% at 50% 48%, rgba(0,0,0,0) 52%, rgba(20,10,4,0.55) 100%)" }} />
      <Scanlines opacity={0.12} />
      <GrainPlates opacity={0.32} />
      <Flash at={2820} half={10} />
      <Flash at={6405} half={10} />
      <AbsoluteFill style={{ background: "#000", opacity: tween(frame, [0, 24], [1, 0]) + tween(frame, [TOTAL - 30, TOTAL - 1], [0, 1]) }} />
    </AbsoluteFill>
  );
};
