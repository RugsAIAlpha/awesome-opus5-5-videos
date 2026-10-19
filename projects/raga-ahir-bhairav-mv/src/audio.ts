import data from "./audio.json";

// Per-frame loudness (0–1) and a 16-band log spectrum, precomputed from the soundtrack
const rms: number[] = data.rms;
const bands: number[][] = data.bands;

const index = (frame: number) =>
  Math.max(0, Math.min(rms.length - 1, Math.round(frame)));

export const rmsAt = (frame: number) => rms[index(frame)];
export const bandsAt = (frame: number) => bands[index(frame)];

// Transient envelope: how far loudness jumps above its recent average, with a fast attack and slow decay
const kick: number[] = (() => {
  const out: number[] = [];
  let env = 0;
  for (let f = 0; f < rms.length; f++) {
    let avg = 0;
    for (let k = 1; k <= 15; k++) avg += rms[Math.max(0, f - k)];
    avg /= 15;
    const hit = Math.max(0, Math.min(1, (rms[f] - avg) * 5));
    env = Math.max(hit, env * 0.88);
    out.push(env);
  }
  return out;
})();

export const kickAt = (frame: number) => kick[index(frame)];

// Loudness peaks inside [from, to): local maxima above `threshold`, at least `gap` frames apart
export const peaksBetween = (from: number, to: number, threshold: number, gap: number) => {
  const found: number[] = [];
  for (let f = from + 45; f < to - 45; f++) {
    if (rms[f] < threshold) continue;
    let isMax = true;
    for (let k = -45; k <= 45 && isMax; k++) if (rms[f + k] > rms[f]) isMax = false;
    if (isMax && (found.length === 0 || f - found[found.length - 1] >= gap)) found.push(f);
  }
  return found;
};
