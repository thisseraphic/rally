"use client";

import { type ReactNode, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

type Props = {
  children: ReactNode;
  className?: string;
  /** How far the content drifts against the scroll, in percent of its height. */
  distance?: number;
  /** Optional entry scale — the photo settles from slightly oversized. */
  scaleFrom?: number;
};

/**
 * Drifts its child against the page scroll. Every photograph in the comp is
 * drawn larger than the box that clips it, so the crop only reads correctly
 * when the image actually moves inside that box — this is what does it.
 *
 * The wrapper must be the element with `overflow: hidden`.
 */
export default function Parallax({
  children,
  className,
  distance = 12,
  scaleFrom = 1,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const y = useTransform(smooth, [0, 1], [`-${distance}%`, `${distance}%`]);
  const scale = useTransform(smooth, [0, 0.5, 1], [scaleFrom, 1, scaleFrom]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{ y, scale, height: "100%", width: "100%", willChange: "transform" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
