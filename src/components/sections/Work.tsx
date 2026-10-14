"use client";

import { useEffect, useState } from "react";
import { PROJECTS, type Project } from "@/lib/data";
import SectionHead from "@/components/ui/SectionHead";
import TechLogo from "@/components/ui/TechLogo";
import MiniUI, { miniUiCss } from "@/components/ui/MiniUI";

const css = `
@layer components {
.wk { display: flex; gap: 10px; height: min(78svh, 600px); min-height: 520px; margin-top: 56px; }
.wk-panel { position: relative; flex: 1 1 0; min-width: 0; border-radius: 28px; background: var(--card); box-shadow: var(--hair);
  overflow: hidden; transition: flex-grow .9s var(--ease), box-shadow .6s var(--ease); }
.wk-panel.is-open { flex-grow: 8; box-shadow: var(--hair), var(--lift); }
.wk-panel:has(.wk-trigger:focus-visible) { outline: 2px solid var(--ink); outline-offset: 3px; }

.wk-trigger { position: absolute; inset: 0; z-index: 2; display: flex; flex-direction: column; align-items: center;
  justify-content: space-between; padding: 22px 0; text-align: center; transition: opacity .4s var(--ease); }
.wk-trigger:focus-visible { outline: none; }
.wk-panel.is-open .wk-trigger { opacity: 0; pointer-events: none; }
.wk-spine-num { font: 500 12px/1 var(--font-mono); color: var(--accent); }
.wk-spine-title { writing-mode: vertical-rl; transform: rotate(180deg); font-weight: 600; font-size: 17px; letter-spacing: -0.02em;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-height: 70%; }
.wk-plus { width: 38px; height: 38px; border-radius: 999px; box-shadow: inset 0 0 0 1px rgba(13,13,13,.2); display: grid; place-items: center;
  font-size: 20px; font-weight: 300; line-height: 1; transition: transform .6s var(--ease), background-color .4s, color .4s; }
.wk-trigger:hover .wk-plus { transform: rotate(90deg); background: var(--accent); color: #fff; box-shadow: none; }

.wk-body { position: absolute; inset: 0; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 28px;
  padding: clamp(24px, 2.6vw, 38px); opacity: 0; visibility: hidden; transition: opacity .35s var(--ease), visibility 0s .35s; }
.wk-panel.is-open .wk-body { opacity: 1; visibility: visible; transition: opacity .7s var(--ease) .28s, visibility 0s; }
.wk-info { display: flex; flex-direction: column; min-width: 0; }
.wk-kicker { display: flex; gap: 12px; align-items: baseline; font: 500 12px/1.3 var(--font-mono); color: var(--mute); }
.wk-kicker b { color: var(--accent); font-weight: 600; }
.wk-impact { margin-top: 14px; align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 99px;
  background: var(--accent-soft); color: var(--accent); font-weight: 600; font-size: 14px; letter-spacing: -0.01em; }
.wk-impact::before { content: ""; width: 6px; height: 6px; border-radius: 99px; background: currentColor; }
.wk-title { margin-top: 16px; font-weight: 700; font-size: clamp(28px, 2.9vw, 44px); letter-spacing: -0.045em; line-height: 1; }
.wk-desc { margin-top: 16px; color: var(--ink-2); font-size: 15px; line-height: 1.6; max-width: 48ch; }
.wk-feats { margin-top: 18px; padding: 0; list-style: none; display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 8px 18px; }
.wk-feats li { font-size: 13.5px; color: var(--ink-2); padding-left: 16px; position: relative; line-height: 1.4; }
.wk-feats li::before { content: ""; position: absolute; left: 0; top: .5em; width: 7px; height: 7px; border-radius: 2px;
  box-shadow: inset 0 0 0 1.5px var(--accent); }
.wk-tech { margin-top: auto; padding-top: 18px; display: flex; flex-wrap: wrap; gap: 6px; list-style: none; }
.wk-tech .chip img, .wk-tech .chip svg { width: 14px; height: 14px; }

.wk-visual { position: relative; min-width: 0; border-radius: 20px; background: var(--paper); box-shadow: var(--hair); overflow: hidden;
  clip-path: inset(0 0 0 100% round 20px); transition: clip-path .1s; }
.wk-panel.is-open .wk-visual { clip-path: inset(0 0 0 0 round 20px); transition: clip-path 1.1s var(--ease) .38s; }
.wk-visual-label { position: absolute; top: 12px; right: 12px; z-index: 2; font: 500 10px/1 var(--font-mono); letter-spacing: .08em;
  text-transform: uppercase; color: var(--mute); background: rgba(255,255,255,.8); padding: 6px 9px; border-radius: 99px; box-shadow: var(--hair); }

@media (max-width: 1099px) {
  .wk-body { grid-template-columns: minmax(0,1fr); }
  .wk-visual { display: none; }
}
@media (max-width: 899px) {
  .wk { flex-direction: column; height: auto; min-height: 0; }
  .wk-panel, .wk-panel.is-open { flex: none; }
  .wk-trigger { position: relative; inset: auto; flex-direction: row; justify-content: flex-start; gap: 16px; padding: 20px 20px;
    text-align: left; width: 100%; }
  .wk-panel.is-open .wk-trigger { opacity: 1; pointer-events: auto; }
  .wk-spine-title { writing-mode: horizontal-tb; transform: none; max-height: none; flex: 1; white-space: normal; font-size: 19px; }
  .wk-panel.is-open .wk-plus { transform: rotate(45deg); background: var(--accent); color: #fff; box-shadow: none; }
  .wk-body { position: relative; inset: auto; display: grid; grid-template-rows: 0fr; grid-template-columns: minmax(0,1fr);
    padding: 0 20px; opacity: 1; visibility: visible; transition: grid-template-rows .8s var(--ease), padding .8s var(--ease); }
  .wk-panel.is-open .wk-body { grid-template-rows: 1fr; padding-bottom: 22px; transition: grid-template-rows .8s var(--ease), padding .8s var(--ease); }
  .wk-body-in { min-height: 0; overflow: hidden; display: grid; gap: 18px; }
  .wk-title, .wk-kicker { display: none; }
  .wk-desc { margin-top: 0; }
  .wk-visual { display: block; height: 260px; }
  .wk-feats { grid-template-columns: minmax(0,1fr); }
}
@media (min-width: 900px) { .wk-body-in { display: contents; } }
}
`;

function Panel({ p, open, onOpen }: { p: Project; open: boolean; onOpen: () => void }) {
  const bodyId = `wk-body-${p.id}`;
  // mount the illustration the first time the panel opens (keeps the initial DOM small)
  const [seen, setSeen] = useState(open);
  useEffect(() => {
    if (open) setSeen(true);
  }, [open]);
  return (
    <article className={`wk-panel${open ? " is-open" : ""}`} onMouseEnter={onOpen} aria-labelledby={`wk-t-${p.id}`}>
      <h3 className="m-0">
        <button
          type="button"
          className="wk-trigger"
          aria-expanded={open}
          aria-controls={bodyId}
          onFocus={onOpen}
          onClick={onOpen}
          id={`wk-t-${p.id}`}
        >
          <span className="wk-spine-num">{p.index}</span>
          <span className="wk-spine-title">{p.title}</span>
          <span className="wk-plus" aria-hidden="true">
            +
          </span>
        </button>
      </h3>
      <div id={bodyId} className="wk-body" role="region" aria-labelledby={`wk-t-${p.id}`} inert={!open}>
        <div className="wk-body-in">
          <div className="wk-info">
            <p className="wk-kicker">
              <b>{p.index}</b>
              <span>{p.kicker}</span>
            </p>
            <p className="wk-title" aria-hidden="true">
              {p.title}
            </p>
            <p className="wk-impact">{p.impact}</p>
            <p className="wk-desc">{p.description}</p>
            <ul className="wk-feats">
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <ul className="wk-tech" aria-label="Tech used">
              {p.tech.map((t) => (
                <li key={t.name} className="chip">
                  {t.logo && <TechLogo name={t.logo} size={14} />}
                  {t.name}
                </li>
              ))}
            </ul>
            {p.github && (
              <a href={p.github} className="btn btn-primary btn-sm mt-4 self-start" target="_blank" rel="noreferrer">
                View on GitHub <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
          <div className="wk-visual">
            <span className="wk-visual-label">Illustrative UI</span>
            {seen && <MiniUI kind={p.ui} />}
            <span className="sr-only">Illustrative mock-up of the {p.title} interface; not a screenshot.</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Work() {
  // open on the strongest story first
  const [open, setOpen] = useState("gaming");
  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <style dangerouslySetInnerHTML={{ __html: css + miniUiCss }} />
      <div className="wrap">
        <SectionHead id="work-title" index={3} label="Selected work" lines={["Things I've"]} accent="built.">
          <p className="lede rv mt-6 max-w-[60ch]" style={{ "--i": 2 } as React.CSSProperties}>
            Products named in my experience, described in my résumé&apos;s own words. The mock-ups are illustrations, not
            screenshots.
          </p>
        </SectionHead>
        <div className="wk rv" style={{ "--i": 3 } as React.CSSProperties}>
          {PROJECTS.map((p) => (
            <Panel key={p.id} p={p} open={open === p.id} onOpen={() => setOpen(p.id)} />
          ))}
        </div>
      </div>
    </section>
  );
}
