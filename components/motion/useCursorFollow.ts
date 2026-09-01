"use client";

import { type RefObject, useCallback, useEffect } from "react";
import { useMotionValue, useSpring } from "motion/react";

type Park = { x: number; y: number };

/**
 * Makes a badge trail the pointer inside a box, on a spring, and park at a
 * fixed spot whenever there is no pointer over it. Coordinates come back as
 * motion values in the box's own pixel space, ready for `style={{ x, y }}`.
 *
 * Used by the craft section's "Scroll" badge and each product card's
 * "See Frame" badge.
 */
export function useCursorFollow(
  boxRef: RefObject<HTMLElement | null>,
  park: Park = { x: 0.714, y: 0.5 },
) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 180, damping: 26, mass: 0.7 });
  const y = useSpring(pointerY, { stiffness: 180, damping: 26, mass: 0.7 });

  const parkBadge = useCallback(() => {
    const box = boxRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    pointerX.set(r.width * park.x);
    pointerY.set(r.height * park.y);
  }, [boxRef, park.x, park.y, pointerX, pointerY]);

  const track = useCallback(
    (event: React.PointerEvent) => {
      if (event.pointerType === "touch") return;
      const box = boxRef.current;
      if (!box) return;
      const r = box.getBoundingClientRect();
      pointerX.set(event.clientX - r.left);
      pointerY.set(event.clientY - r.top);
    },
    [boxRef, pointerX, pointerY],
  );

  /** Drop the badge straight to the pointer so it doesn't fly in from the park. */
  const snapTo = useCallback(
    (event: React.PointerEvent) => {
      if (event.pointerType === "touch") return;
      const box = boxRef.current;
      if (!box) return;
      const r = box.getBoundingClientRect();
      pointerX.jump(event.clientX - r.left);
      pointerY.jump(event.clientY - r.top);
      x.jump(event.clientX - r.left);
      y.jump(event.clientY - r.top);
    },
    [boxRef, pointerX, pointerY, x, y],
  );

  useEffect(parkBadge, [parkBadge]);

  return { x, y, track, parkBadge, snapTo };
}
