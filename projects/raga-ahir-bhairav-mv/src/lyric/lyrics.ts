// Sung phrases, placed on breath gaps detected in the soundtrack (tools/breaths.py).
// Times are seconds in the source; word timing inside a phrase is weighted by syllables.

const A = "albela sajan aayo re";
const B = "mora ati man sukh paayo ri";
const C = "chauk puraao mangal gaao";
const D = "man rang nisdin paayo ri";

type Raw = [number, number, string];

const RAW: Raw[] = [
  // Alaap: free vowel exploration before any words
  [0.4, 10.3, "aa…"],
  [10.9, 19.8, "aa… ooh…"],
  [20.0, 29.8, "aa… aa…"],
  [29.9, 45.3, "ooh… aa… aa…"],
  [45.7, 56.3, "aa… ooh…"],
  [57.0, 63.9, "aa…"],
  [64.0, 72.5, "aa… aa…"],
  [73.0, 87.7, "ooh… aa… aa…"],
  [87.8, 92.6, "aa…"],
  // Bandish
  [94.0, 99.9, A],
  [100.0, 104.9, A],
  [105.5, 112.1, B],
  [112.5, 117.2, A],
  [118.2, 125.6, C],
  [126.4, 130.2, D],
  [130.9, 146.7, "aa… aa… aa…"],
  [146.8, 148.6, "aayo re"],
  [149.1, 151.5, "sajan"],
  [151.6, 156.8, A],
  [157.4, 161.7, "aayo re"],
  [162.0, 164.2, "albela"],
  [164.7, 174.0, "aa… aa…"],
  [174.3, 175.8, "sajan"],
  [176.3, 181.3, B],
  [181.6, 187.5, A],
  [188.2, 193.5, C],
  [193.7, 197.3, D],
  [197.7, 199.2, "aayo re"],
  [199.9, 205.1, A],
  [205.3, 208.4, "sajan"],
  [208.6, 211.0, "aayo re"],
  [211.2, 213.4, "aa…"],
  // Closing alaap
  [217.3, 223.5, "aa… aa…"],
  [224.2, 230.3, "aa…"],
];

export type Word = { text: string; at: number };
export type Phrase = { start: number; end: number; words: Word[] };

const syllables = (w: string) => Math.max(1, (w.replace(/…/g, "").match(/[aeiou]+/g) ?? []).length);

const build = ([s, e, text]: Raw): Phrase => {
  const start = Math.round(s * 30);
  const end = Math.round(e * 30);
  const tokens = text.split(" ");
  // The opening word is stretched melodically and the cadence word is held
  const weights = tokens.map((t, i) => syllables(t) * (i === 0 ? 1.8 : 1) * (i === tokens.length - 1 && i > 0 ? 1.3 : 1));
  const total = weights.reduce((a, b) => a + b, 0);
  const span = (end - start) * 0.82;
  let t = start;
  const words = tokens.map((tok, i) => {
    const w = { text: tok, at: Math.round(t) };
    t += (weights[i] / total) * span;
    return w;
  });
  return { start, end, words };
};

export const PHRASES: Phrase[] = RAW.map(build);
