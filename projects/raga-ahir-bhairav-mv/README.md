# Raga Ahir Bhairav — motion-graphics edit

Two compositions:

- **`RagaLyricVideo`** — an illustrated lyric video in a flat storybook style: silhouette figures, pastel skies with flowing wind streaks, and the live performance framed inside the scenes (a photo held in hands, an arched window above a rangoli, a projection screen, a tile panel, a moon portal). Word-by-word karaoke lyrics, the sung word highlighted in gold. Sources in `src/lyric/`.
- **`RagaAhirBhairav`** — the 3D/VFX cut described below.

### Lyric sync

`tools/breaths.py` finds phrase boundaries at breath gaps in the vocal band; `src/lyric/lyrics.ts` places the alaap vowels and the bandish lines (*albela sajan aayo re*, *mora ati man sukh paayo ri*, *chauk puraao mangal gaao*, *man rang nisdin paayo ri*) on those phrases, with word timing weighted by syllables. Edit the table there to move a line.

A Remotion project that adds motion graphics to a 1080×1920 music video, *Raga Ahir Bhairav — Alabela Sajan Aayo Re* (231 s, 30 fps). The footage is not committed; see Setup.

## What it does

The source opens and closes on two still images; both are replaced by generated 3D scenes (three.js via `@remotion/three`, with bloom). Only the live singing footage is kept.

| Time | Scene |
| --- | --- |
| 0:00–0:14 | Cosmos: camera flies through a star field and nebula towards a rising sun — "In the hour before dawn / A raga awakens" |
| 0:14–0:34 | Lotus: a 3D gold mandala blooms open around the sun — "Ahir Bhairav", राग अहीर भैरव |
| 0:34–0:52 | Sound terrain: a scrolling 3D spectrogram of the soundtrack — prahar, thaat, vadi/samvadi |
| 0:52–1:10 | Swara helix: the eight notes of the aaroh light up on a gold helix, komal Re and Ni marked |
| 1:10–1:23 | Dawn ocean: wireframe sea under a rising sun — "A morning raga / as night gives way to first light" |
| 1:23–1:34 | Ring tunnel: warp through gold rings — "Alabela Sajan Aayo Re" |
| 1:34–3:34 | Live footage: punch-zoom and shake on transients, orange-and-teal grade, god rays, light leaks, anamorphic flares on loudness peaks, RGB-split glitch hits, 3D orbit rings, depth dust and bokeh, and a run of cinematic captions |
| 3:34–3:51 | Outro: the lotus folds back into a bud as the camera pulls away — धन्यवाद |

Throughout: letterbox bars, film grain, light flashes on every cut, and four tanpura strings in the bottom bar that vibrate with a 16-band spectrum.

## Setup

```bash
npm i
cp /path/to/video.mp4 public/source.mp4
# Regenerate audio data (src/audio.json is committed already)
ffmpeg -i public/source.mp4 -vn -ac 1 -ar 22050 -f f32le /tmp/audio.f32
python3 tools/analyze.py /tmp/audio.f32 src/audio.json
```

`remotion.config.ts` points at a pre-installed headless Chromium and the ANGLE GL backend; remove the browser line to let Remotion download its own.

## Render

The video is rendered without sound and the original soundtrack is muxed back in unchanged:

```bash
npx remotion render RagaLyricVideo out/video.mp4 --codec=h264 --crf=18 --muted
# or the 3D cut:
npx remotion render RagaAhirBhairav out/video.mp4 --codec=h264 --crf=18 --muted --gl=angle
ffmpeg -i out/video.mp4 -i public/source.mp4 -map 0:v -map 1:a -c:v copy -c:a copy -shortest out/final.mp4
```

Scene timings live in `src/timeline.ts`. The live footage starts and ends under a light flash, hiding the source's own dissolves into and out of its title card.

Fonts (Cormorant Garamond, Cinzel, Tiro Devanagari Hindi) are bundled in `public/fonts` under the SIL Open Font License.
