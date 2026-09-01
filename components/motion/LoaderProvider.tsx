"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type LoaderState = {
  /** True once the preloader has finished and handed the page over. */
  done: boolean;
  markDone: () => void;
};

const LoaderContext = createContext<LoaderState>({
  done: true,
  markDone: () => {},
});

/**
 * Lets the preloader tell the rest of the page when it has cleared, so the
 * hero holds its entrance and Lenis waits to measure until the site is
 * actually on screen.
 */
export function LoaderProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(false);
  const markDone = useCallback(() => setDone(true), []);
  const value = useMemo(() => ({ done, markDone }), [done, markDone]);

  return (
    <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>
  );
}

export const useLoader = () => useContext(LoaderContext);
