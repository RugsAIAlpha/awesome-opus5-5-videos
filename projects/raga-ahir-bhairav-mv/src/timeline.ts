// All times are absolute frames at 30 fps, measured against the source video.
export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const TOTAL = 6941; // 231.39 s

// Fully generated 3D scenes replace the source's two still images (0 – 94 s and 213.5 s – end).
// The live footage runs in between; flashes at its edges hide the source's own dissolves.
export const SCENES = {
  cosmos: [0, 420],
  mandala: [420, 1020],
  terrain: [1020, 1560],
  helix: [1560, 2100],
  ocean: [2100, 2479],
  tunnel: [2479, 2820],
  live: [2820, 6405],
  outro: [6405, TOTAL],
} as const;

// Scene cuts, each hidden under a light flash
export const CUTS = [420, 1020, 1560, 2100, 2479, 2820, 6405];

export const LETTERBOX = 96;
