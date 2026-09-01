"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import RevealText from "@/components/motion/RevealText";
import FadeUp from "@/components/motion/FadeUp";
import Wordmark from "./Wordmark";

/**
 * The full-bleed orange band. The quote and the ghost wordmark behind it
 * travel at different rates as the band crosses the viewport, so it reads as
 * its own plane rather than a flat slab of colour.
 */
export default function QuoteBand() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const quoteX = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const ghostX = useTransform(scrollYProgress, [0, 1], ["-18%", "18%"]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[380px] w-full items-center overflow-hidden bg-orange py-20 lg:min-h-[461px]"
    >
      {/* The wordmark itself, blown up as a ghost behind the quote. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 w-[130vw] -translate-x-1/2 -translate-y-1/2 text-white/10 select-none"
        style={reduced ? undefined : { x: ghostX }}
      >
        <Wordmark />
      </motion.div>

      <motion.div
        className="shell relative z-10 flex flex-col items-center text-center text-white"
        style={reduced ? undefined : { x: quoteX }}
      >
        <RevealText
          as="p"
          className="type-display max-w-[880px]"
          lineClassName="text-white text-balance"
          lines={[
            <>&ldquo;Built to last a decade,</>,
            <>not a season.&rdquo;</>,
          ]}
        />
        <FadeUp delay={0.15} className="type-body mt-4 max-w-[486px]">
          No neon, no swoosh graphics, no yearly redesign. A frame, a leather
          grip, and a reason for both.
        </FadeUp>
      </motion.div>
    </section>
  );
}
