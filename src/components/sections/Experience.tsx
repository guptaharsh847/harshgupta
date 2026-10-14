"use client";

import { useRef } from "react";
import { TIMELINE } from "@/lib/data";
import { prefersReducedMotion, useScrollProgress } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";
import SectionHead from "@/components/ui/SectionHead";

const css = `
@layer components {
.tl { position: relative; margin-top: 72px; --year-w: 200px; --spine-x: calc(var(--year-w) + 28px); }
.tl-spine, .tl-fill { position: absolute; top: 6px; bottom: 0; left: var(--spine-x); width: 2px; margin-left: -1px; border-radius: 2px; }
.tl-spine { background: var(--line); }
.tl-fill { background: var(--ink); transform-origin: 50% 0; transform: scaleY(0); will-change: transform; }
.tl-list { list-style: none; margin: 0; padding: 0; display: grid; gap: clamp(40px, 6vh, 64px); }
.tl-stop { display: grid; grid-template-columns: var(--year-w) 56px minmax(0, 1fr); align-items: start; }
.tl-year { text-align: right; font: 500 13px/1.6 var(--font-mono); color: var(--faint); transition: color .6s var(--ease); padding-top: 2px; }
.tl-dot { justify-self: center; position: relative; width: 14px; height: 14px; margin-top: 5px; border-radius: 99px; background: var(--paper);
  box-shadow: inset 0 0 0 2px var(--faint); transition: box-shadow .6s var(--ease), transform .6s var(--ease); z-index: 1; }
.tl-dot::after { content: ""; position: absolute; inset: -7px; border-radius: 99px; box-shadow: 0 0 0 1px var(--ink); opacity: 0; transform: scale(.6);
  transition: opacity .6s var(--ease), transform .8s var(--ease); }
.tl-body { opacity: .38; transform: translateX(-8px); transition: opacity .8s var(--ease), transform .9s var(--ease); max-width: 62ch; }
.tl-kind { font: 500 10.5px/1 var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--mute); display: inline-flex; gap: 8px; align-items: center; }
.tl-kind::before { content: ""; width: 14px; height: 1px; background: currentColor; }
.tl-title { margin-top: 10px; font-weight: 700; font-size: clamp(20px, 2vw, 28px); letter-spacing: -0.03em; line-height: 1.12; }
.tl-place { margin-top: 6px; font-size: 15px; font-weight: 500; color: var(--ink-2); }
.tl-detail { margin-top: 10px; font-size: 14.5px; line-height: 1.6; color: var(--mute); }
.tl-stop.is-lit .tl-year { color: var(--ink); }
.tl-stop.is-lit .tl-dot { box-shadow: inset 0 0 0 7px var(--ink); transform: scale(1.05); }
.tl-stop.is-lit .tl-dot::after { opacity: .18; transform: none; }
.tl-stop.is-lit .tl-body { opacity: 1; transform: none; }

.tl-next { margin-top: clamp(48px, 7vh, 72px); margin-left: calc(var(--spine-x) + 28px); border-radius: 26px; border: 1.5px dashed rgba(13,13,13,.28);
  padding: clamp(24px, 3vw, 36px); display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
.tl-next p:first-child { font: 500 12px/1 var(--font-mono); text-transform: uppercase; letter-spacing: .06em; color: var(--mute); }
.tl-next h3 { margin-top: 10px; font-weight: 700; font-size: clamp(28px, 3vw, 44px); letter-spacing: -0.045em; line-height: 1; }

@media (max-width: 759px) {
  .tl { --spine-x: 7px; }
  .tl-stop { grid-template-columns: 14px minmax(0,1fr); column-gap: 22px; }
  .tl-year { grid-column: 2; grid-row: 1; text-align: left; }
  .tl-dot { grid-column: 1; grid-row: 1; margin-top: 4px; }
  .tl-body { grid-column: 2; }
  .tl-next { margin-left: 36px; }
}
@media (prefers-reduced-motion: reduce) {
  .tl-fill { transform: none; }
  .tl-body { opacity: 1; transform: none; }
}
}
`;

export default function Experience() {
  const fillRef = useRef<HTMLDivElement>(null);

  const listRef = useScrollProgress<HTMLDivElement>(
    (raw, el) => {
      const p = prefersReducedMotion() ? 1 : raw;
      const fill = fillRef.current;
      if (!fill) return;
      fill.style.transform = `scaleY(${p})`;
      const reach = p * el.offsetHeight;
      el.querySelectorAll<HTMLElement>(".tl-stop").forEach((stop) => {
        stop.classList.toggle("is-lit", stop.offsetTop + 10 <= reach + 1);
      });
    },
    { start: 0.62, end: 0.62 },
  );

  return (
    <section id="experience" className="section" aria-labelledby="exp-title">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="wrap">
        <SectionHead
          id="exp-title"
          index={5}
          label="Experience"
          lines={["Education & experience,", "one"]}
          accent="path."
        />
        <div ref={listRef} className="tl">
          <div className="tl-spine" aria-hidden="true" />
          <div ref={fillRef} className="tl-fill" aria-hidden="true" />
          <ol className="tl-list">
            {TIMELINE.map((s) => (
              <li key={s.year + s.title} className="tl-stop">
                <p className="tl-year">{s.year}</p>
                <span className="tl-dot" aria-hidden="true" />
                <div className="tl-body">
                  <p className="tl-kind">{s.kind === "work" ? "Experience" : "Education"}</p>
                  <h3 className="tl-title">{s.title}</h3>
                  <p className="tl-place">{s.place}</p>
                  <p className="tl-detail">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="tl-next rv">
          <div>
            <p>Next —</p>
            <h3>
              Your <span className="accent">team?</span>
            </h3>
          </div>
          <a
            href="#contact"
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("contact");
            }}
          >
            Let&apos;s talk <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
