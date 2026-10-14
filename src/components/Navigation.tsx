"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE, type SectionId } from "@/lib/data";
import { lockScroll, scrollToTarget } from "@/lib/scroll";

const css = `
@layer components {
.nav { position: fixed; inset: 0 0 auto 0; z-index: 50; pointer-events: none; }
.nav-progress { position: fixed; top: 0; left: 0; right: 0; height: 2px; background: var(--ink);
  transform-origin: 0 50%; transform: scaleX(0); z-index: 60; pointer-events: none; }
.nav-bar { display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding-top: 18px; }
.nav-bar > * { pointer-events: auto; }

.nav-brand { display: inline-flex; align-items: center; gap: 12px; border-radius: 999px; }
.nav-mark { width: 44px; height: 44px; flex: none; border-radius: 999px; display: grid; place-items: center;
  font: 700 14px/1 var(--font-sans); letter-spacing: -0.03em; box-shadow: inset 0 0 0 1.5px var(--ink);
  color: var(--ink); background: transparent;
  transition: background-color .5s var(--ease), color .5s var(--ease), transform 1s var(--ease); }
.nav.is-scrolled .nav-mark { background: var(--ink); color: #fff; }
.nav-brand:hover .nav-mark { transform: rotate(360deg); }
.nav-name { font-weight: 600; font-size: 15px; letter-spacing: -0.02em; white-space: nowrap;
  transition: opacity .5s var(--ease), transform .6s var(--ease); }
.nav.is-scrolled .nav-name { opacity: 0; transform: translateX(-8px); pointer-events: none; }

.nav-pill { position: relative; display: flex; align-items: center; gap: 2px; padding: 5px;
  border-radius: 999px; transition: background-color .5s var(--ease), box-shadow .5s var(--ease); }
.nav.is-scrolled .nav-pill { background: rgba(255,255,255,.72); box-shadow: var(--hair), 0 10px 30px -18px rgba(13,13,13,.3);
  -webkit-backdrop-filter: blur(12px) saturate(1.4); backdrop-filter: blur(12px) saturate(1.4); }
.nav-ind { position: absolute; top: 5px; left: 0; height: calc(100% - 10px); border-radius: 999px; background: var(--ink);
  transition: transform .6s var(--ease), width .6s var(--ease), opacity .3s; opacity: 0; }
.nav-link { position: relative; z-index: 1; height: 36px; padding-inline: 15px; display: inline-flex; align-items: center;
  border-radius: 999px; font-size: 14px; font-weight: 500; color: var(--ink-2); transition: color .4s var(--ease); }
.nav-link:hover { color: var(--ink); }
.nav-link[aria-current="true"] { color: #fff; }

.nav-menu-btn { display: none; height: 44px; padding-inline: 18px; border-radius: 999px; font-size: 14px; font-weight: 600;
  background: rgba(255,255,255,.72); box-shadow: var(--hair); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  align-items: center; gap: 10px; }
.nav-menu-btn i { display: grid; gap: 4px; }
.nav-menu-btn i::before, .nav-menu-btn i::after { content: ""; width: 16px; height: 1.5px; background: var(--ink); border-radius: 2px;
  transition: transform .5s var(--ease); }
.nav-menu-btn[aria-expanded="true"] i::before { transform: translateY(2.75px) rotate(45deg); }
.nav-menu-btn[aria-expanded="true"] i::after { transform: translateY(-2.75px) rotate(-45deg); }

.nav-overlay { position: fixed; inset: 0; z-index: 55; background: var(--paper); pointer-events: auto;
  clip-path: circle(0% at calc(100% - 52px) 40px); visibility: hidden;
  transition: clip-path .8s var(--ease), visibility 0s linear .8s; display: flex; flex-direction: column;
  padding: 96px var(--gutter) 32px; }
.nav-overlay.is-open { clip-path: circle(150% at calc(100% - 52px) 40px); visibility: visible;
  transition: clip-path .9s var(--ease), visibility 0s; }
.nav-overlay ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
.nav-overlay a { display: flex; align-items: baseline; gap: 16px; padding: 6px 0; font-weight: 700;
  font-size: clamp(40px, 12vw, 64px); letter-spacing: -0.045em; line-height: 1.02;
  opacity: 0; transform: translateY(30px); transition: opacity .6s var(--ease), transform .8s var(--ease); }
.nav-overlay a small { font: 500 12px/1 var(--font-mono); color: var(--mute); letter-spacing: .04em; transform: translateY(-1.4em); }
.nav-overlay.is-open a { opacity: 1; transform: none; transition-delay: calc(180ms + var(--i) * 60ms); }
.nav-overlay a[aria-current="true"] { color: var(--mute); }
.nav-overlay-foot { margin-top: auto; display: grid; gap: 6px; font-size: 14px; color: var(--mute); }
.nav-overlay-foot a { all: unset; cursor: pointer; color: var(--ink); text-decoration: underline; text-underline-offset: 4px; }

@media (max-width: 899px) {
  .nav-pill { display: none; }
  .nav-menu-btn { display: inline-flex; position: relative; z-index: 56; }
}
}
`;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);
  const [open, setOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // scrolled state + progress bar
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // active section
  useEffect(() => {
    const ids: SectionId[] = ["top", ...NAV.map((n) => n.id)];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const id = e.target.id as SectionId;
            setActive(id === "top" ? null : id);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // slide the ink indicator under the active link
  const placeIndicator = useCallback(() => {
    const pill = pillRef.current;
    const ind = indRef.current;
    if (!pill || !ind) return;
    const link = active ? pill.querySelector<HTMLElement>(`[data-id="${active}"]`) : null;
    if (!link) {
      ind.style.opacity = "0";
      return;
    }
    ind.style.opacity = "1";
    ind.style.width = `${link.offsetWidth}px`;
    ind.style.transform = `translateX(${link.offsetLeft}px)`;
  }, [active]);

  useLayoutEffect(() => {
    placeIndicator();
  }, [placeIndicator]);

  useEffect(() => {
    window.addEventListener("resize", placeIndicator);
    document.fonts?.ready.then(placeIndicator);
    return () => window.removeEventListener("resize", placeIndicator);
  }, [placeIndicator]);

  // mobile overlay: lock scroll, Esc to close, focus management
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const first = overlayRef.current?.querySelector<HTMLElement>("a");
    const t = setTimeout(() => first?.focus(), 250);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtnRef.current?.focus();
      }
      if (e.key === "Tab" && overlayRef.current) {
        // keep focus inside overlay + menu button
        const items = [menuBtnRef.current, ...overlayRef.current.querySelectorAll<HTMLElement>("a")].filter(
          Boolean,
        ) as HTMLElement[];
        const idx = items.indexOf(document.activeElement as HTMLElement);
        const next = e.shiftKey ? (idx <= 0 ? items.length - 1 : idx - 1) : (idx + 1) % items.length;
        e.preventDefault();
        items[next].focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [open]);

  const go = (id: SectionId) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (open) {
      setOpen(false);
      setTimeout(() => scrollToTarget(id), 380);
    } else {
      scrollToTarget(id);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div ref={progressRef} className="nav-progress" aria-hidden="true" />
      <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
        <div className="wrap nav-bar">
          <a href="#top" className="nav-brand" onClick={go("top")} aria-label={`${PROFILE.name}, back to top`}>
            <span className="nav-mark" aria-hidden="true">
              {PROFILE.initials}
            </span>
            <span className="nav-name">{PROFILE.name}</span>
          </a>

          <nav aria-label="Primary">
            <div ref={pillRef} className="nav-pill">
              <span ref={indRef} className="nav-ind" aria-hidden="true" />
              {NAV.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  data-id={n.id}
                  className="nav-link"
                  aria-current={active === n.id ? "true" : undefined}
                  onClick={go(n.id)}
                >
                  {n.label}
                </a>
              ))}
            </div>
            <button
              ref={menuBtnRef}
              type="button"
              className="nav-menu-btn"
              aria-expanded={open}
              aria-controls="nav-overlay"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? "Close" : "Menu"}
              <i aria-hidden="true" />
            </button>
          </nav>
        </div>
      </header>

      <div
        id="nav-overlay"
        ref={overlayRef}
        className={`nav-overlay${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        inert={!open}
      >
        <ol>
          {NAV.map((n, i) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                onClick={go(n.id)}
                aria-current={active === n.id ? "true" : undefined}
                style={{ "--i": i } as React.CSSProperties}
              >
                <small>{String(i + 1).padStart(2, "0")}</small>
                {n.label}
              </a>
            </li>
          ))}
        </ol>
        <div className="nav-overlay-foot">
          <span>{PROFILE.role}</span>
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
        </div>
      </div>
    </>
  );
}
