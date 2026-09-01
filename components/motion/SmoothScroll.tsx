"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { useLoader } from "./LoaderProvider";

/**
 * Lenis-driven smooth scrolling for the whole document.
 *
 * Not mounted at all when the OS asks for reduced motion — native scroll is
 * the correct behaviour there, and Lenis would override it.
 *
 * Lenis drives scroll position from its own rAF loop, which means the
 * browser's built-in keyboard scrolling and scroll-on-focus are both
 * swallowed. Both are re-implemented here against `lenis.scrollTo` so the
 * page stays fully usable without a mouse.
 */
export default function SmoothScroll() {
  const reduced = useReducedMotion();
  const { done } = useLoader();

  useEffect(() => {
    // Mounting Lenis before the preloader clears would have it measure a
    // document that is still scroll-locked.
    if (reduced || !done) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.4,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // In-page anchors go through Lenis so the eased scroll is consistent.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
    };

    // Keyboard scrolling, which Lenis otherwise eats.
    const isTypingTarget = (el: EventTarget | null) => {
      const node = el as HTMLElement | null;
      if (!node) return false;
      const tag = node.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        node.isContentEditable
      );
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      const page = window.innerHeight * 0.9;
      const line = 90;
      let delta: number | null = null;
      let absolute: number | null = null;

      switch (event.key) {
        case "PageDown":
          delta = page;
          break;
        case "PageUp":
          delta = -page;
          break;
        case "ArrowDown":
          delta = line;
          break;
        case "ArrowUp":
          delta = -line;
          break;
        case " ":
          delta = event.shiftKey ? -page : page;
          break;
        case "Home":
          absolute = 0;
          break;
        case "End":
          absolute = document.documentElement.scrollHeight;
          break;
        default:
          return;
      }

      event.preventDefault();
      lenis.scrollTo(absolute ?? lenis.targetScroll + (delta ?? 0), {
        duration: 0.7,
      });
    };

    // Tabbing to a control below the fold must bring it into view. Only for
    // keyboard focus — :focus-visible keeps a mouse click from yanking the
    // page when the button happens to sit near the viewport edge.
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target || isTypingTarget(target)) return;
      if (!target.matches(":focus-visible")) return;
      const rect = target.getBoundingClientRect();
      if (rect.top >= 80 && rect.bottom <= window.innerHeight - 40) return;
      lenis.scrollTo(target, { offset: -160, duration: 0.6 });
    };

    document.addEventListener("click", onClick);
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reduced, done]);

  return null;
}
