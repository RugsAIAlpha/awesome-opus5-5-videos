// All times are absolute frames at 30 fps, measured against the source video.
export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const TOTAL = 6941; // 231.39 s

export const T = {
  // 0 – 82.6 s: the source holds a single still portrait
  portraitEnd: 2479,
  // 82.6 – 92.6 s: still title card, then the source cross-dissolves into the live footage
  videoStart: 2760,
  dissolveInStart: 2778,
  dissolveInEnd: 2820,
  // 213.5 – 214.5 s: the source dissolves back to the title card for the outro
  dissolveOutStart: 6405,
  dissolveOutEnd: 6435,
  videoEnd: 6441,
  endCard: 6790,
};

// Title-card artwork landmarks, in 1080×1920 image coordinates
export const SUN = { x: 540, y: 864 };
export const MOON = { x: 924, y: 580 };
