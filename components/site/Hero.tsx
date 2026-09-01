"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { useLoader } from "@/components/motion/LoaderProvider";
import RevealText from "@/components/motion/RevealText";
import Button from "./Button";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  // The preloader owns the screen first; the hero enters as it unfolds away.
  const { done } = useLoader();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The video drifts at roughly a third of scroll speed and a scrim deepens
  // over it, so the section darkens down into the white block that follows.
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const scrimOpacity = useTransform(scrollYProgress, [0, 1], [0.45, 0.9]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex h-[100svh] max-h-[982px] min-h-[560px] w-full items-end overflow-hidden bg-green [@media(max-height:560px)]:min-h-0"
    >
      {/* Background film */}
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { y: videoY, scale: videoScale }}
      >
        <motion.div
          className="size-full"
          initial={{ opacity: 0, scale: reduced ? 1 : 1.08 }}
          animate={done ? { opacity: 1, scale: 1 } : { opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <video
            className="size-full object-cover"
            src="/media/hero.mp4"
            poster="/media/court.png"
            autoPlay={!reduced}
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        </motion.div>
      </motion.div>

      {/* Green wash + bottom scrim so the type always clears the footage */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-green/35 mix-blend-multiply"
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-green-deep via-green-deep/25 to-transparent"
        style={reduced ? { opacity: 0.55 } : { opacity: scrimOpacity }}
      />

      <motion.div
        className="shell relative z-10 w-full pb-12 sm:pb-16 lg:pb-[72px]"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <RevealText
          as="h1"
          className="type-hero max-w-[1106px] text-white"
          lines={["A Racket Worth", "Leaving Out."]}
          active={done}
          delay={0.15}
          stagger={0.06}
        />

        <div className="mt-6 max-w-[413px] sm:mt-8 lg:mt-10">
          <motion.p
            className="text-xs leading-relaxed text-white/90"
            initial={{ opacity: 0, y: reduced ? 0 : 18 }}
            animate={done ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Three characters, two levels each — built for how you actually play,
            not how you wish you played.
          </motion.p>

          <motion.div
            className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: reduced ? 0 : 18 }}
            animate={done ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <Button variant="solid" href="#characters">
              Shop Collection
            </Button>
            <Button variant="outline-light" href="#finder">
              Two-Question Finder
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 hidden h-10 w-px -translate-x-1/2 overflow-hidden bg-white/25 lg:block [@media(max-height:700px)]:lg:hidden"
        initial={{ opacity: 0 }}
        animate={done ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <motion.span
          className="block h-1/2 w-full bg-white"
          animate={reduced ? undefined : { y: ["-100%", "200%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
