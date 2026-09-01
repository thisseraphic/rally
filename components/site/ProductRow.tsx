"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCursorFollow } from "@/components/motion/useCursorFollow";
import RevealText from "@/components/motion/RevealText";
import FadeUp from "@/components/motion/FadeUp";
import Parallax from "@/components/motion/Parallax";
import Button from "./Button";
import type { Racket } from "@/lib/rackets";

/**
 * One of the three characters. The comp alternates which side the photograph
 * sits on; on lg+ the copy column sticks while the image scrolls past it, so
 * each frame gets a held beat. Below lg the whole thing simply stacks.
 */
export default function ProductRow({
  racket,
  imageSide,
  index,
}: {
  racket: Racket;
  imageSide: "left" | "right";
  index: number;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  // Parks dead centre — the badge only ever appears under a live cursor here.
  const { x, y, track, snapTo } = useCursorFollow(boxRef, { x: 0.5, y: 0.5 });

  // Each frame carries its own accent; the padding is what stops the sticky
  // column short of the photograph's bottom edge at the end of its travel.
  const accentText =
    racket.accent === "orange" ? "text-orange" : "text-green";

  const copy = (
    <div
      className={`w-full lg:sticky lg:top-[18vh] lg:w-[320px] lg:shrink-0 lg:pb-[10vh] ${
        imageSide === "left" ? "lg:order-2" : "lg:order-1"
      }`}
    >
      <p className={`type-eyebrow ${accentText}`}>{racket.name}</p>

      <RevealText
        as="h3"
        className="type-product mt-2 text-ink"
        // The comp breaks each headline by hand; nowrap keeps those breaks
        // instead of letting the 320px column rewrap them.
        lineClassName="whitespace-nowrap"
        lines={racket.headline.map((line, i) =>
          i === racket.accentLine ? (
            <span key={line} className={accentText}>
              {line}
            </span>
          ) : (
            line
          ),
        )}
      />

      <FadeUp delay={0.1} className="type-body mt-3 max-w-[320px] text-grey">
        {racket.blurb}
      </FadeUp>

      <FadeUp delay={0.18} className={`mt-4 text-2xl font-medium ${accentText}`}>
        {racket.price}
      </FadeUp>

      <FadeUp delay={0.24} className="mt-6">
        <Button href="#finder" withArrow accent={racket.accent}>
          See Frame
        </Button>
      </FadeUp>
    </div>
  );

  const photo = (
    <div
      ref={boxRef}
      className={`relative aspect-[4/5] w-full overflow-hidden bg-grey sm:aspect-[797/613] lg:max-w-[797px] lg:flex-1 ${
        imageSide === "left" ? "lg:order-1" : "lg:order-2"
      }`}
      onPointerEnter={(e) => {
        if (e.pointerType === "touch") return;
        snapTo(e);
        setHovered(true);
      }}
      onPointerMove={track}
      onPointerLeave={() => setHovered(false)}
    >
      <Parallax className="absolute inset-0 overflow-hidden" distance={10} scaleFrom={1.14}>
        <Image
          src={racket.image}
          alt={racket.imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 797px"
          priority={index === 0}
          className="object-cover"
        />
      </Parallax>

      {/* "See Frame" trails the cursor while the card is hovered. Pointer-only:
          on touch the button below the copy is the affordance. */}
      {!reduced && (
        <motion.div
          className="pointer-events-none absolute top-0 left-0 z-10 will-change-transform"
          style={{ x, y }}
        >
          <AnimatePresence>
            {hovered && (
              <motion.span
                key="badge"
                className="flex size-[80px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white px-3 text-center text-[11px] leading-[1.2] text-green-deep"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                See Frame
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );

  return (
    <article
      id={racket.id}
      className="shell flex scroll-mt-24 flex-col gap-8 lg:min-h-[78vh] lg:flex-row lg:items-center lg:gap-[100px]"
    >
      {photo}
      {copy}
    </article>
  );
}
