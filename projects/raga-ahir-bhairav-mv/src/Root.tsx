import { Composition } from "remotion";
import { MusicVideo } from "./MusicVideo";
import { FPS, H, TOTAL, W } from "./timeline";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="RagaAhirBhairav"
      component={MusicVideo}
      durationInFrames={TOTAL}
      fps={FPS}
      width={W}
      height={H}
    />
  </>
);
