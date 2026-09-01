"use client";

import { type ReactNode } from "react";
import RevealText from "@/components/motion/RevealText";
import FadeUp from "@/components/motion/FadeUp";
import Button from "./Button";

/** The "THREE CHARACTERS." block — display lines left, a CTA right. */
export default function SectionHead({
  lines,
  ctaLabel,
  ctaHref,
  id,
}: {
  lines: ReactNode[];
  ctaLabel: string;
  ctaHref: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className="shell flex scroll-mt-24 flex-col gap-8 lg:flex-row lg:items-start lg:justify-between"
    >
      <RevealText as="h2" className="type-display text-ink" lines={lines} />
      <FadeUp delay={0.15} className="shrink-0">
        <Button href={ctaHref} withArrow>
          {ctaLabel}
        </Button>
      </FadeUp>
    </div>
  );
}
