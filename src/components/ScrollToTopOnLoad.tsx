"use client";

import { useEffect } from "react";

export function ScrollToTopOnLoad() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const scrollTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    scrollTop();
    window.addEventListener("pageshow", scrollTop);

    return () => {
      window.removeEventListener("pageshow", scrollTop);
    };
  }, []);

  return null;
}
