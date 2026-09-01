"use client";

import {
  Fragment,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useRef,
} from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

type Props = {
  /** One entry per rendered line. Each line's words animate in turn. */
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  delay?: number;
  /** Stagger between words, in seconds. */
  stagger?: number;
  /**
   * Extra gate on top of the viewport check. The hero is in view from the
   * first frame, so it uses this to wait for the preloader to hand over.
   */
  active?: boolean;
};

/**
 * Reveals display type word by word: every word rises out of its own mask,
 * one after the next, the first time the block comes into view.
 *
 * Lines may be plain strings or elements — a coloured `<span>` around part of
 * a line keeps its styling, and only the text inside it is split.
 */
export default function RevealText({
  lines,
  className,
  lineClassName,
  as: Tag = "div",
  delay = 0,
  stagger = 0.045,
  active = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView =
    useInView(ref, { once: true, margin: "-15% 0px -10% 0px" }) && active;
  const reduced = useReducedMotion();

  // With no reveal to play, the lines are rendered plainly rather than gated
  // behind a scroll trigger that would never animate anything.
  if (reduced) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i} className={`block ${lineClassName ?? ""}`}>
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  // Runs across the whole block so words lift in reading order, line to line.
  const counter = { i: 0 };

  const renderWord = (word: string, index: number, key: string) => (
    <span key={key} className="inline-block overflow-hidden align-bottom">
      <motion.span
        className="inline-block"
        style={{ willChange: "transform" }}
        initial={{ y: "110%" }}
        animate={{ y: inView ? "0%" : "110%" }}
        transition={{
          duration: 0.75,
          delay: delay + index * stagger,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {word}
      </motion.span>
    </span>
  );

  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, i) => (
        <span key={i} className={`block ${lineClassName ?? ""}`}>
          {splitWords(line, counter, renderWord)}
        </span>
      ))}
    </Tag>
  );
}

/**
 * Walks a line and wraps each word so it can be animated on its own, leaving
 * whitespace and any element wrappers (a coloured span, a fragment) intact.
 */
function splitWords(
  node: ReactNode,
  counter: { i: number },
  renderWord: (word: string, index: number, key: string) => ReactNode,
): ReactNode {
  if (typeof node === "string" || typeof node === "number") {
    // Splitting on the separator keeps the spaces as their own entries, so
    // words stay spaced and the line still wraps naturally.
    return String(node)
      .split(/(\s+)/)
      .map((part, i) =>
        part.trim()
          ? renderWord(part, counter.i++, `w${counter.i}-${i}`)
          : part,
      );
  }

  if (Array.isArray(node)) {
    return node.map((child, i) => (
      <Fragment key={i}>{splitWords(child, counter, renderWord)}</Fragment>
    ));
  }

  if (isValidElement(node)) {
    const element = node as ReactElement<{ children?: ReactNode }>;
    return cloneElement(
      element,
      undefined,
      splitWords(element.props.children, counter, renderWord),
    );
  }

  return node;
}
