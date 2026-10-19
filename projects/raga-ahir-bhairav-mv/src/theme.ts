import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

// Fonts are bundled in public/fonts (Google Fonts, OFL) so renders work offline
const face = (
  family: string,
  file: string,
  weight: string,
  style = "normal",
  unicodeRange?: string,
) =>
  loadFont({
    family,
    url: staticFile(`fonts/${file}`),
    weight,
    style,
    unicodeRange,
  });

face("Cormorant Garamond", "cormorant.woff2", "300 700");
face("Cormorant Garamond", "cormorant-italic.woff2", "500", "italic");
face("Cinzel", "cinzel.woff2", "500");
face(
  "Tiro Devanagari Hindi",
  "tiro-devanagari.woff2",
  "400",
  "normal",
  "U+0900-097F, U+1CD0-1CF9, U+200C-200D, U+20A8, U+20B9, U+25CC, U+A830-A839, U+A8E0-A8FF",
);
face(
  "Tiro Devanagari Hindi",
  "tiro-latin.woff2",
  "400",
  "normal",
  "U+0000-00FF, U+2000-206F",
);

export const SERIF = "'Cormorant Garamond', serif";
export const CAPS = "Cinzel, serif";
export const DEVA = "'Tiro Devanagari Hindi', serif";

export const GOLD = "#EBCB86";
export const SAFFRON = "#F4A259";
export const CREAM = "#FFF5E1";
export const INK = "#0B0912";

export const SHADOW = "0 4px 28px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.6)";

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Clamped interpolate with the house easing
export const tween = (
  frame: number,
  input: number[],
  output: number[],
  easing: (t: number) => number = EASE_OUT,
) => interpolate(frame, input, output, { ...clamp, easing });
