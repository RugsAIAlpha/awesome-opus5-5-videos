# Raga Ahir Bhairav — motion-graphics edit

A Remotion project that adds motion graphics to a 1080×1920 music video, *Raga Ahir Bhairav — Alabela Sajan Aayo Re* (231 s, 30 fps). The footage is not committed; see Setup.

## What it adds

| Time | Source | Edit |
| --- | --- | --- |
| 0:00–1:22 | One still portrait | Slow push-in, lantern glow and light leak that follow the music, gold dust, and six animated cards: raga title, bandish title (Latin + Devanagari), raga facts (prahar, thaat, vadi/samvadi), the aaroh drawn as a rising scale with komal Re/Ni marked, a mood line, and "Close your eyes. Listen." |
| 1:22 | Hard cut to title card | Golden sun-flash transition |
| 1:22–1:34 | Still title card | Zoom-out; rotating sun rays, twinkling stars, shimmering sea, glowing moon, falling petals |
| 1:32–3:34 | Live singing | Warm grade, gentle push-in, lower third, raga badge, Devanagari swaras rising along the edges, a mid-song bandish moment with translation, and a sargam strip that lights up with the spectrum |
| 3:34–3:51 | Title card | Same living-card treatment, then an end card (धन्यवाद · Thank you for listening) |

Throughout, four "tanpura strings" at the bottom vibrate with a 16-band spectrum of the soundtrack.

## Setup

```bash
npm i
cp /path/to/video.mp4 public/source.mp4
ffmpeg -ss 10 -i public/source.mp4 -frames:v 1 -q:v 1 public/portrait.jpg
ffmpeg -ss 87 -i public/source.mp4 -frames:v 1 -q:v 1 public/titlecard.jpg
# Regenerate audio data (src/audio.json is committed already)
ffmpeg -i public/source.mp4 -vn -ac 1 -ar 22050 -f f32le /tmp/audio.f32
python3 tools/analyze.py /tmp/audio.f32 src/audio.json
```

`remotion.config.ts` points at a pre-installed headless Chromium; remove that line to let Remotion download its own.

## Render

The video is rendered without sound and the original soundtrack is muxed back in unchanged:

```bash
npx remotion render RagaAhirBhairav out/video.mp4 --codec=h264 --crf=18 --muted
ffmpeg -i out/video.mp4 -i public/source.mp4 -map 0:v -map 1:a -c:v copy -c:a copy -shortest out/final.mp4
```

Section timings live in `src/timeline.ts`. They are measured against the source cuts and dissolves, so the title-card overlay lines up with the card baked into the footage during each dissolve.

Fonts (Cormorant Garamond, Cinzel, Tiro Devanagari Hindi) are bundled in `public/fonts` under the SIL Open Font License.
