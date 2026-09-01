"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import RevealText from "@/components/motion/RevealText";
import FadeUp from "@/components/motion/FadeUp";
import Parallax from "@/components/motion/Parallax";
import { useCursorFollow } from "@/components/motion/useCursorFollow";
import Button from "./Button";

/**
 * The craft section, pinned. The photograph starts in the slot the comp draws
 * it in (340:1495) and opens out to fill the content column (345:1986) as the
 * copy fades away, ending on the "Scroll" badge.
 *
 * The image itself never moves or scales — it is laid out at its final size
 * from the start and revealed through an animated `clip-path: inset()` that
 * begins matched to the slot's rect. That keeps it pin-sharp the whole way and
 * costs nothing but a compositor property.
 */

export default function CraftSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  // How far the slot sits inside the expanded media box, per edge. These are
  // motion values rather than React state on purpose: measuring on every
  // resize would otherwise re-render the whole subtree mid-scroll and stomp
  // on the style bindings Motion has already established.
  const insetTop = useMotionValue(0);
  const insetRight = useMotionValue(0);
  const insetBottom = useMotionValue(0);
  const insetLeft = useMotionValue(0);

  const measure = useCallback(() => {
    const slot = slotRef.current;
    const media = mediaRef.current;
    if (!slot || !media) return;
    const s = slot.getBoundingClientRect();
    const m = media.getBoundingClientRect();
    if (!m.width || !s.width) return;
    insetTop.set(Math.max(0, s.top - m.top));
    insetRight.set(Math.max(0, m.right - s.right));
    insetBottom.set(Math.max(0, m.bottom - s.bottom));
    insetLeft.set(Math.max(0, s.left - m.left));
  }, [insetTop, insetRight, insetBottom, insetLeft]);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (slotRef.current) observer.observe(slotRef.current);
    if (mediaRef.current) observer.observe(mediaRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // Only run the film while the section is anywhere near the screen — a 720p
  // loop playing three sections away is wasted decode.
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "200px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // 1 while the photograph is still boxed in the slot, 0 once it fills the
  // frame. The clip opens over the first three quarters of the runway, then
  // holds so the picture gets a beat on its own before the section unpins.
  const boxed = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const top = useTransform(() => insetTop.get() * boxed.get());
  const right = useTransform(() => insetRight.get() * boxed.get());
  const bottom = useTransform(() => insetBottom.get() * boxed.get());
  const left = useTransform(() => insetLeft.get() * boxed.get());
  const radius = useTransform(() => 2 * boxed.get());
  const clipPath = useMotionTemplate`inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;

  const copyY = useTransform(scrollYProgress, [0, 0.42], [0, -40]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  // Opacity is handed to CSS as a custom property rather than bound directly.
  // A plain `style={{ opacity }}` binding gets stomped here by the re-renders
  // in this subtree; a custom property survives them.
  const copyOpacity = useMotionTemplate`${useTransform(scrollYProgress, [0, 0.42], [1, 0])}`;
  const badgeOpacity = useMotionTemplate`${useTransform(scrollYProgress, [0.62, 0.82], [0, 1])}`;

  // The badge trails the cursor across the photograph, and parks at the spot
  // the comp draws it (71.4% across, centred) whenever there is no pointer.
  const {
    x: badgeX,
    y: badgeY,
    track: trackPointer,
    parkBadge,
  } = useCursorFollow(mediaRef);

  /* ── Reduced motion: the comp's static layout, no pin, no scroll rig ── */
  if (reduced) {
    return (
      <section id="craft" className="shell scroll-mt-24 py-20 lg:py-[104px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-[254px]">
          <RevealText
            as="h2"
            className="type-display max-w-[803px] text-ink"
            lines={[
              <>&ldquo;Built to last a</>,
              <>
                <span className="text-green">Decade,</span> not a season.&rdquo;
              </>,
            ]}
          />
          <FadeUp className="type-body max-w-[255px] shrink-0 text-grey lg:pt-2">
            No neon, no swoosh graphics, no yearly redesign. A frame, a leather
            grip, and a reason for both.
          </FadeUp>
        </div>
        <div className="mt-12 flex flex-col gap-10 lg:mt-20 lg:flex-row lg:items-start lg:gap-[243px]">
          <FadeUp className="shrink-0">
            <Button href="#characters" withArrow>
              Read the craft story
            </Button>
          </FadeUp>
          <Parallax className="relative aspect-[16/11] w-full overflow-hidden bg-[#d9d9d9] lg:aspect-[869/618] lg:max-w-[869px]">
            <Image
              src="/media/court.png"
              alt="A player walking the baseline on a hard court at dusk, racket in hand"
              fill
              sizes="(max-width: 1024px) 100vw, 869px"
              className="object-cover"
            />
          </Parallax>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="craft"
      // The runway: one viewport of pin plus 150svh of scroll to open the clip.
      className="relative scroll-mt-24 h-[250svh]"
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* Copy layer — the comp's static composition, which fades as the
            photograph takes the screen. `slot` is the invisible box the clip
            starts matched to. */}
        <motion.div
          className="shell flex h-full w-full flex-col justify-center gap-6 py-24 opacity-[var(--fade,1)] sm:gap-8 lg:py-28"
          style={{ "--fade": copyOpacity, y: copyY } as never}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-[254px]">
            <RevealText
              as="h2"
              className="type-display max-w-[803px] text-ink"
              lines={[
                <>&ldquo;Built to last a</>,
                <>
                  <span className="text-green">Decade,</span> not a
                  season.&rdquo;
                </>,
              ]}
            />
            <FadeUp
              delay={0.15}
              className="type-body max-w-[255px] shrink-0 text-grey lg:pt-2"
            >
              No neon, no swoosh graphics, no yearly redesign. A frame, a
              leather grip, and a reason for both.
            </FadeUp>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-[243px]">
            <FadeUp delay={0.1} className="shrink-0 lg:self-start">
              <Button href="#characters" withArrow>
                Read the craft story
              </Button>
            </FadeUp>
            {/* Invisible: it exists only to give the clip its starting rect. */}
            <div
              ref={slotRef}
              aria-hidden="true"
              className="min-h-0 w-full flex-1 lg:max-w-[869px]"
            />
          </div>
        </motion.div>

        {/* Media layer — full bleed, laid out at its final size from the
            start and revealed through the clip. */}
        <motion.div
          ref={mediaRef}
          className="absolute inset-0 overflow-hidden bg-[#d9d9d9]"
          style={{ clipPath }}
          onPointerMove={trackPointer}
          onPointerLeave={parkBadge}
        >
          <motion.div className="size-full" style={{ scale: imageScale }}>
            {/* No poster: court.png is a 6 MB source served raw here, which
                would land ahead of the 2 MB film. The box carries its own
                placeholder fill until the first frame paints. */}
            <video
              ref={videoRef}
              className="size-full object-cover"
              src="/media/craft.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-label="A player rallying on a colonnaded court"
            />
          </motion.div>

          {/* "Scroll" badge — 124px circle, 2px white rule (node 345:1988),
              trailing the cursor on a spring. */}
          <motion.div
            className="pointer-events-none absolute top-0 left-0 will-change-transform"
            style={{ x: badgeX, y: badgeY }}
          >
            <motion.div
              className="flex size-[88px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-sm text-white opacity-[var(--fade,0)] lg:size-[124px]"
              style={{ "--fade": badgeOpacity } as never}
            >
              Scroll
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
