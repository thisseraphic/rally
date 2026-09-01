"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  FINDER_QUESTIONS,
  resolveRacket,
  type Racket,
} from "@/lib/rackets";
import Button from "./Button";

/**
 * The two-question finder, working for real: each answer scores the three
 * frames and the highest total is presented. Steps cross-fade through
 * AnimatePresence; the result photo shares a layoutId with the step panel so
 * it expands into place rather than popping.
 */
export default function RacketFinder() {
  const reduced = useReducedMotion();
  const [answers, setAnswers] = useState<number[]>([]);

  const step = answers.length;
  const question = FINDER_QUESTIONS[step];
  const result: Racket | null =
    step >= FINDER_QUESTIONS.length ? resolveRacket(answers) : null;

  const choose = (optionIndex: number) =>
    setAnswers((prev) => [...prev, optionIndex]);
  const back = () => setAnswers((prev) => prev.slice(0, -1));
  const reset = () => setAnswers([]);

  const panelMotion = {
    initial: { opacity: 0, y: reduced ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduced ? 0 : -18 },
    transition: { duration: reduced ? 0.2 : 0.5, ease: [0.16, 1, 0.3, 1] },
  } as const;

  return (
    <div id="finder-quiz" className="shell mt-16 scroll-mt-28 lg:mt-24">
      <div className="border border-green/20 bg-white">
        {/* Progress rule */}
        <div className="h-px w-full bg-green/15">
          <motion.div
            className="h-px bg-green"
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: Math.min(
                1,
                answers.length / FINDER_QUESTIONS.length || 0.02,
              ),
            }}
            style={{ transformOrigin: "left" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <div className="p-6 sm:p-10 lg:p-14">
          <AnimatePresence mode="wait">
            {question && (
              <motion.div key={question.id} {...panelMotion}>
                <p className="type-eyebrow text-green">
                  Question {question.index} of 0{FINDER_QUESTIONS.length}
                </p>
                <h3 className="type-product mt-3 max-w-[16ch] text-ink">
                  {question.prompt}
                </h3>

                <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {question.options.map((option, i) => (
                    <motion.button
                      key={option.label}
                      type="button"
                      onClick={() => choose(i)}
                      className="group relative min-h-[112px] overflow-hidden border border-green/25 p-5 text-left"
                      initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: reduced ? 0 : 0.08 * i,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      whileHover={reduced ? undefined : { y: -3 }}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 origin-bottom scale-y-0 bg-green transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 motion-reduce:transition-none"
                      />
                      <span className="relative z-10 block text-lg font-semibold text-ink transition-colors duration-300 group-hover:text-white">
                        {option.label}
                      </span>
                      <span className="type-body relative z-10 mt-1 block text-grey transition-colors duration-300 group-hover:text-white/70">
                        {option.detail}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {step > 0 && (
                  <button
                    type="button"
                    onClick={back}
                    className="type-button mt-8 inline-flex min-h-11 items-center text-grey underline-offset-4 hover:text-green hover:underline"
                  >
                    ← Back
                  </button>
                )}
              </motion.div>
            )}

            {result && (
              <motion.div
                key="result"
                {...panelMotion}
                className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12"
              >
                <motion.div
                  layoutId={reduced ? undefined : "finder-result-photo"}
                  className="relative aspect-[4/5] w-full overflow-hidden bg-grey lg:w-[320px] lg:shrink-0"
                >
                  <Image
                    src={result.image}
                    alt={result.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 320px"
                    className="object-cover"
                  />
                </motion.div>

                <div>
                  <p className="type-eyebrow text-orange">Your frame</p>
                  <h3 className="type-product mt-3 text-ink">
                    {result.headline.map((line, i) => (
                      <span
                        key={line}
                        className={
                          i === result.accentLine ? "block text-green" : "block"
                        }
                      >
                        {line}
                      </span>
                    ))}
                  </h3>
                  <p className="type-eyebrow mt-4 text-green">{result.name}</p>
                  <p className="type-body mt-3 max-w-[46ch] text-grey">
                    {result.blurb}
                  </p>
                  <p className="mt-4 text-2xl font-medium text-green">
                    {result.price}
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button href={`#${result.id}`} withArrow>
                      See the {result.name}
                    </Button>
                    <button
                      type="button"
                      onClick={reset}
                      className="type-button inline-flex h-12 min-h-11 items-center justify-center text-grey underline-offset-4 hover:text-green hover:underline sm:px-4"
                    >
                      Start over
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
