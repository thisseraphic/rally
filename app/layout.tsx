import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import MotionProvider from "@/components/motion/MotionProvider";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rally — A racket worth leaving out.",
  description:
    "Three characters, two levels each — built for how you actually play, not how you wish you played. Built to last a decade, not a season.",
};

export const viewport: Viewport = {
  themeColor: "#1e5c3a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={instrumentSans.variable}>
      <body className="font-sans antialiased">
        {/* Inflight review widget. This layout renders no explicit <head>,
            so the tag sits at the top of the body and React hoists it. */}
        <script
          src="https://inflight.co/widget.js"
          data-org="gv9a8gtr"
          async
        ></script>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
