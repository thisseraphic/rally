"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, animate, motion, useReducedMotion } from "motion/react";
import { useLoader } from "./LoaderProvider";

/**
 * The first thing anyone sees: three photographs stack up as concentric
 * squares on the brand green, a counter runs to 100 beneath them, and then the
 * whole panel unfolds off the top to hand over to the hero.
 *
 * Figma node 345:1997 — squares at 300 / 258 / 214px, counter at 48px bold.
 */

/* One square, three photographs. Each fills the frame outright and lands on
   top of the one before it, so nothing of the previous layer shows around the
   edge — the nested sizes of the comp left the middle photo's grey studio
   backdrop reading as a pale picture frame. `position` is the square crop each
   photograph is cut to. */
const LAYERS = [
  {
    src: "/media/player.png",
    position: "50% 42%",
    alt: "",
  },
  {
    src: "/media/racket.png",
    position: "50% 50%",
    alt: "",
  },
  {
    src: "/media/court.png",
    position: "50% 38%",
    alt: "",
  },
] as const;

/** Each photograph completes before the next one starts to open. */
const LAYER_MS = 700;

/** Time the counter takes to crawl to 92 before assets are confirmed ready. */
const CRAWL_MS = 2600;
/** Never wait on the network longer than this before showing the site. */
const MAX_WAIT_MS = 6000;
/**
 * Wall-clock ceiling on the whole sequence. Every step above runs on
 * requestAnimationFrame, which a browser pauses in a background tab — open the
 * site with cmd+click and the counter would otherwise never reach 100, so the
 * panel would still be covering the page when the visitor switched to it.
 * setTimeout keeps running when rAF does not, so this always fires.
 */
const HARD_CEILING_MS = 9000;

export default function Preloader() {
  const reduced = useReducedMotion();
  const { done, markDone } = useLoader();
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const [revealReady, setRevealReady] = useState(false);
  const started = useRef(false);

  // Nothing to animate under reduced motion — hand over immediately.
  useEffect(() => {
    if (reduced && !done) markDone();
  }, [reduced, done, markDone]);

  // The squares stay fully clipped until their photographs have decoded, so
  // the stack never flashes as three blank white plates. A slow connection
  // can't stall the sequence indefinitely — after 1.6s it opens regardless.
  useEffect(() => {
    if (reduced) return;
    if (loaded >= LAYERS.length) {
      setRevealReady(true);
      return;
    }
    const timer = window.setTimeout(() => setRevealReady(true), 1600);
    return () => window.clearTimeout(timer);
  }, [loaded, reduced]);

  // Hold the page still while the loader owns the screen.
  useEffect(() => {
    if (reduced || done) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      html.style.overflow = previous;
    };
  }, [reduced, done]);

  // Whatever happens above, hand the page over. markDone is idempotent.
  useEffect(() => {
    if (reduced) return;
    const ceiling = window.setTimeout(markDone, HARD_CEILING_MS);
    return () => window.clearTimeout(ceiling);
  }, [reduced, markDone]);

  // Once the unfold starts, the handover is committed — it must not wait on an
  // animation callback that a paused rAF would never deliver.
  useEffect(() => {
    if (!exiting) return;
    const settle = window.setTimeout(markDone, 1200);
    return () => window.clearTimeout(settle);
  }, [exiting, markDone]);

  useEffect(() => {
    if (reduced || started.current) return;
    started.current = true;

    let cancelled = false;

    // The counter crawls to 92 on its own, then completes once the page's
    // own assets are in — so the number tracks something real, but a slow
    // network can never strand a visitor on the green screen.
    const crawl = animate(0, 92, {
      duration: CRAWL_MS / 1000,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setCount(Math.round(v)),
    });

    const assetsReady = new Promise<void>((resolve) => {
      if (document.readyState === "complete") return resolve();
      window.addEventListener("load", () => resolve(), { once: true });
    });
    const cap = new Promise<void>((resolve) =>
      window.setTimeout(resolve, MAX_WAIT_MS),
    );

    (async () => {
      await Promise.all([crawl.finished.catch(() => {}), Promise.race([assetsReady, cap])]);
      if (cancelled) return;

      await animate(92, 100, {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => setCount(Math.round(v)),
      }).finished.catch(() => {});
      if (cancelled) return;

      // Beat on 100 so it reads, then unfold.
      await new Promise((r) => window.setTimeout(r, 260));
      if (cancelled) return;
      setExiting(true);
    })();

    return () => {
      cancelled = true;
      crawl.stop();
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <AnimatePresence onExitComplete={markDone}>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden bg-green"
          initial={{ y: 0 }}
          animate={exiting ? { y: "-100%" } : { y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => {
            if (exiting) markDone();
          }}
          aria-live="polite"
          aria-label="Loading Rally"
        >
          {/* The square. Every photograph fills it edge to edge. */}
          <motion.div
            className="relative"
            style={{
              width: "min(300px, 68vw, 34vh)",
              height: "min(300px, 68vw, 34vh)",
            }}
            animate={
              exiting
                ? { scale: 1.35, opacity: 0 }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            {LAYERS.map((layer, i) => (
              <motion.div
                key={layer.src + i}
                className="absolute inset-0 overflow-hidden"
                style={{ zIndex: i }}
                // Wipes open from its own centre, and only once the layer
                // beneath it has finished — one photograph at a time.
                initial={{ clipPath: "inset(50% 50% 50% 50%)" }}
                animate={
                  revealReady
                    ? { clipPath: "inset(0% 0% 0% 0%)" }
                    : { clipPath: "inset(50% 50% 50% 50%)" }
                }
                transition={{
                  duration: LAYER_MS / 1000,
                  delay: revealReady ? (i * LAYER_MS) / 1000 : 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <motion.div
                  className="size-full"
                  initial={{ scale: 1.12 }}
                  animate={revealReady ? { scale: 1 } : { scale: 1.12 }}
                  transition={{
                    duration: (LAYER_MS / 1000) * 1.4,
                    delay: revealReady ? (i * LAYER_MS) / 1000 : 0,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Image
                    src={layer.src}
                    alt={layer.alt}
                    fill
                    priority
                    sizes="300px"
                    className="object-cover"
                    onLoad={() => setLoaded((n) => n + 1)}
                    style={{ objectPosition: layer.position }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Counter */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 text-center text-white tabular-nums"
            style={{ bottom: "clamp(2rem, 8.5vh, 5.2rem)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={
              exiting ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }
            }
            transition={{ duration: 0.6, delay: exiting ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[clamp(2rem,6vw,3rem)] leading-none font-bold">
              {count}
            </span>
          </motion.div>

          {/* Progress rule, hairline across the foot of the screen */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px bg-white/15"
          >
            <motion.div
              className="h-px w-full origin-left bg-white/70"
              style={{ scaleX: count / 100 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
