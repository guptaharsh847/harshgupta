"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True once (or while, if `once` is false) the element intersects the viewport. */
export function useInView<T extends Element>(
  options: IntersectionObserverInit & { once?: boolean } = {},
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const { once = true, root, rootMargin, threshold } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { root, rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, root, rootMargin, threshold]);

  return [ref, inView];
}

/**
 * Scroll progress (0 → 1) of an element through the viewport, written into a
 * callback on every animation frame while the element is near the viewport.
 * `start`/`end` are viewport fractions: progress is 0 when the element's top
 * reaches `start * vh` and 1 when its bottom reaches `end * vh`.
 */
export function useScrollProgress<T extends HTMLElement>(
  onProgress: (p: number, el: T) => void,
  { start = 1, end = 0 }: { start?: number; end?: number } = {},
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const cb = useRef(onProgress);
  cb.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let active = false;
    let last = -1;

    const tick = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const from = r.top - vh * start;
      const total = r.height + vh * start - vh * end;
      const p = Math.min(1, Math.max(0, -from / Math.max(1, total)));
      if (p !== last) {
        last = p;
        cb.current(p, el);
      }
      if (active) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        active = e.isIntersecting;
        cancelAnimationFrame(raf);
        if (active) raf = requestAnimationFrame(tick);
        else tick(); // settle at 0 or 1
      },
      { rootMargin: "20% 0px 20% 0px" },
    );
    io.observe(el);
    const onResize = () => tick();
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [start, end]);

  return ref;
}

export function useMediaQuery(query: string): boolean {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}
