"use client";

import { useEffect, useRef } from "react";
import { ACHIEVEMENTS, type Achievement } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import TechLogo, { brandTint, isBrand } from "@/components/ui/TechLogo";

const css = `
@layer components {
.ach { position: relative; }
.ach-sticky { position: sticky; top: 0; height: 100svh; overflow: hidden; display: flex; flex-direction: column; justify-content: center;
  gap: clamp(28px, 5vh, 56px); padding-block: 88px 32px; }
.ach-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
.ach-progress { width: min(280px, 40vw); height: 2px; background: var(--line); border-radius: 2px; overflow: hidden; margin-bottom: 10px; }
.ach-progress i { display: block; height: 100%; background: var(--ink); transform-origin: 0 50%; transform: scaleX(0); }
.ach-track { display: flex; gap: clamp(14px, 1.6vw, 22px); list-style: none; margin: 0; width: max-content; will-change: transform;
  padding: 18px max(var(--gutter), calc((100vw - 1320px) / 2)) 30px; align-items: center; }
.ach-card { position: relative; flex: none; width: min(clamp(340px, 40vw, 540px), calc(100vw - 2 * var(--gutter)));
  height: clamp(260px, 36vh, 310px); border-radius: 28px; background: var(--card); box-shadow: var(--hair);
  padding: clamp(20px, 2vw, 28px); display: flex; flex-direction: column; justify-content: space-between;
  transition: transform .8s var(--ease), box-shadow .8s var(--ease); }
.ach-card.is-near { transform: translateY(-12px); box-shadow: var(--hair), 0 40px 70px -34px rgba(13,13,13,.4), 0 10px 24px -14px rgba(13,13,13,.14); }
.ach-top { display: flex; justify-content: space-between; align-items: flex-start; }
.ach-logo { position: relative; width: 72px; height: 72px; border-radius: 20px; background: var(--card); box-shadow: var(--hair);
  display: grid; place-items: center; isolation: isolate; }
.ach-logo::before { content: ""; position: absolute; inset: -26px; z-index: -1;
  background: radial-gradient(closest-side, var(--tint), transparent); opacity: .2; transition: opacity .8s var(--ease); }
.ach-card.is-near .ach-logo::before { opacity: .42; }
.ach-logo svg { color: var(--ink); }
.ach-idx { font: 500 12px/1 var(--font-mono); color: var(--mute); }
.ach-bottom { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
.ach-text { min-width: 0; max-width: 60%; }
.ach-label { font: 500 11px/1.3 var(--font-mono); text-transform: uppercase; letter-spacing: .06em; color: var(--mute); }
.ach-caption { margin-top: 8px; font-weight: 600; font-size: 16px; letter-spacing: -0.02em; line-height: 1.3; }
.ach-detail { margin-top: 6px; font-size: 13px; color: var(--mute); line-height: 1.4; }
.ach-num { font-weight: 700; font-size: clamp(72px, 8vw, 128px); letter-spacing: -0.06em; line-height: .8; white-space: nowrap;
  font-variant-numeric: tabular-nums; display: flex; align-items: flex-start; gap: 6px; }
.ach-num small { font: 400 italic clamp(18px, 1.6vw, 24px)/1 var(--font-serif); color: var(--mute); letter-spacing: 0; margin-top: .2em; }
.ach-end { flex: none; padding: 0 clamp(24px, 4vw, 64px); font-weight: 700; font-size: clamp(28px, 3vw, 44px); letter-spacing: -0.045em;
  white-space: nowrap; color: var(--ink); }
.ach-end span { font-family: var(--font-serif); font-style: italic; font-weight: 400; color: var(--mute); }
@media (max-width: 599px) {
  .ach-text { max-width: 58%; }
  .ach-caption { font-size: 14.5px; }
  .ach-num { font-size: 64px; }
}
}
`;

function format(a: Achievement, v: number) {
  return v.toFixed(a.decimals);
}

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const barRef = useRef<HTMLElement>(null);

  // pinned horizontal scroll + nearest-card lift
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    let travel = 0;
    let raf = 0;
    let active = false;

    const measure = () => {
      travel = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `${window.innerHeight + travel}px`;
    };

    const tick = () => {
      const r = section.getBoundingClientRect();
      const span = section.offsetHeight - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      track.style.transform = `translate3d(${(-p * travel).toFixed(2)}px,0,0)`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      const mid = window.innerWidth / 2;
      let best: Element | null = null;
      let bestD = Infinity;
      track.querySelectorAll(".ach-card").forEach((c) => {
        const b = c.getBoundingClientRect();
        const d = Math.abs(b.left + b.width / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      });
      track.querySelectorAll(".ach-card").forEach((c) => c.classList.toggle("is-near", c === best));
      if (active) raf = requestAnimationFrame(tick);
    };

    measure();
    tick();
    const io = new IntersectionObserver(([e]) => {
      active = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (active) raf = requestAnimationFrame(tick);
    });
    io.observe(section);
    const ro = new ResizeObserver(() => {
      measure();
      tick();
    });
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // count-up once per card (easeOutQuart, 1.4 s)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduced = prefersReducedMotion();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          const el = e.target.querySelector<HTMLElement>("[data-count]");
          if (!el) continue;
          const i = Number(el.dataset.count);
          const a = ACHIEVEMENTS[i];
          if (reduced) {
            el.textContent = format(a, a.value);
            continue;
          }
          const t0 = performance.now();
          const step = (now: number) => {
            const t = Math.min(1, (now - t0) / 1400);
            const eased = 1 - Math.pow(1 - t, 4);
            el.textContent = format(a, a.value * eased);
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 },
    );
    track.querySelectorAll(".ach-card").forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const total = String(ACHIEVEMENTS.length).padStart(2, "0");

  return (
    <section id="achievements" ref={sectionRef} className="ach" aria-labelledby="ach-title">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="ach-sticky">
        <div className="wrap ach-head">
          <div>
            <p className="tag rv">
              <span>06 — Achievements</span>
            </p>
            <h2 id="ach-title" className="h-section mt-6">
              <span className="rv-mask">
                <span>
                  Numbers <span className="accent">so far.</span>
                </span>
              </span>
            </h2>
          </div>
          <div className="ach-progress" aria-hidden="true">
            <i ref={barRef} />
          </div>
        </div>

        <ol ref={trackRef} className="ach-track">
          {ACHIEVEMENTS.map((a, i) => {
            const tint = isBrand(a.logo) ? brandTint(a.logo) : "#8a8a8a";
            return (
              <li key={a.label} className="ach-card">
                <div className="ach-top">
                  <span className="ach-logo" style={{ "--tint": tint } as React.CSSProperties}>
                    <TechLogo name={a.logo} size={36} />
                  </span>
                  <span className="ach-idx" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")} / {total}
                  </span>
                </div>
                <div className="ach-bottom">
                  <div className="ach-text">
                    <p className="ach-label">{a.label}</p>
                    <p className="ach-caption">{a.caption}</p>
                    <p className="ach-detail">{a.detail}</p>
                  </div>
                  <p className="ach-num">
                    <span className="sr-only">{`${format(a, a.value)}${a.suffix ? ` ${a.suffix.replace("+ ", "+ ")}` : ""}`}</span>
                    <span data-count={i} aria-hidden="true">
                      {format(a, 0)}
                    </span>
                    {a.suffix && <small aria-hidden="true">{a.suffix}</small>}
                  </p>
                </div>
              </li>
            );
          })}
          <li className="ach-end" aria-hidden="true">
            and <span>counting</span> →
          </li>
        </ol>
      </div>
    </section>
  );
}
