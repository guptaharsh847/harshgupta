"use client";

import { useRef, useState } from "react";
import { TIMELINE } from "@/lib/data";
import { prefersReducedMotion, useScrollProgress } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";
import SectionHead from "@/components/ui/SectionHead";
import TechLogo from "@/components/ui/TechLogo";

const css = `
@layer components {
.tl { position: relative; margin-top: 72px; --year-w: 200px; --spine-x: calc(var(--year-w) + 28px); }
.tl-spine, .tl-fill { position: absolute; top: 6px; bottom: 0; left: var(--spine-x); width: 2px; margin-left: -1px; border-radius: 2px; }
.tl-spine { background: var(--line); }
.tl-fill { background: var(--accent); transform-origin: 50% 0; transform: scaleY(0); will-change: transform; }
.tl-list { list-style: none; margin: 0; padding: 0; display: grid; gap: clamp(40px, 6vh, 64px); }
.tl-stop { display: grid; grid-template-columns: var(--year-w) 56px minmax(0, 1fr); align-items: start; }
.tl-year { text-align: right; font: 500 13px/1.6 var(--font-mono); color: var(--mute); transition: color .6s var(--ease); padding-top: 2px; }
.tl-dot { justify-self: center; position: relative; width: 14px; height: 14px; margin-top: 5px; border-radius: 99px; background: var(--paper);
  box-shadow: inset 0 0 0 2px var(--faint); transition: box-shadow .6s var(--ease), transform .6s var(--ease); z-index: 1; }
.tl-dot::after { content: ""; position: absolute; inset: -7px; border-radius: 99px; box-shadow: 0 0 0 1px var(--ink); opacity: 0; transform: scale(.6);
  transition: opacity .6s var(--ease), transform .8s var(--ease); }
.tl-body { transform: translateX(-8px); transition: transform .9s var(--ease); max-width: 62ch; }
.tl-body > * { transition: color .8s var(--ease); }
.tl-stop:not(.is-lit) .tl-title, .tl-stop:not(.is-lit) .tl-place, .tl-stop:not(.is-lit) .tl-detail { color: var(--mute); }
.tl-kind { font: 500 10.5px/1 var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--mute); display: inline-flex; gap: 8px; align-items: center; }
.tl-kind::before { content: ""; width: 14px; height: 1px; background: currentColor; }
.tl-title { margin-top: 10px; font-weight: 700; font-size: clamp(20px, 2vw, 28px); letter-spacing: -0.03em; line-height: 1.12; }
.tl-logo { width: 22px; height: 22px; object-fit: contain; border-radius: 6px; }
.tl-place { display: flex; align-items: center; gap: 10px; margin-top: 6px; font-size: 15px; font-weight: 500; color: var(--ink-2); }
.tl-detail { margin-top: 10px; font-size: 14.5px; line-height: 1.6; color: var(--mute); }
.tl-stop.is-lit .tl-year { color: var(--accent); }
.tl-stop.is-lit .tl-dot { box-shadow: inset 0 0 0 7px var(--accent); transform: scale(1.05); }
.tl-stop.is-lit .tl-dot::after { box-shadow: 0 0 0 1px var(--accent); opacity: .35; transform: none; }
.tl-tech { list-style: none; margin: 14px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
.tl-tech .chip { height: 28px; font-size: 12.5px; }
.tl-more { margin-top: 14px; display: inline-flex; align-items: center; gap: 8px; font: 500 12px/1 var(--font-mono); letter-spacing: .04em;
  text-transform: uppercase; color: var(--accent); padding: 6px 0; }
.tl-more i { font-style: normal; display: inline-block; transition: transform .5s var(--ease); }
.tl-more[aria-expanded="true"] i { transform: rotate(45deg); }
.tl-points { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .7s var(--ease); }
.tl-points.is-open { grid-template-rows: 1fr; }
.tl-points > ul { min-height: 0; overflow: hidden; list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.tl-points li { position: relative; padding-left: 18px; font-size: 14.5px; line-height: 1.55; color: var(--ink-2); }
.tl-points li:first-child { margin-top: 10px; }
.tl-points li::before { content: ""; position: absolute; left: 0; top: .65em; width: 8px; height: 1.5px; background: var(--accent); }
.tl-stop.is-lit .tl-body { transform: none; }

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
  .tl-body { transform: none; }
}
}
`;

export default function Experience() {
  const fillRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

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
          index={4}
          label="Experience"
          lines={["Education & experience,", "one"]}
          accent="path."
        />
        <div ref={listRef} className="tl">
          <div className="tl-spine" aria-hidden="true" />
          <div ref={fillRef} className="tl-fill" aria-hidden="true" />
          <ol className="tl-list">
            {TIMELINE.map((s, i) => (
              <li key={s.year + s.title} className="tl-stop">
                <p className="tl-year">{s.year}</p>
                <span className="tl-dot" aria-hidden="true" />
                <div className="tl-body">
                  <p className="tl-kind">{s.kind === "work" ? "Experience" : "Education"}</p>
                  <h3 className="tl-title">{s.title}</h3>
                  <p className="tl-place">
                    {s.logo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.logo} alt="" width={22} height={22} className="tl-logo" loading="lazy" />
                    )}
                    {s.place}
                  </p>
                  <p className="tl-detail">{s.detail}</p>
                  {s.tech && (
                    <ul className="tl-tech" aria-label="Tools used">
                      {s.tech.map((t) => (
                        <li key={t.name} className="chip">
                          {t.logo && <TechLogo name={t.logo} size={14} />}
                          {t.name}
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.points && s.points.length > 0 && (
                    <>
                      <button
                        type="button"
                        className="tl-more"
                        aria-expanded={open === i}
                        aria-controls={`tl-points-${i}`}
                        onClick={() => setOpen(open === i ? null : i)}
                      >
                        <i aria-hidden="true">+</i>
                        {open === i ? "Show less" : `${s.points.length} more highlight${s.points.length > 1 ? "s" : ""}`}
                      </button>
                      <div id={`tl-points-${i}`} className={`tl-points${open === i ? " is-open" : ""}`} inert={open !== i}>
                        <ul>
                          {s.points.map((pt) => (
                            <li key={pt}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
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
