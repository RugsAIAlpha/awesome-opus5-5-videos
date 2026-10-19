import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { rmsAt } from "../audio";
import { CaptionBlock, CaptionShade, Cine, CineVignette } from "../cine";
import { CameraRig, Nebula, Scene3D, StarField, Sun } from "../three/core";
import { GoldRing, Mandala3D } from "../three/objects";
import { DEVA, GOLD, SAFFRON, tween } from "../theme";
import { SCENES, TOTAL } from "../timeline";

const inOut = Easing.inOut(Easing.sin);

// The lotus seen from above, the camera pulling away as the petals fold back into a bud
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const [start] = SCENES.outro;
  if (frame < start) return null;
  const local = frame - start;
  const energy = rmsAt(frame);
  const R = tween(local, [0, TOTAL - start], [15, 30], inOut);
  const a = local * 0.0035;
  return (
    <AbsoluteFill>
      <Scene3D background="#05030C" bloom={0.9}>
        <CameraRig position={[R * 0.35 * Math.sin(a), R * 0.2 + 1, R]} target={[0, 0, 0]} roll={local * 0.0012} />
        <ambientLight intensity={0.25} />
        <pointLight position={[0, 0, 3]} intensity={6 + energy * 10} color="#FFB060" distance={40} />
        <directionalLight position={[6, 9, 8]} intensity={1.3} color="#FFE6C0" />
        <directionalLight position={[-8, -4, 4]} intensity={1.1} color="#B070FF" />
        <group rotation={[-0.3, 0, 0]}>
          <Mandala3D open={tween(local, [0, 330, 470], [1, 1, 0.25], inOut)} spin={local * 0.004} energy={energy} />
          <Sun position={[0, 0, 0.35]} radius={0.42} energy={energy} />
          {[5.6, 6.4].map((r, i) => (
            <group key={r} rotation={[0, 0, local * 0.003 * (i ? -1 : 1)]}>
              <GoldRing radius={r} tube={0.025} energy={energy} />
            </group>
          ))}
        </group>
        <StarField seed="outro" count={2400} box={[90, 130, 70]} center={[0, 0, -30]} size={0.22} />
        <Nebula seed="outro-neb" count={12} spread={[70, 90, 20]} center={[0, 0, -45]} colors={["#5B2A86", "#C2407A", "#2B3A9E", "#F08A3C"]} opacity={0.85} />
      </Scene3D>
      <CineVignette strength={0.6} />
      <CaptionShade y={1500} h={560} />
      <CaptionBlock top={1380}>
        <Cine text="ALABELA SAJAN AAYO RE" at={start + 35} until={start + 290} mode="track" size={48} tracking={0.14} color={GOLD} />
        <Cine text="अलबेला सजन आयो रे" at={start + 55} until={start + 290} mode="blur" size={88} font={DEVA} weight={400} gold style={{ marginTop: 14 }} />
      </CaptionBlock>
      <CaptionBlock top={1360}>
        <Cine text="धन्यवाद" at={start + 310} until={TOTAL + 40} mode="blur" size={160} font={DEVA} weight={400} gold />
        <Cine text="THANK YOU FOR LISTENING" at={start + 335} until={TOTAL + 40} mode="track" size={32} tracking={0.4} color={SAFFRON} style={{ marginTop: 10 }} />
      </CaptionBlock>
      <AbsoluteFill style={{ backgroundColor: "black", opacity: tween(frame, [TOTAL - 30, TOTAL - 1], [0, 1], Easing.in(Easing.quad)) }} />
    </AbsoluteFill>
  );
};
