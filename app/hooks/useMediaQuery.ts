"use client";

import { useSyncExternalStore } from "react";

export const useMediaQuery = (query: string) => {
  const subscribe = (notify: () => void) => {
    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener("change", notify);
    return () => mediaQuery.removeEventListener("change", notify);
  };

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
};

export const useIsClient = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
