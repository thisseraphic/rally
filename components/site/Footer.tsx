"use client";

import { type FormEvent, useState } from "react";
import { motion } from "motion/react";
import FadeUp from "@/components/motion/FadeUp";
import Wordmark from "./Wordmark";

const COLUMNS = [
  {
    title: "Customer Service",
    links: ["Contact", "Shipping", "Returns", "FAQ"],
  },
  {
    title: "Information",
    links: ["The Craft", "Care Instructions"],
  },
  {
    title: "Shop",
    links: ["Forecourt", "Baseline", "Volley", "Racket Finder"],
  },
  {
    title: "Find a Stockist",
    links: ["Stockist map", "hello@rallytennis.com"],
  },
];

const PAYMENTS = ["Visa", "MC", "Amex", "PayPal"];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // No backend on this build — the form confirms locally and clears.
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer id="stockists" className="scroll-mt-24 bg-ink text-white">
      {/* Top band: wordmark ⁄ newsletter */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <FadeUp className="flex flex-col justify-center gap-6 border-b border-white/10 px-5 py-12 sm:px-8 lg:border-r lg:border-b-0 lg:py-16 lg:pl-[max(2rem,calc((100vw-1312px)/2))] lg:pr-16">
          <div className="w-[140px] lg:w-[167px]">
            <Wordmark />
          </div>
          <p className="type-nav text-white/30">A racket worth leaving out.</p>
        </FadeUp>

        <FadeUp
          delay={0.1}
          className="flex flex-col justify-center gap-6 px-5 py-12 sm:px-8 lg:py-16 lg:pl-16 lg:pr-[max(2rem,calc((100vw-1312px)/2))]"
        >
          <p className="type-nav text-white/40">Stay in the loop</p>
          <form onSubmit={onSubmit} className="w-full max-w-[592px]">
            <div className="flex border border-white/20 focus-within:border-white/50">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="min-h-11 w-full bg-transparent px-4 py-3.5 text-xs text-white placeholder:text-white/20 focus:outline-none"
              />
              <button
                type="submit"
                className="type-label min-h-11 shrink-0 bg-white/10 px-5 tracking-[0.18em] transition-colors duration-300 hover:bg-white hover:text-ink"
              >
                Subscribe
              </button>
            </div>
            <motion.p
              className="mt-2 text-[10px] leading-[1.5] tracking-[0.025em] text-white/20"
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
            >
              {subscribed
                ? "You're on the list — notes from the workshop are on their way."
                : "New frames, restocks, notes from the workshop."}
            </motion.p>
          </form>
        </FadeUp>
      </div>

      {/* Link columns */}
      <div className="grid grid-cols-2 border-y border-white/10 lg:grid-cols-4">
        {COLUMNS.map((column, i) => (
          <FadeUp
            key={column.title}
            delay={i * 0.07}
            className={`border-white/10 px-5 py-10 sm:px-8 lg:px-10 lg:py-10 ${
              i % 2 === 0 ? "border-r" : ""
            } ${i < 2 ? "border-b lg:border-b-0" : ""} ${
              i === 1 ? "lg:border-r" : ""
            } ${i === 2 ? "lg:border-r" : ""} ${
              i === 0 ? "lg:pl-[max(2rem,calc((100vw-1312px)/2))]" : ""
            }`}
          >
            <p className="type-label text-white/25">{column.title}</p>
            <ul className="mt-5 flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="group inline-flex min-h-11 items-center text-xs tracking-[0.025em] text-white/50 transition-colors duration-300 hover:text-white lg:min-h-0"
                  >
                    <span className="relative">
                      {link}
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-white transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100 motion-reduce:transition-none" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </FadeUp>
        ))}
      </div>

      {/* Legal strip */}
      <div className="shell flex flex-col items-start gap-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:py-[52px]">
        <p className="type-nav text-white/20">
          © {new Date().getFullYear()} Rally. All rights reserved.
        </p>
        <div className="flex flex-wrap gap-6">
          {["Privacy", "Terms", "Accessibility"].map((link) => (
            <a
              key={link}
              href="#"
              className="type-nav text-white/20 transition-colors duration-300 hover:text-white/60"
            >
              {link}
            </a>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {PAYMENTS.map((label) => (
            <span
              key={label}
              className="type-nav border border-white/10 px-2 py-0.5 text-white/20"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
