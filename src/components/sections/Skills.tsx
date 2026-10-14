"use client";

import { useMemo, useState } from "react";
import { EXPERIENCE, PROJECTS, SKILL_GROUPS, type Family, type Skill } from "@/lib/data";
import { useInView, useMediaQuery } from "@/lib/hooks";
import SectionHead from "@/components/ui/SectionHead";
import TechLogo, { brandTint, isBrand } from "@/components/ui/TechLogo";

const css = `
@layer components {
.pt-layout { display: grid; grid-template-columns: minmax(0,1fr) 320px; gap: 28px; margin-top: 56px; align-items: start; }
.pt-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
.pt-chip { height: 36px; padding-inline: 14px; border-radius: 999px; font-size: 13.5px; font-weight: 500; color: var(--ink-2);
  box-shadow: inset 0 0 0 1px rgba(13,13,13,.16); display: inline-flex; align-items: center; gap: 8px;
  transition: background-color .4s var(--ease), color .4s var(--ease), box-shadow .4s var(--ease); }
.pt-chip:hover { box-shadow: inset 0 0 0 1px var(--ink); color: var(--ink); }
.pt-chip[aria-pressed="true"] { background: var(--ink); color: #fff; box-shadow: inset 0 0 0 1px var(--ink); }
.pt-chip small { font: 500 11px/1 var(--font-mono); opacity: .6; }

.pt-grid { display: grid; grid-template-columns: repeat(8, minmax(0,1fr)); gap: 8px; list-style: none; margin: 0; padding: 0; }
.pt-tile { position: relative; width: 100%; aspect-ratio: 1 / 1.08; border-radius: 16px; background: var(--card); box-shadow: var(--hair);
  padding: 10px 10px 9px; display: flex; flex-direction: column; text-align: left; min-width: 0;
  opacity: 0; transform: translateY(14px) scale(.96);
  transition: opacity .7s var(--ease), transform .8s var(--ease), box-shadow .5s var(--ease), background-color .4s, color .4s; }
.pt-grid.is-in .pt-tile { opacity: 1; transform: none; transition-delay: var(--d), var(--d), 0s, 0s, 0s; }
.pt-tile:hover, .pt-tile:focus-visible, .pt-tile.is-current { box-shadow: var(--hair), 0 18px 34px -20px rgba(13,13,13,.45); }
.pt-tile.is-current { background: var(--ink); color: #fff; }
.pt-tile.is-current .pt-num, .pt-tile.is-current .pt-fam { color: rgba(255,255,255,.6); }
.pt-grid.is-in .pt-tile.is-dim { opacity: .22; transform: scale(.97); }
.pt-num { font: 500 10px/1 var(--font-mono); color: var(--mute); }
.pt-sym { margin-top: auto; font-weight: 700; font-size: clamp(22px, 2.3vw, 32px); letter-spacing: -0.04em; line-height: 1; }
.pt-name { margin-top: 6px; font-size: 11.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pt-fam { font: 500 9.5px/1.2 var(--font-mono); color: var(--faint); text-transform: uppercase; letter-spacing: .04em; margin-top: 3px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pt-dot { position: absolute; top: 10px; right: 10px; width: 6px; height: 6px; border-radius: 99px; }
.pt-dot[data-f="Frontend"] { background: currentColor; }
.pt-dot[data-f="Backend"] { box-shadow: inset 0 0 0 1.5px currentColor; }
.pt-dot[data-f="Database"] { background: currentColor; border-radius: 1px; }
.pt-dot[data-f="Tools"] { box-shadow: inset 0 0 0 1.5px currentColor; border-radius: 1px; }
.pt-legend { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 16px; font: 500 11px/1 var(--font-mono); color: var(--mute);
  text-transform: uppercase; letter-spacing: .04em; }
.pt-legend span { display: inline-flex; align-items: center; gap: 8px; }
.pt-legend .pt-dot { position: static; color: var(--ink); }

.pt-inspector { position: sticky; top: 96px; border-radius: 26px; background: var(--card); box-shadow: var(--hair), var(--lift);
  padding: 22px; min-height: 420px; display: flex; flex-direction: column; }
.pt-insp-top { display: flex; justify-content: space-between; font: 500 11px/1 var(--font-mono); color: var(--mute);
  text-transform: uppercase; letter-spacing: .06em; }
.pt-logo { position: relative; height: 190px; display: grid; place-items: center; margin: 8px 0 4px; }
.pt-logo::before { content: ""; position: absolute; width: 170px; height: 170px; border-radius: 99px; background: var(--tint, #999);
  opacity: .16; filter: blur(34px); }
.pt-logo > * { position: relative; animation: pt-pop .7s var(--ease) both; }
.pt-logo svg { color: var(--ink); }
@keyframes pt-pop { 0% { opacity: 0; transform: scale(.6) rotate(-8deg); } 60% { opacity: 1; transform: scale(1.06) rotate(1deg); } 100% { transform: none; } }
.pt-insp-name { font-weight: 700; font-size: 28px; letter-spacing: -0.035em; line-height: 1.05; }
.pt-insp-fam { margin-top: 6px; font-size: 14px; color: var(--mute); }
.pt-insp-used { margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--line); }
.pt-insp-used h3 { font: 500 11px/1 var(--font-mono); color: var(--mute); text-transform: uppercase; letter-spacing: .06em; }
.pt-insp-used ul { list-style: none; padding: 0; margin: 10px 0 0; display: flex; flex-wrap: wrap; gap: 6px; }
.pt-insp-used p { margin-top: 10px; font-size: 13.5px; color: var(--ink-2); line-height: 1.5; }

@media (max-width: 1179px) {
  .pt-layout { grid-template-columns: minmax(0,1fr); }
  .pt-inspector { position: relative; top: 0; min-height: 0; display: grid; grid-template-columns: 170px minmax(0,1fr); gap: 0 22px; }
  .pt-insp-top { grid-column: 1 / -1; }
  .pt-logo { height: 170px; grid-row: span 3; }
}
@media (max-width: 699px) {
  .pt-grid { grid-template-columns: repeat(4, minmax(0,1fr)); }
  .pt-inspector { grid-template-columns: minmax(0,1fr); }
  .pt-logo { height: 170px; grid-row: auto; }
}
}
`;

type Tile = Skill & { n: number };
const FAMILIES: Family[] = SKILL_GROUPS.map((g) => g.family);

export default function Skills() {
  const tiles: Tile[] = useMemo(() => {
    let n = 0;
    return SKILL_GROUPS.flatMap((g) => g.skills.map((s) => ({ ...s, n: ++n })));
  }, []);
  const [filter, setFilter] = useState<Family | "All">("All");
  const [current, setCurrent] = useState<Tile>(tiles[0]);
  const [gridRef, inView] = useInView<HTMLUListElement>({ threshold: 0.2 });
  const narrow = useMediaQuery("(max-width: 699px)");
  const cols = narrow ? 4 : 8;

  const usedProjects = PROJECTS.filter((p) => current.usedIn.includes(p.id));
  const usedCompanies = (current.at ?? [])
    .map((id) => EXPERIENCE.find((e) => e.id === id))
    .filter((e): e is (typeof EXPERIENCE)[number] => !!e)
    .filter((e) => !usedProjects.some((p) => p.kicker.startsWith(e.company)));

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="wrap">
        <SectionHead
          id="skills-title"
          index={2}
          label="Skills"
          lines={["The periodic table"]}
          accent="of my stack."
        >
          <p className="lede rv mt-6 max-w-[56ch]" style={{ "--i": 2 } as React.CSSProperties}>
            Every skill listed on my résumé, as an element. Hover or focus a tile to inspect it; filter by family.
          </p>
        </SectionHead>

        <div className="pt-layout">
          <div>
            <div className="pt-filters" role="group" aria-label="Filter skills by family">
              {(["All", ...FAMILIES] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  className="pt-chip"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                >
                  {f}
                  <small>
                    {f === "All" ? tiles.length : tiles.filter((t) => t.family === f).length}
                  </small>
                </button>
              ))}
            </div>

            <ul ref={gridRef} className={`pt-grid${inView ? " is-in" : ""}`} aria-label="Skills">
              {tiles.map((t, i) => {
                const row = Math.floor(i / cols);
                const col = i % cols;
                const dim = filter !== "All" && t.family !== filter;
                return (
                  <li key={t.name}>
                    <button
                      type="button"
                      className={`pt-tile${dim ? " is-dim" : ""}${current.name === t.name ? " is-current" : ""}`}
                      style={{ "--d": `${(row + col) * 40}ms` } as React.CSSProperties}
                      onMouseEnter={() => setCurrent(t)}
                      onFocus={() => setCurrent(t)}
                      onClick={() => setCurrent(t)}
                      aria-label={`${t.name}, ${t.family}, element ${t.n}`}
                      aria-pressed={current.name === t.name}
                    >
                      <span className="pt-num" aria-hidden="true">
                        {String(t.n).padStart(2, "0")}
                      </span>
                      <span className="pt-dot" data-f={t.family} aria-hidden="true" />
                      <span className="pt-sym" aria-hidden="true">
                        {t.symbol}
                      </span>
                      <span className="pt-name" aria-hidden="true">
                        {t.name}
                      </span>
                      <span className="pt-fam" aria-hidden="true">
                        {t.family}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="pt-legend" aria-hidden="true">
              {FAMILIES.map((f) => (
                <span key={f}>
                  <i className="pt-dot" data-f={f} />
                  {f}
                </span>
              ))}
            </div>
          </div>

          <aside className="pt-inspector" aria-label="Skill inspector">
            <div className="pt-insp-top">
              <span>No. {String(current.n).padStart(2, "0")}</span>
              <span>{current.symbol}</span>
            </div>
            <div
              className="pt-logo"
              style={{ "--tint": isBrand(current.logo) ? brandTint(current.logo) : "#777" } as React.CSSProperties}
            >
              <TechLogo key={current.name} name={current.logo} size={150} decorative={false} />
            </div>
            <div>
              <p className="pt-insp-name">{current.name}</p>
              <p className="pt-insp-fam">{current.family}</p>
            </div>
            <div className="pt-insp-used">
              <h3>Where it shows up</h3>
              {usedProjects.length + usedCompanies.length > 0 ? (
                <ul>
                  {usedProjects.map((p) => (
                    <li key={p.id} className="chip">
                      {p.title}
                    </li>
                  ))}
                  {usedCompanies.map((e) => (
                    <li key={e.id} className="chip">
                      {e.company}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Listed under {current.family} in my résumé skills.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
