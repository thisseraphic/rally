# Rally

The Rally landing page, built from the Figma frame `340:1452` in
**Website Design Studio** (`p3clpFk2H4fWwT6wfCErVn`).

```bash
npm install
npm run dev      # http://localhost:3000
```

`npm run build` produces a fully static prerender of the page.

## Layout

- `app/globals.css` — every design token from the comp: colours, the fluid
  display type scale, and the `.shell` content column (1312px, capped, with
  the gutters absorbing anything wider).
- `components/site/` — one component per section of the frame, in page order.
- `components/motion/` — the reusable motion primitives (`RevealText`,
  `FadeUp`, `Parallax`, `MagneticButton`, `SmoothScroll`, `useCursorFollow`)
  plus the opening `Preloader` and the `LoaderProvider` that tells the rest of
  the page when it has cleared.
- `lib/rackets.ts` — the three frames plus the two-question finder's scoring
  table. Change the copy, prices, questions or a frame's `accent` here —
  Baseline runs orange, the other two green, and the accent drives the eyebrow,
  the highlighted headline line, the price and the button.
- `public/media/` — the hero film, the craft film and the photographs, copied
  from `../Asset`. `player-2.jpg` and `racket-green.png` are the finder grid's
  hover frames.
  Served through `next/image`, which re-encodes the 6–7 MB source PNGs to
  AVIF (court 5.8 MB → 32 KB, player 7.3 MB → 95 KB at 1512px).
- `public/icons/` — the UI icons exported from Figma. `components/site/Icon.tsx`
  inlines the same path data with `currentColor` so one icon works on the
  green hero and on white.

## The preloader

Figma node `345:1997`. One square on the brand green, into which three
photographs load in turn: each wipes open from its centre, fills the frame
edge to edge, and only then does the next one start — so every image covers the
one before it completely. A counter runs to 100 beneath at 48px bold, then the
whole panel unfolds off the top and the hero plays its entrance underneath.

The comp draws the three photographs as nested squares (300 / 258 / 214px).
Built that way, the middle photograph's grey studio backdrop landed in the gap
and read as a pale picture frame, so the layers are all full-bleed instead —
closer to the reference loader, and no outline.

The count is not purely decorative — it crawls to 92 on a timer and only
completes once the document's `load` event fires, capped at 6s so a slow
network can never strand anyone on the green screen. The squares stay fully
clipped until their photographs have decoded, so the stack never flashes as
blank plates. Tuning lives at the top of `components/motion/Preloader.tsx`
(`LAYER_MS` for how long each photograph takes, `CRAWL_MS`, `MAX_WAIT_MS`, and
the `LAYERS` table of image and crop).

While it is up, the page is scroll-locked and Lenis is not yet mounted; the
hero holds its headline, sub-copy and buttons until `LoaderProvider` reports
`done`. Under `prefers-reduced-motion` the preloader never renders at all.

## The craft section

Figma node `345:1778` / `345:1986`. The section is pinned for 250svh. The film
starts boxed in the slot the earlier comp draws it in, and opens out to fill the
viewport edge to edge as the quote, the note and the button fade away,
finishing on the "Scroll" badge (124px circle, 2px white rule) which trails the
cursor across the picture on a spring and parks at the comp's spot — 71.4%
across, centred — whenever there is no pointer.

The comp boxes the final frame to the 1312px content column; it runs full bleed
here instead, so it fills the pinned viewport with no gutters and no gap above.

The media is `public/media/craft.mp4` (from `Asset/Second Section video.mp4`),
muted and looping, started and stopped by an IntersectionObserver so it isn't
decoding three sections away. It carries no poster on purpose — `court.png` is
a 6 MB source served raw there and would land ahead of the 2 MB film.

The film never moves or scales. It is laid out at its final size from the start
and revealed through an animated `clip-path: inset()` whose starting edges are
measured off the slot, the same technique the aquen reference uses. That keeps
it sharp the whole way and only touches compositor properties.

Two things worth knowing before editing `components/site/CraftSection.tsx`:
the measured insets live in **motion values, not React state** — putting them
in state re-rendered the subtree on every resize and stomped Motion's style
bindings mid-scroll; and the two fades are handed to CSS as a `--fade` custom
property rather than a direct `style={{ opacity }}` binding, which did not
survive those re-renders. Under `prefers-reduced-motion` the section renders
the original static layout with no pin and no scroll rig.

## Shop dropdown

Figma node `345:2206`. A 120px column under the Shop nav item — 1px rule
around it and between its four rows, 12px uppercase at 1.54px tracking,
transparent over the hero so the film reads through, and a white/95 panel with
ink type once the bar is on paper. Opens on hover and on click, closes on
Escape, on an outside click, on picking an item, and whenever the bar hides on
scroll. Picking a frame hands off to Lenis, which eases to that section.

The mobile drawer carries the same four destinations: Shop is a toggle there
that expands them in place under a rule, at 44px tap targets. Picking one
closes the drawer and eases to the section.

The comp labels the second row "BASEBALL"; every other surface calls the frame
Baseline, so it reads Baseline here. Items live in `SHOP_MENU` in
`lib/rackets.ts`, and feed both the dropdown and the drawer.

## Finder grid

Each of the three bands crossfades to a second frame under the cursor —
the woman becomes a man mid-backhand, and the court and the orange frame both
become the green colourway. `racket-green` serves two tiles, which is safe
because the active tile is tracked for the whole band rather than per tile, so
two frames can never be swapped at once. Movement counts as well as entry, so a
band that scrolls up under a stationary cursor still swaps. Touch pointers are
ignored.

There are five stills for six slots, hence the shared green frame. Drop a sixth
image in and give tile two its own `hover` in `TILES` to separate them.

## Cursor badges

`useCursorFollow` puts a circular badge under the pointer inside any box, on a
spring, and parks it at a fixed spot when there is no pointer. Two users:

- The craft section's **Scroll** badge, which parks at the comp's 71.4% / 50%.
- Each product card's **See Frame** badge, which appears only while that card
  is hovered — it snaps to the cursor on entry rather than flying in from the
  park, and springs after it from there.

Both ignore touch pointers, so on a phone the badge never appears and the
"See Frame" button under the copy is the affordance. Neither renders under
`prefers-reduced-motion`. The product badge is a solid white 80px disc with
green-deep type, which reads on the light studio shot and the dark court ones
alike; the craft badge keeps the comp's 124px white-ruled circle.

## Overlays and backgrounded tabs

Both full-screen overlays used to depend on an animation callback to get out of
the way, and every step of them runs on requestAnimationFrame — which a browser
pauses in a background tab. Open the site with cmd+click and the preloader
could still be covering the page when you switched to it; the mobile drawer
could stay mounted and catching taps after you picked a link.

Neither does now:

- The **preloader** commits its handover on `setTimeout`, not on the animation:
  `HARD_CEILING_MS` guarantees it clears whatever happens, and a shorter timer
  covers the unfold once it starts. `markDone` is idempotent.
- The **drawer** is always mounted and driven by `menuOpen` rather than by
  AnimatePresence, so `pointer-events`, `aria-hidden` and `inert` flip with
  state instead of waiting for an exit to finish. Closed, it has zero tabbable
  children.

Keep it that way: if either is rewritten to hand over from `onExitComplete` or
`onAnimationComplete` alone, the background-tab bug comes straight back.

## Notes

- Product rows 1 and 2 carry identical placeholder copy in Figma, but the nav
  and footer both name three frames. Row 2 is written as **Baseline** so the
  rows, the nav, the footer and the finder all agree. See `lib/rackets.ts`.
- Lenis drives scrolling, which would otherwise swallow keyboard scrolling and
  scroll-on-focus; both are re-implemented in `components/motion/SmoothScroll.tsx`.
- Every animation has a `prefers-reduced-motion` path: Lenis and the load
  curtain don't mount, the hero video doesn't autoplay, and reveals render as
  plain visible markup rather than waiting on a scroll trigger.
