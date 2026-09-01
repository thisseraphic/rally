"use client";

import { type ReactNode, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";

type Props = {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  /** How far the button leans toward the cursor, in px. */
  strength?: number;
  ariaLabel?: string;
};

/**
 * Leans toward the pointer while hovered and springs back on leave.
 * Under reduced motion it is a plain link/button with hover colour only.
 */
export default function MagneticButton({
  children,
  className,
  href,
  onClick,
  type = "button",
  strength = 8,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (event: React.PointerEvent) => {
    if (reduced || event.pointerType === "touch") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    x.set(relX * strength * 2);
    y.set(relY * strength * 2);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const shared = {
    ref: ref as never,
    className,
    onPointerMove: handleMove,
    onPointerLeave: handleLeave,
    style: reduced ? undefined : { x: springX, y: springY },
    "aria-label": ariaLabel,
  };

  if (href) {
    return (
      <motion.a {...shared} href={href} onClick={onClick}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button {...shared} type={type} onClick={onClick}>
      {children}
    </motion.button>
  );
}
