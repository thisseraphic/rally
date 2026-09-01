"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Wordmark from "./Wordmark";
import { Bag, ChevronDown, Search } from "./Icon";
import { NAV_LINKS, SHOP_MENU } from "@/lib/rackets";

type Currency = "NGN" | "USD";

export default function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [onPaper, setOnPaper] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [drawerShopOpen, setDrawerShopOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>("NGN");
  const shopRef = useRef<HTMLDivElement>(null);

  // Escape closes the shop menu; so does clicking anywhere outside it.
  useEffect(() => {
    if (!shopOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShopOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (!shopRef.current?.contains(e.target as Node)) setShopOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [shopOpen]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    // Past the hero the bar takes a paper background so it stays readable.
    setOnPaper(latest > window.innerHeight - 120);
    // Hide going down, reappear going up — but never while the drawer is open.
    const goingDown = latest > previous && latest > 320;
    if (goingDown) setShopOpen(false);
    setHidden(!menuOpen && goingDown);
  });

  const linkColor = onPaper ? "text-ink" : "text-white";

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={{ y: 0 }}
        animate={{ y: hidden ? "-105%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={`transition-colors duration-500 ${
            onPaper
              ? "border-b border-black/5 bg-white/85 backdrop-blur-md"
              : "bg-transparent"
          }`}
        >
          <div className="shell flex items-center justify-between py-5 lg:py-[72px_0] lg:pt-[34px] lg:pb-[34px]">
            <a
              href="#top"
              className={`w-[76px] shrink-0 transition-colors duration-500 lg:w-[100px] ${linkColor}`}
              aria-label="Rally — home"
            >
              <Wordmark />
            </a>

            {/* Desktop navigation */}
            <nav
              className={`hidden items-center gap-10 transition-colors duration-500 lg:flex ${linkColor}`}
            >
              {NAV_LINKS.map((link) =>
                link.hasMenu ? (
                  <div
                    key={link.label}
                    ref={shopRef}
                    className="relative"
                    onPointerEnter={(e) => {
                      if (e.pointerType !== "touch") setShopOpen(true);
                    }}
                    onPointerLeave={() => setShopOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setShopOpen((open) => !open)}
                      aria-expanded={shopOpen}
                      aria-haspopup="true"
                      className="type-nav group relative inline-flex items-center gap-1"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100 motion-reduce:transition-none" />
                      </span>
                      <ChevronDown
                        className={`size-4 transition-transform duration-300 ${
                          shopOpen ? "rotate-180" : "group-hover:translate-y-0.5"
                        }`}
                      />
                    </button>

                    {/* Figma 345:2206 — 120px column, 1px rule, rows divided
                        by the same rule, left-aligned under the trigger. */}
                    <AnimatePresence>
                      {shopOpen && (
                        <motion.div
                          key="shop-menu"
                          className={`absolute top-full left-0 z-10 mt-[11px] w-[120px] border ${
                            onPaper
                              ? "border-ink/20 bg-white/95 backdrop-blur-md"
                              : "border-white"
                          }`}
                          initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                          animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                          exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                          {SHOP_MENU.map((item, i) => (
                            <a
                              key={item.label}
                              href={item.href}
                              onClick={() => setShopOpen(false)}
                              // The panel is a floating surface, so it states
                              // its own colour rather than inheriting the bar's.
                              className={`type-nav block px-4 py-3 transition-colors duration-200 ${
                                i < SHOP_MENU.length - 1 ? "border-b" : ""
                              } ${
                                onPaper
                                  ? "border-ink/20 text-ink hover:bg-ink hover:text-white"
                                  : "border-white text-white hover:bg-white hover:text-green"
                              }`}
                            >
                              {item.label}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="type-nav group relative inline-flex items-center gap-1"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100 motion-reduce:transition-none" />
                    </span>
                  </a>
                ),
              )}
            </nav>

            <div
              className={`flex items-center gap-4 transition-colors duration-500 lg:gap-6 ${linkColor}`}
            >
              {/* Currency toggle — the filled cell is the active one. */}
              <div
                className="hidden items-center border border-current sm:flex"
                role="group"
                aria-label="Currency"
              >
                {(
                  [
                    ["NGN", "₦"],
                    ["USD", "$"],
                  ] as const
                ).map(([code, symbol]) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCurrency(code)}
                    aria-pressed={currency === code}
                    className={`flex size-6 items-center justify-center text-xs transition-colors duration-300 ${
                      currency === code
                        ? onPaper
                          ? "bg-ink text-white"
                          : "bg-white text-green"
                        : "bg-transparent"
                    }`}
                  >
                    {symbol}
                  </button>
                ))}
              </div>

              <button
                type="button"
                aria-label="Search"
                className="flex size-11 items-center justify-center transition-transform duration-300 hover:scale-110 lg:size-4"
              >
                <Search className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Cart"
                className="flex size-11 items-center justify-center transition-transform duration-300 hover:scale-110 lg:size-4"
              >
                <Bag className="size-4" />
              </button>

              {/* Hamburger — below lg only */}
              <button
                type="button"
                onClick={() => {
                  setDrawerShopOpen(false);
                  setMenuOpen(true);
                }}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className="flex size-11 flex-col items-center justify-center gap-[5px] lg:hidden"
              >
                <span className="block h-px w-5 bg-current" />
                <span className="block h-px w-5 bg-current" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer. Always mounted and driven by `menuOpen` rather than
          mounted through AnimatePresence: interactivity then comes from state,
          not from an exit animation finishing. A paused rAF in a backgrounded
          tab used to leave this full-screen panel mounted and still catching
          taps; now it is inert the moment the state flips, animation or no. */}
      <motion.div
        className={`fixed inset-0 z-60 flex flex-col bg-green text-white lg:hidden ${
          menuOpen ? "" : "pointer-events-none"
        }`}
        initial={false}
        animate={{
          clipPath: menuOpen ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
        }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        aria-hidden={!menuOpen}
        // Keeps the closed drawer out of the tab order as well as off screen
        // readers — without this you can Tab into links you cannot see.
        inert={!menuOpen}
      >
            <div className="shell flex items-center justify-between py-5">
              <div className="w-[76px]">
                <Wordmark />
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex size-11 items-center justify-center"
              >
                <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
                  <path
                    d="M5 5L19 19M19 5L5 19"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <nav className="shell flex flex-1 flex-col justify-center gap-2 pb-24">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={false}
                  animate={
                    menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{
                    delay: menuOpen ? 0.25 + i * 0.07 : 0,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {link.hasMenu ? (
                    <>
                      {/* Shop opens the same four destinations the desktop
                          dropdown offers, in place. */}
                      <button
                        type="button"
                        onClick={() => setDrawerShopOpen((open) => !open)}
                        aria-expanded={drawerShopOpen}
                        className="type-display flex w-full items-center gap-3 py-2 text-left text-[clamp(2rem,11vw,3.25rem)] leading-[1.05]"
                      >
                        {link.label}
                        <ChevronDown
                          className={`size-6 shrink-0 transition-transform duration-300 ${
                            drawerShopOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {drawerShopOpen && (
                          <motion.ul
                            key="drawer-shop"
                            className="overflow-hidden border-l border-white/25 pl-5"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.4,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                          >
                            {SHOP_MENU.map((item) => (
                              <li key={item.label}>
                                <a
                                  href={item.href}
                                  onClick={() => setMenuOpen(false)}
                                  className="type-nav flex min-h-11 items-center text-sm text-white/70 transition-colors duration-200 hover:text-white"
                                >
                                  {item.label}
                                </a>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <a
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="type-display block py-2 text-[clamp(2rem,11vw,3.25rem)] leading-[1.05]"
                    >
                      {link.label}
                    </a>
                  )}
                </motion.div>
              ))}
            </nav>

            <div className="shell type-nav flex items-center justify-between border-t border-white/15 py-6 text-white/60">
              <span>hello@rallytennis.com</span>
              <span>{currency === "NGN" ? "₦ NGN" : "$ USD"}</span>
            </div>
      </motion.div>
    </>
  );
}
