"use client";

import { type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { LoaderProvider } from "./LoaderProvider";
import SmoothScroll from "./SmoothScroll";
import Preloader from "./Preloader";

/**
 * Client boundary for everything motion-related that wraps the whole page.
 * `reducedMotion="user"` makes Motion drop transform animations when the OS
 * asks; individual components additionally branch on useReducedMotion for the
 * things Motion can't infer on its own (clip paths, video autoplay, Lenis).
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LoaderProvider>
        <SmoothScroll />
        <Preloader />
        {children}
      </LoaderProvider>
    </MotionConfig>
  );
}
