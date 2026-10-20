import { Composition } from "remotion";
import { LyricVideo } from "./lyric/LyricVideo";
import { MusicVideo } from "./MusicVideo";
import { FPS, H, TOTAL, W } from "./timeline";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="RagaLyricVideo" component={LyricVideo} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
    <Composition id="RagaAhirBhairav" component={MusicVideo} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
  </>
);
