export type Racket = {
  id: "forecourt" | "baseline" | "volley";
  /** Small tracked eyebrow above the headline. */
  name: string;
  /** Display headline, split into lines exactly as the comp sets it. */
  headline: string[];
  /** Index of the line that is set in green. */
  accentLine: number;
  blurb: string;
  price: string;
  /** Which brand colour this frame is accented in. */
  accent: "green" | "orange";
  image: string;
  imageAlt: string;
};

/* Copy for Forecourt and Volley is taken verbatim from Figma (nodes
   340:1523/340:1524/340:1525 and 340:1555/340:1556). The middle row in the
   comp repeats the Forecourt block as a placeholder, but the nav and footer
   both name a third frame — Baseline — so it is written out here to match. */
export const RACKETS: Racket[] = [
  {
    id: "forecourt",
    name: "Forecourt",
    headline: ["PRECISION,", "PLACEMENT", "OVER PACE."],
    accentLine: 2,
    blurb:
      "A head-light balance and dense string pattern for the player who wins points before they swing.",
    price: "₦50,000.00",
    accent: "green",
    image: "/media/player.png",
    imageAlt: "Player holding the Forecourt frame across her body on court",
  },
  {
    id: "baseline",
    name: "Baseline",
    headline: ["POWER,", "DEPTH FROM", "THE BACK."],
    accentLine: 2,
    blurb:
      "A head-heavy frame with an open string pattern, built for players who live three feet behind the line.",
    price: "₦50,000.00",
    accent: "orange",
    image: "/media/racket.png",
    imageAlt: "The Baseline frame standing upright beside two tennis balls",
  },
  {
    id: "volley",
    name: "Volley",
    headline: ["QUICK HANDS,", "BUILT FOR", "THE NET."],
    accentLine: 2,
    blurb:
      "The shortest swing weight in the range. Made to be moved fast, late, and with one hand if it comes to that.",
    price: "₦50,000.00",
    accent: "green",
    image: "/media/player.png",
    imageAlt: "Player at the net gripping the Volley frame",
  },
];

export const RACKETS_BY_ID = Object.fromEntries(
  RACKETS.map((r) => [r.id, r]),
) as Record<Racket["id"], Racket>;

/* ── The two-question finder ───────────────────────────────────
   Each answer adds weight to one or more frames; the highest total wins.
   Two questions, no spec sheet — which is the whole point of the section. */
export type FinderOption = {
  label: string;
  detail: string;
  scores: Partial<Record<Racket["id"], number>>;
};

export type FinderQuestion = {
  id: string;
  index: string;
  prompt: string;
  options: FinderOption[];
};

export const FINDER_QUESTIONS: FinderQuestion[] = [
  {
    id: "where",
    index: "01",
    prompt: "Where do you win your points?",
    options: [
      {
        label: "At the net",
        detail: "You close the gap and finish short.",
        scores: { volley: 3, forecourt: 1 },
      },
      {
        label: "From the baseline",
        detail: "You build the point from the back.",
        scores: { baseline: 3 },
      },
      {
        label: "Inside the service line",
        detail: "You take the ball early and redirect.",
        scores: { forecourt: 3, volley: 1 },
      },
    ],
  },
  {
    id: "swing",
    index: "02",
    prompt: "How do you swing?",
    options: [
      {
        label: "Compact and placed",
        detail: "Short backswing, angles over power.",
        scores: { forecourt: 2, volley: 2 },
      },
      {
        label: "Full and heavy",
        detail: "Long take-back, weight through the ball.",
        scores: { baseline: 3 },
      },
    ],
  },
];

export function resolveRacket(answers: number[]): Racket {
  const totals: Record<Racket["id"], number> = {
    forecourt: 0,
    baseline: 0,
    volley: 0,
  };

  answers.forEach((answerIndex, questionIndex) => {
    const option = FINDER_QUESTIONS[questionIndex]?.options[answerIndex];
    if (!option) return;
    for (const [id, weight] of Object.entries(option.scores)) {
      totals[id as Racket["id"]] += weight ?? 0;
    }
  });

  // Ties fall to the order the frames are presented in on the page.
  const winner = RACKETS.reduce((best, racket) =>
    totals[racket.id] > totals[best.id] ? racket : best,
  );
  return winner;
}

/* The Shop dropdown (Figma 345:2206). The comp labels the second row
   "BASEBALL" — a slip; every other surface calls the frame Baseline. */
export const SHOP_MENU = [
  { label: "Forecourt", href: "#forecourt" },
  { label: "Baseline", href: "#baseline" },
  { label: "Volley", href: "#volley" },
  { label: "View all", href: "#characters" },
];

export const NAV_LINKS = [
  { label: "Shop", href: "#characters", hasMenu: true },
  { label: "Racket Finder", href: "#finder" },
  { label: "The Craft", href: "#craft" },
  { label: "Stockists", href: "#stockists" },
];
