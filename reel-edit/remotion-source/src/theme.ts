export const FPS = 25;
export const TOTAL = 656; // 26.24s
export const t = (s: number) => Math.round(s * FPS);

export const C = {
  ink: '#0B0F14',
  panel: '#101722',
  yellow: '#FFC21A',
  orange: '#FF7A00',
  red: '#FF3B4E',
  green: '#22D67B',
  white: '#FFFFFF',
  cream: '#F6EFE0',
  blue: '#3B82F6',
};

export const ANTON = 'Anton, Impact, sans-serif';
export const POP = 'Poppins, Inter, sans-serif';

// Speech phrases aligned to the audio (silence detection) + the supplied script.
export type Phrase = {s: number; e: number; text: string};
export const PHRASES: Phrase[] = [
  {s: 0.0, e: 2.38, text: 'Dukandaar ki salah par construction ka maal khareed rahe hain?'},
  {s: 2.74, e: 3.87, text: 'Yeh jeb par bahut bhaari padega.'},
  {s: 4.33, e: 5.61, text: 'Dukandaar wahi brand bechega'},
  {s: 5.91, e: 7.11, text: 'jisme uska margin zyada ho,'},
  {s: 7.47, e: 8.82, text: 'na ki jo aapke ghar ke liye sahi hai.'},
  {s: 9.22, e: 11.73, text: 'Baad mein eentey paani sookenge aur mistri kaam rok dega.'},
  {s: 12.16, e: 13.54, text: 'Ek client ne galat cement khareeda,'},
  {s: 13.8, e: 14.76, text: 'chhat dobara daalni padi'},
  {s: 14.98, e: 16.9, text: 'aur 1 lakh ka faltu kharcha ho gaya.'},
  {s: 17.19, e: 20.42, text: 'Solution hai, khareedne se pehle material sheet aur rate comparison tayar rakhna.'},
  {s: 20.91, e: 22.17, text: 'Sahi maal aur sahi rate ke liye'},
  {s: 22.39, e: 23.54, text: "comment karein 'MATERIAL'"},
  {s: 23.73, e: 25.9, text: 'aur main aapko DM mein poori jaankari bhej doonga.'},
];

export const RED_WORDS = ['bhaari', 'galat', 'faltu', 'kharcha', 'rok', 'dobara', 'sookenge', 'jeb'];
export const GREEN_WORDS = ['sahi', 'solution', 'material', "'material'", 'rate', 'comparison', 'sheet'];
