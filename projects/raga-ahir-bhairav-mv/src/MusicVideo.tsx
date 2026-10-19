import React from "react";
import { AbsoluteFill } from "remotion";
import { EndCard } from "./scenes/EndCard";
import { LiveOverlays, LiveVideo } from "./scenes/Live";
import { PortraitScene } from "./scenes/Portrait";
import { HandoffGlow, SunFlash, TitleCardScene } from "./scenes/TitleCard";
import { INK } from "./theme";

// Layers are ordered back to front; each one shows itself only inside its own time window.
// The soundtrack is muxed back in from the source after rendering, so it stays bit-exact.
export const MusicVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: INK }}>
    <LiveVideo />
    <PortraitScene />
    <TitleCardScene />
    <LiveOverlays />
    <HandoffGlow />
    <SunFlash />
    <EndCard />
  </AbsoluteFill>
);
