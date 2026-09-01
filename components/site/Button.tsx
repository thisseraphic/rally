"use client";

import { type ReactNode } from "react";
import MagneticButton from "@/components/motion/MagneticButton";
import { ArrowTurn } from "./Icon";

type Variant = "solid" | "outline" | "outline-light";

const base =
  "type-button group relative inline-flex h-12 w-full items-center justify-center gap-2.5 overflow-hidden px-4 sm:w-[200px]";

type Accent = "green" | "orange";

const variants: Record<Variant, string> = {
  // Hero primary: white plate, green label.
  solid: "bg-white text-green-deep",
  // Everywhere on paper: 1px rule in the block's accent (see `accent`).
  outline: "",
  // Over the hero video and inside the drawer.
  "outline-light": "border border-white text-white",
};

const outlineByAccent: Record<Accent, string> = {
  green: "border border-green text-green-deep",
  orange: "border border-orange text-orange",
};

const fillByAccent: Record<Accent, string> = {
  green: "bg-green",
  orange: "bg-orange",
};

/**
 * The single button in the comp: 200 × 48, 12px label, optional trailing
 * arrow. On hover an ink plate wipes up behind the label and the arrow
 * slides — both purely decorative, both dropped under reduced motion.
 */
export default function Button({
  children,
  variant = "outline",
  href,
  onClick,
  withArrow = false,
  className = "",
  type = "button",
  accent = "green",
}: {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  withArrow?: boolean;
  className?: string;
  type?: "button" | "submit";
  accent?: Accent;
}) {
  const fill =
    variant === "outline-light" ? "bg-white" : fillByAccent[accent];
  const skin =
    variant === "outline" ? outlineByAccent[accent] : variants[variant];
  const hoverText =
    variant === "outline-light"
      ? "group-hover:text-green-deep"
      : "group-hover:text-white";

  return (
    <MagneticButton
      href={href}
      onClick={onClick}
      type={type}
      className={`${base} ${skin} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-bottom scale-y-0 ${fill} transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 motion-reduce:transition-none`}
      />
      <span
        className={`relative z-10 whitespace-nowrap transition-colors duration-300 ${hoverText}`}
      >
        {children}
      </span>
      {withArrow && (
        <ArrowTurn
          className={`relative z-10 size-5 shrink-0 transition-all duration-300 group-hover:translate-x-1 ${hoverText}`}
        />
      )}
    </MagneticButton>
  );
}
