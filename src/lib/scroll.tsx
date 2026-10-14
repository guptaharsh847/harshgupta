"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { prefersReducedMotion } from "./hooks";

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

/** Smooth-scroll to a section id ("top" = page top). Falls back to native scrolling. */
export function scrollToTarget(id: string) {
  const target = id === "top" ? 0 : document.getElementById(id);
  if (target === null) return;
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else if (typeof target === "number") {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  } else {
    target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
  if (typeof target !== "number") {
    // move keyboard focus to the section for screen reader / keyboard users
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }
  history.replaceState(null, "", id === "top" ? location.pathname : `#${id}`);
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/** Mounts Lenis once (skipped for reduced motion). */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    let raf = 0;
    const loop = (t: number) => {
      lenis?.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return null;
}
