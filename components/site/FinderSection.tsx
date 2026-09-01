"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import RevealText from "@/components/motion/RevealText";
import FadeUp from "@/components/motion/FadeUp";
import Parallax from "@/components/motion/Parallax";
import Button from "./Button";
import RacketFinder from "./RacketFinder";

/* Each tile crossfades to a second frame under the cursor. `racket-green`
   serves both the court tile and the orange product tile — only one tile can
   be hovered at a time, so it is never on screen twice. */
const TILES = [
  {
    src: "/media/player.png",
    alt: "Player mid-rally, frame across the body",
    hover: "/media/player-2.jpg",
    hoverAlt: "Player driving through a two-handed backhand",
  },
  {
    src: "/media/court.png",
    alt: "Walking the baseline between points",
    hover: "/media/racket-green.png",
    hoverAlt: "The frame in its green colourway, beside two balls",
  },
  {
    src: "/media/racket.png",
    alt: "The frame standing upright beside two balls",
    hover: "/media/racket-green.png",
    hoverAlt: "The same frame in its green colourway",
  },
] as const;

/** One image band in the finder grid, swapping frames on hover. */
function FinderTile({
  tile,
  index,
  hovered,
  onHover,
}: {
  tile: (typeof TILES)[number];
  index: number;
  hovered: boolean;
  onHover: (index: number | null) => void;
}) {
  return (
    <FadeUp delay={index * 0.1} className="w-[78vw] shrink-0 snap-center sm:w-auto">
      <div
        className="relative aspect-[437/618] w-full overflow-hidden bg-grey"
        // Movement counts as well as entry, so a tile that scrolls up under a
        // stationary cursor still swaps.
        onPointerEnter={(e) => {
          if (e.pointerType !== "touch") onHover(index);
        }}
        onPointerMove={(e) => {
          if (e.pointerType !== "touch") onHover(index);
        }}
        onPointerLeave={() => onHover(null)}
      >
        <Parallax className="absolute inset-0 overflow-hidden" distance={7} scaleFrom={1.1}>
          <Image
            src={tile.src}
            alt={tile.alt}
            fill
            sizes="(max-width: 640px) 78vw, 33vw"
            className="object-cover"
          />
        </Parallax>

        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden={!hovered}
        >
          <Image
            src={tile.hover}
            alt={tile.hoverAlt}
            fill
            sizes="(max-width: 640px) 78vw, 33vw"
            className="object-cover"
          />
        </motion.div>
      </div>
    </FadeUp>
  );
}

export default function FinderSection() {
  // The active tile is tracked for the whole band rather than per tile, so
  // two frames can never be swapped at once even if a pointerleave is missed.
  const [activeTile, setActiveTile] = useState<number | null>(null);

  return (
    <section id="finder" className="scroll-mt-24 py-20 lg:py-[104px]">
      <div className="shell flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <RevealText
          as="h2"
          className="type-finder text-ink"
          lines={[
            "Two",
            <span key="q" className="text-green">
              Questions.
            </span>,
            "One",
            <span key="r" className="text-orange">
              Racket.
            </span>,
          ]}
          stagger={0.07}
        />

        <div className="flex flex-col gap-10 lg:w-[240px] lg:shrink-0 lg:items-end lg:justify-between lg:self-stretch">
          <FadeUp className="type-body text-ink lg:text-right">
            No spec sheet, no seventeen sliders, just how you actually play.
          </FadeUp>
          <FadeUp delay={0.12}>
            <Button href="#finder-quiz" withArrow>
              Find your frame
            </Button>
          </FadeUp>
        </div>
      </div>

      {/* Three-up image band. Below sm it becomes a snap carousel rather
          than three unreadable slivers. */}
      <div className="shell mt-12 lg:mt-[52px]">
        <div
          className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-0 sm:overflow-visible sm:px-0 sm:pb-0"
          onPointerLeave={() => setActiveTile(null)}
        >
          {TILES.map((tile, i) => (
            <FinderTile
              key={tile.src + i}
              tile={tile}
              index={i}
              hovered={activeTile === i}
              onHover={setActiveTile}
            />
          ))}
        </div>
      </div>

      <RacketFinder />
    </section>
  );
}
