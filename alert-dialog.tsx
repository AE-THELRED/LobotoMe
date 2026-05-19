// Maps moodboard ids (e.g. 'img-002') to bundled asset URLs via Vite.
import img002 from "@/assets/moodboard/img-002.png";
import img013 from "@/assets/moodboard/img-013.png";
import img017 from "@/assets/moodboard/img-017.png";
import img023 from "@/assets/moodboard/img-023.png";
import img027 from "@/assets/moodboard/img-027.png";
import img031 from "@/assets/moodboard/img-031.png";
import img035 from "@/assets/moodboard/img-035.png";

export const MOODBOARD: Record<string, { src: string; caption: string; credit: string }> = {
  "img-002": {
    src: img002,
    caption: "Commercial collage — yellow Kodak, Coca-Cola red, kitchen-rouge pink.",
    credit: "Mid-century print advertising, archive collage",
  },
  "img-013": {
    src: img013,
    caption: "Domestic interior with circuit-board wallpaper — the clinical home.",
    credit: "After Richard Hamilton (1956 reference plate)",
  },
  "img-017": {
    src: img017,
    caption: "Saarinen pedestal silhouettes on chrome yellow.",
    credit: "Knoll Associates catalogue plate, 1957",
  },
  "img-023": {
    src: img023,
    caption: "Vogue mastheads, illustrated glove, editorial composure.",
    credit: "Vogue cover archive, 1932 + 1952",
  },
  "img-027": {
    src: img027,
    caption: "Hand, grid, motor — Müller-Brockmann poster trio.",
    credit: "Swiss poster archive, 1950s",
  },
  "img-031": {
    src: img031,
    caption: "Alvin Lustig book jackets — paper-cut composition.",
    credit: "New Directions imprint, 1947 + 1955",
  },
  "img-035": {
    src: img035,
    caption: "LIFE magazine block — Aires Viscount ad, Chutes & Ladders.",
    credit: "LIFE magazine spreads, 1955",
  },
};

export type MoodboardKey = keyof typeof MOODBOARD;
export const MOODBOARD_KEYS = Object.keys(MOODBOARD) as MoodboardKey[];
