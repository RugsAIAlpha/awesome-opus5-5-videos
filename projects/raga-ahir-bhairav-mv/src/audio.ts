import data from "./audio.json";

// Per-frame loudness (0–1) and a 16-band log spectrum, precomputed from the soundtrack
const rms: number[] = data.rms;
const bands: number[][] = data.bands;

const index = (frame: number) =>
  Math.max(0, Math.min(rms.length - 1, Math.round(frame)));

export const rmsAt = (frame: number) => rms[index(frame)];
export const bandsAt = (frame: number) => bands[index(frame)];
