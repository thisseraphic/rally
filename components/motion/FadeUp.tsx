"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance in px the block rises from. */
  y?: number;
  as?: "div" | "li" | "section";
};

/** Generic opacity + rise for body copy, prices, eyebrows and footer columns. */
export default function FadeUp({
  children,
  className,
  delay = 0,
  y = 24,
  as = "div",
}: Props) {
  const reduced = useReducedMotion();

  // With no animation to play there is nothing for a scroll trigger to reveal,
  // so the block is rendered plainly and is present from the start.
  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}
