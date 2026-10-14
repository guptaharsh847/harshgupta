"use client";

import { useEffect, useRef, useState } from "react";
import { EDUCATION, EXPERIENCE, PROFILE, PROJECTS } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

const css = `
@layer components {
.about-grid { display: grid; grid-template-columns: minmax(0,1fr) 320px minmax(0,1fr); gap: clamp(24px, 3vw, 48px);
  align-items: stretch; }
.about-col { display: flex; flex-direction: column; min-width: 0; }
.about-left { gap: 26px; padding-top: 8px; }
.about-left h2 { font-size: clamp(40px, 4.6vw, 72px); }
.about-lead { font-size: clamp(19px, 1.7vw, 24px); line-height: 1.38; letter-spacing: -0.02em; font-weight: 500; color: var(--ink); max-width: 30ch; }
.about-hl { list-style: none; margin: 0; padding: 0; display: grid; }
.about-hl li { display: grid; grid-template-columns: 22px minmax(0,1fr); gap: 4px 12px; padding: 14px 0; border-top: 1px solid var(--line); }
.about-hl li:last-child { border-bottom: 1px solid var(--line); }
.about-hl i { grid-row: span 2; font: 500 11px/1.6 var(--font-mono); color: var(--accent); font-style: normal; }
.about-hl b { font-size: 14px; font-weight: 600; letter-spacing: -0.01em; }
.about-hl span { font-size: 14px; line-height: 1.5; color: var(--ink-2); }
.about-now { font-size: 15px; color: var(--ink); font-weight: 500; display: flex; gap: 10px; align-items: center; }
.about-now::before { content: ""; width: 8px; height: 8px; border-radius: 99px; background: var(--accent); flex: none;
  animation: about-pulse 2.4s var(--ease) infinite; }
@keyframes about-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(138,28,43,.35); } 50% { box-shadow: 0 0 0 6px rgba(13,13,13,0); } }
.about-btns { display: flex; flex-wrap: wrap; gap: 10px; margin-top: auto; }

/* ------------------------------------------------------- lanyard */
.lanyard-col { position: relative; align-items: center; min-height: 580px; }
.lanyard { position: absolute; top: calc(-1 * var(--section-y)); left: 50%; width: 300px; margin-left: -150px;
  transform-origin: 50% 0; will-change: transform; display: flex; flex-direction: column; align-items: center; }
.strap { position: relative; width: 30px; height: calc(var(--section-y) + 56px); overflow: hidden; border-radius: 0 0 4px 4px;
  background: var(--ink); box-shadow: inset 0 0 0 1px rgba(255,255,255,.06), inset 6px 0 8px -6px rgba(255,255,255,.25); }
.strap-track { position: absolute; left: 0; right: 0; top: 0; display: flex; flex-direction: column; align-items: center;
  gap: 18px; animation: strap-run 16s linear infinite; }
.strap-track span { writing-mode: vertical-rl; transform: rotate(180deg); font: 600 10px/1 var(--font-mono);
  letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.72); white-space: nowrap; }
@keyframes strap-run { to { transform: translateY(-50%); } }
.clip { width: 34px; height: 30px; margin-top: -2px; position: relative; }
.clip::before { content: ""; position: absolute; left: 4px; right: 4px; top: 0; height: 14px; border-radius: 3px 3px 6px 6px;
  background: linear-gradient(180deg, #d9d9d9, #8c8c8c 60%, #bdbdbd); box-shadow: inset 0 1px 0 rgba(255,255,255,.7), 0 2px 3px rgba(0,0,0,.25); }
.clip::after { content: ""; position: absolute; left: 50%; top: 11px; width: 16px; height: 20px; margin-left: -8px;
  border: 3px solid #a3a3a3; border-top-color: #cfcfcf; border-radius: 9px; background: transparent; }

.idcard { position: relative; width: 300px; height: 416px; margin-top: -8px; perspective: 1400px; cursor: pointer;
  border-radius: 22px; -webkit-tap-highlight-color: transparent; }
.idcard:focus-visible { outline-offset: 6px; border-radius: 22px; }
.idcard-inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d;
  transition: transform 1s var(--ease); }
.idcard.is-flipped .idcard-inner { transform: rotateY(180deg); }
@media (hover: hover) { .idcard:hover .idcard-inner { transform: rotateY(180deg); } }
.idface { position: absolute; inset: 0; border-radius: 22px; overflow: hidden; background: var(--card);
  -webkit-backface-visibility: hidden; backface-visibility: hidden; box-shadow: var(--hair), var(--lift);
  display: flex; flex-direction: column; }
.idface.back { transform: rotateY(180deg); }
.id-band { height: 50px; flex: none; background: var(--ink); color: #fff; display: flex; align-items: flex-end; justify-content: space-between;
  padding: 0 18px 12px; font: 600 11px/1 var(--font-mono); letter-spacing: .2em; position: relative; }
.id-band::before { content: ""; position: absolute; top: 10px; left: 50%; width: 46px; height: 9px; margin-left: -23px; border-radius: 99px;
  background: var(--paper); box-shadow: inset 0 1px 2px rgba(0,0,0,.35); }
.id-band em { font-style: normal; color: rgba(255,255,255,.55); letter-spacing: .08em; }
.id-body { padding: 14px 18px 14px; display: flex; flex-direction: column; align-items: center; flex: 1; min-height: 0; }
.id-photo { position: relative; isolation: isolate; width: 128px; height: 156px; padding: 3px; border-radius: 18px;
  background: linear-gradient(150deg, #0d0d0d, #b8b5ae 45%, #e9e6e0 60%, #3a3a3a); }
.id-photo::before { content: ""; position: absolute; inset: -22px; z-index: -1;
  background: radial-gradient(closest-side, rgba(13,13,13,.13), rgba(13,13,13,0)); }
.id-photo-in { width: 100%; height: 100%; border-radius: 15px; overflow: hidden; background: var(--soft); }
.id-photo img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.04);
  transition: transform .9s var(--ease), filter .9s var(--ease); }
.idcard:hover .id-photo img, .idcard:focus-visible .id-photo img { transform: scale(1.08); filter: grayscale(.15); }
.id-name { margin-top: 10px; font-weight: 700; font-size: 20px; letter-spacing: -0.03em; }
.id-role { font-size: 12.5px; color: var(--mute); margin-top: 2px; }
.id-rows { width: 100%; margin-top: 8px; display: grid; gap: 0; font-size: 11.5px; }
.id-rows div { display: flex; justify-content: space-between; align-items: baseline; padding: 4px 0; border-top: 1px dashed var(--line); }
.id-rows dt { font-family: var(--font-mono); color: var(--mute); text-transform: uppercase; letter-spacing: .06em; font-size: 10px; }
.id-rows dd { font-weight: 600; }
.id-foot { margin-top: auto; width: 100%; display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; padding-top: 8px; }
.barcode { height: 26px; flex: 1; }
.holo { width: 34px; height: 34px; border-radius: 99px; flex: none; position: relative; overflow: hidden;
  background: conic-gradient(from 0deg, #d4d4d4, #fafafa, #9a9a9a, #ececec, #bdbdbd, #f5f5f5, #d4d4d4);
  box-shadow: inset 0 0 0 1px rgba(13,13,13,.12); animation: holo-spin 9s linear infinite; }
.holo::after { content: "HG"; position: absolute; inset: 0; display: grid; place-items: center; font: 700 10px/1 var(--font-sans);
  color: rgba(13,13,13,.45); animation: holo-spin 9s linear infinite reverse; }
@keyframes holo-spin { to { transform: rotate(360deg); } }

.back .id-body { align-items: stretch; padding: 22px 22px 18px; }
.back h3 { font: 600 11px/1 var(--font-mono); letter-spacing: .14em; text-transform: uppercase; color: var(--mute); }
.back ul { list-style: none; margin: 14px 0 0; padding: 0; display: grid; gap: 9px; }
.back li { font-size: 13px; line-height: 1.4; padding-left: 16px; position: relative; color: var(--ink-2); }
.back li::before { content: ""; position: absolute; left: 0; top: .55em; width: 7px; height: 1.5px; background: var(--ink); }
.back li b { color: var(--ink); font-weight: 600; }
.sig { margin-top: auto; padding-top: 12px; }
.sig-name { font-family: var(--font-serif); font-style: italic; font-size: 30px; line-height: 1; letter-spacing: -0.01em;
  transform: rotate(-4deg); transform-origin: 0 100%; display: inline-block; }
.sig-line { height: 1px; background: var(--ink); margin-top: 4px; opacity: .6; }
.sig small { display: block; margin-top: 8px; font-size: 11px; color: var(--mute); overflow-wrap: anywhere; }
.flip-hint { margin-top: 18px; font: 500 11px/1 var(--font-mono); letter-spacing: .06em; color: var(--mute); text-transform: uppercase;
  position: absolute; bottom: 0; }

/* ------------------------------------------------------- facts */
.about-right { gap: 28px; padding-top: 8px; }
.facts-title { font: 500 12px/1 var(--font-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--mute); }
.facts { display: grid; margin: 0; }
.facts div { display: grid; grid-template-columns: 112px minmax(0,1fr); gap: 16px; padding: 16px 0; border-top: 1px solid var(--line); }
.facts div:last-child { border-bottom: 1px solid var(--line); }
.facts dt { font: 500 11px/1.6 var(--font-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--mute); }
.facts dd { font-size: 15px; font-weight: 500; line-height: 1.45; overflow-wrap: anywhere; }
.facts a { text-decoration: underline; text-decoration-color: var(--accent); text-underline-offset: 4px; transition: text-decoration-color .3s; }
.facts a:hover { text-decoration-color: var(--ink); }
.quote { margin: auto 0 0; padding: 26px 26px 22px; border-radius: 24px; background: var(--card); box-shadow: var(--hair); position: relative; }
.quote p { font-family: var(--font-serif); font-style: italic; font-size: clamp(22px, 2vw, 28px); line-height: 1.15; letter-spacing: -0.01em; }
.quote::before { content: "\\201C"; position: absolute; top: -18px; left: 20px; font: italic 400 64px/1 var(--font-serif); color: var(--accent); }
.quote figcaption { margin-top: 12px; font: 500 11px/1.4 var(--font-mono); letter-spacing: .04em; color: var(--mute); text-transform: uppercase; }

@media (max-width: 1099px) {
  .about-grid { grid-template-columns: minmax(0,1fr) 320px; }
  .about-right { grid-column: 1 / -1; display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 32px; }
  .about-right .facts-title { grid-column: 1 / -1; }
}
@media (max-width: 759px) {
  .about-grid { grid-template-columns: minmax(0,1fr); }
  .lanyard-col { min-height: 560px; order: 0; }
  .lanyard { top: -24px; }
  .strap { height: 96px; }
  .about-right { display: flex; }
}
}
`;

/** deterministic barcode from the name, drawn as one hard-stop gradient */
function barcode(seed: string) {
  const stops: string[] = [];
  let x = 0;
  for (let i = 0; i < 46; i++) {
    const w = ((seed.charCodeAt(i % seed.length) * (i + 7)) % 3) + 1;
    stops.push(`#0d0d0d ${x}px ${x + w}px, transparent ${x + w}px ${x + w + 1.5}px`);
    x += w + 1.5;
  }
  return `linear-gradient(90deg, ${stops.join(", ")}, transparent ${x}px)`;
}

export default function About() {
  const colRef = useRef<HTMLDivElement>(null);
  const swingRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  // damped pendulum: pointer velocity → angular impulse, spring back, idle sway
  useEffect(() => {
    const section = document.getElementById("about");
    const swing = swingRef.current;
    if (!section || !swing || prefersReducedMotion()) return;

    let theta = 0; // deg
    let omega = 0; // deg/s
    let last = performance.now();
    let lastPointer = { x: 0, t: 0 };
    let lastInput = 0;
    let raf = 0;
    let running = false;

    const step = (now: number) => {
      const dt = Math.min(1 / 30, (now - last) / 1000);
      last = now;
      const idle = now - lastInput > 1800;
      const target = idle ? 1.6 * Math.sin(now / 1000 * 1.15) : 0;
      const k = 38;
      const c = idle ? 4.2 : 2.6;
      const alpha = -k * (theta - target) - c * omega;
      omega += alpha * dt;
      theta += omega * dt;
      theta = Math.max(-10, Math.min(10, theta));
      swing.style.transform = `rotate(${theta.toFixed(3)}deg)`;
      if (running) raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (lastPointer.t) {
        const dt = Math.max(8, now - lastPointer.t);
        const vx = (e.clientX - lastPointer.x) / dt; // px per ms
        omega += Math.max(-60, Math.min(60, vx * 9));
      }
      lastPointer = { x: e.clientX, t: now };
      lastInput = now;
    };
    const onLeave = () => (lastPointer = { x: 0, t: 0 });

    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (running) {
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    });
    io.observe(section);
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const onCardClick = () => {
    // fine pointers flip on hover; taps (no hover) and keyboard toggle state
    if (window.matchMedia("(hover: none)").matches) setFlipped((f) => !f);
  };
  const onCardKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFlipped((f) => !f);
    }
  };

  const [mba, btech] = EDUCATION;
  const current = EXPERIENCE[0];
  const strapText = `${PROFILE.name} · ${PROFILE.role}`;
  const builtNames = PROJECTS.slice(1, 5).map((p) => p.title);

  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="wrap about-grid">
        {/* left */}
        <div className="about-col about-left">
          <p className="tag rv">
            <span>01 — About</span>
          </p>
          <h2 id="about-title" className="h-section">
            <span className="rv-mask">
              <span>
                Hi, I&apos;m <span className="accent">{PROFILE.firstName}.</span>
              </span>
            </span>
          </h2>
          <p className="about-lead rv" style={{ "--i": 1 } as React.CSSProperties}>
            {PROFILE.summaryLead}
          </p>
          <ul className="about-hl rv" style={{ "--i": 2 } as React.CSSProperties}>
            {PROFILE.summaryHighlights.map((h, i) => (
              <li key={h.label}>
                <i aria-hidden="true">{String(i + 1).padStart(2, "0")}</i>
                <b>{h.label}</b>
                <span>{h.text}</span>
              </li>
            ))}
          </ul>
          <p className="about-now rv" style={{ "--i": 2 } as React.CSSProperties}>
            Currently {current.role} at {current.company}, {current.place}.
          </p>
          <div className="about-btns rv" style={{ "--i": 3 } as React.CSSProperties}>
            <a href={PROFILE.resume} className="btn btn-primary" download>
              Résumé <span aria-hidden="true">↓</span>
            </a>
            {PROFILE.github && (
              <a href={PROFILE.github} className="btn btn-ghost" target="_blank" rel="noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
            )}
            <a href={PROFILE.linkedin} className="btn btn-ghost" target="_blank" rel="noreferrer">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        {/* centre: lanyard */}
        <div ref={colRef} className="about-col lanyard-col">
          <div ref={swingRef} className="lanyard">
            <div className="strap" aria-hidden="true">
              <div className="strap-track">
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i}>{strapText}</span>
                ))}
              </div>
            </div>
            <div className="clip" aria-hidden="true" />
            <div
              className={`idcard${flipped ? " is-flipped" : ""}`}
              role="button"
              tabIndex={0}
              aria-pressed={flipped}
              aria-label={`Developer ID card for ${PROFILE.name}. Press Enter to flip.`}
              onClick={onCardClick}
              onKeyDown={onCardKey}
            >
              <div className="idcard-inner">
                {/* front */}
                <div className="idface front" aria-hidden={flipped}>
                  <div className="id-band">
                    <span>DEVELOPER ID</span>
                    <em>{PROFILE.initials}</em>
                  </div>
                  <div className="id-body">
                    <div className="id-photo">
                      <div className="id-photo-in">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/portrait-bust.webp"
                          alt={`Portrait of ${PROFILE.name}`}
                          width={128}
                          height={156}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                    <p className="id-name">{PROFILE.name}</p>
                    <p className="id-role">{PROFILE.role}</p>
                    <dl className="id-rows">
                      <div>
                        <dt>Since</dt>
                        <dd className="mono">{PROFILE.careerStart}</dd>
                      </div>
                      <div>
                        <dt>Dept.</dt>
                        <dd>Full Stack (MERN)</dd>
                      </div>
                      <div>
                        <dt>Valid till</dt>
                        <dd className="mono">{PROFILE.idValidTill}</dd>
                      </div>
                    </dl>
                    <div className="id-foot" aria-hidden="true">
                      <div className="barcode" style={{ backgroundImage: barcode(PROFILE.name + PROFILE.email) }} />
                      <span className="holo" />
                    </div>
                  </div>
                </div>

                {/* back */}
                <div className="idface back" aria-hidden={!flipped}>
                  <div className="id-band">
                    <span>WHAT I AM</span>
                    <em>{PROFILE.initials}</em>
                  </div>
                  <div className="id-body">
                    <h3>What I am</h3>
                    <ul>
                      <li>
                        <b>{PROFILE.role}</b>, {PROFILE.experienceYears} years
                      </li>
                      <li>
                        {btech.short}, {btech.score} · {mba.short}, {mba.score}
                      </li>
                      <li>MongoDB Certified Associate Developer</li>
                      <li>Built: {builtNames.join(", ")}</li>
                      <li>2 research publications (IRJMETS, IRJMS)</li>
                    </ul>
                    <div className="sig">
                      <span className="sig-name">{PROFILE.name}</span>
                      <div className="sig-line" />
                      <small>If found, say hello · {PROFILE.email}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="flip-hint" aria-hidden="true">
            Hover · tap · Enter to flip
          </p>
        </div>

        {/* right */}
        <div className="about-col about-right">
          <p className="facts-title rv">Quick facts</p>
          <dl className="facts rv" style={{ "--i": 1 } as React.CSSProperties}>
            <div>
              <dt>Based in</dt>
              <dd>{PROFILE.location}</dd>
            </div>
            <div>
              <dt>Education</dt>
              <dd>
                {mba.short}, {mba.school}
                <br />
                {btech.short}, {btech.school}
              </dd>
            </div>
            <div>
              <dt>Domains</dt>
              <dd>{PROFILE.domains.join(" · ")}</dd>
            </div>
            <div>
              <dt>Languages</dt>
              <dd>{PROFILE.languages.join(" · ")}</dd>
            </div>
            <div>
              <dt>Current role</dt>
              <dd>
                {current.role}, {current.company}
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
              </dd>
            </div>
          </dl>
          <figure className="quote rv" style={{ "--i": 2 } as React.CSSProperties}>
            <blockquote>
              <p>Clean, maintainable code that ships as reliable, production-ready work.</p>
            </blockquote>
            <figcaption>Paraphrased from my résumé</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
