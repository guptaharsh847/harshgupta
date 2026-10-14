"use client";

import { Fragment, useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

const css = `
@layer components {
.ct { padding-bottom: 40px; }
.ct-title { font-weight: 700; letter-spacing: -0.055em; line-height: .94; font-size: clamp(48px, 10vw, 168px); margin-top: 28px; }
.ct-line { display: block; white-space: nowrap; }
.ct-word { display: inline-block; white-space: nowrap; }
.ct-ch { display: inline-block; will-change: transform; }
.ct-ch.hop { animation: hop .7s var(--ease); }
@keyframes hop { 0% { transform: none; } 30% { transform: translateY(-0.16em); } 55% { transform: translateY(0.03em); } 75% { transform: translateY(-0.04em); } 100% { transform: none; } }

.ct-grid { margin-top: clamp(48px, 8vh, 88px); display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 40px; align-items: end; }
.ct-status { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 22px; font: 500 12px/1 var(--font-mono);
  letter-spacing: .04em; text-transform: uppercase; color: var(--ink-2); }
.ct-status span { width: 8px; height: 8px; border-radius: 99px; background: var(--accent); box-shadow: 0 0 0 4px var(--accent-soft); }
.ct-email-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.ct-email { font-weight: 600; font-size: clamp(22px, 3.6vw, 52px); letter-spacing: -0.035em; line-height: 1.1; overflow-wrap: anywhere;
  background: linear-gradient(var(--accent), var(--accent)) 0 100% / 100% 2px no-repeat; padding-bottom: 6px;
  transition: background-size .7s var(--ease); }
.ct-email:hover { background-size: 0% 2px; background-position: 100% 100%; }
.ct-copy { height: 36px; padding-inline: 14px; border-radius: 999px; box-shadow: inset 0 0 0 1px rgba(13,13,13,.2); font: 500 12px/1 var(--font-mono);
  letter-spacing: .04em; text-transform: uppercase; transition: background-color .4s var(--ease), color .4s var(--ease); }
.ct-copy:hover, .ct-copy.is-done { background: var(--accent); color: #fff; box-shadow: none; }
.ct-links { margin-top: 28px; display: flex; flex-wrap: wrap; gap: 10px; }

.ct-badge { position: relative; width: 168px; height: 168px; border-radius: 999px; display: grid; place-items: center; flex: none; }
.ct-badge svg.ct-ring { position: absolute; inset: 0; width: 100%; height: 100%; animation: badge-spin 18s linear infinite; }
.ct-badge text { font: 500 13px var(--font-mono); letter-spacing: 3.2px; text-transform: uppercase; fill: var(--ink); }
.ct-badge-core { width: 76px; height: 76px; border-radius: 999px; background: var(--accent); color: #fff; display: grid; place-items: center;
  font-size: 26px; transition: transform .6s var(--ease); }
.ct-badge:hover .ct-badge-core { transform: rotate(-45deg) scale(1.06); }
@keyframes badge-spin { to { transform: rotate(360deg); } }

.ft { margin-top: clamp(72px, 12vh, 120px); padding-top: 22px; border-top: 1px solid var(--line); display: flex; justify-content: space-between;
  align-items: center; gap: 16px; flex-wrap: wrap; font-size: 13.5px; color: var(--mute); }
.ft a { color: var(--ink); font-weight: 500; display: inline-flex; gap: 6px; align-items: center; }
.ft a:hover { color: var(--accent); text-decoration: underline; text-underline-offset: 4px; }
@media (max-width: 699px) {
  .ct-grid { grid-template-columns: minmax(0,1fr); }
  .ct-badge { width: 136px; height: 136px; justify-self: end; }
  .ct-badge text { font-size: 11px; letter-spacing: 2.4px; }
  .ct-title { font-size: clamp(40px, 11.6vw, 72px); }
}
}
`;

function HopText({ text }: { text: string }) {
  const hop = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    if (el.classList.contains("hop")) return;
    el.classList.add("hop");
    el.addEventListener("animationend", () => el.classList.remove("hop"), { once: true });
  };
  return (
    <>
      {text.split(" ").map((word, wi) => (
        <Fragment key={wi}>
        {wi > 0 && " "}
        <span className="ct-word">
          {word.split("").map((ch, i) => (
            <span key={i} className="ct-ch" onPointerEnter={hop}>
              {ch}
            </span>
          ))}
        </span>
        </Fragment>
      ))}
    </>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      const t = document.createElement("textarea");
      t.value = PROFILE.email;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="contact" className="section ct" aria-labelledby="ct-title">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="wrap">
        <p className="tag rv">
          <span>07 — Contact</span>
        </p>
        <h2 id="ct-title" className="ct-title" aria-label="Let's build something together.">
          <span className="rv-mask ct-line" aria-hidden="true">
            <span>
              <HopText text="Let's build" />
            </span>
          </span>
          <span className="rv-mask ct-line" style={{ "--i": 1 } as React.CSSProperties} aria-hidden="true">
            <span>
              <HopText text="something" /> <span className="accent">together.</span>
            </span>
          </span>
        </h2>

        <div className="ct-grid">
          <div>
            <p className="ct-status rv">
              <span aria-hidden="true" />
              Based in {PROFILE.location} · open to conversations
            </p>
            <div className="ct-email-row rv">
              <a className="ct-email" href={`mailto:${PROFILE.email}`}>
                {PROFILE.email}
              </a>
              <button type="button" className={`ct-copy${copied ? " is-done" : ""}`} onClick={copy}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </div>
            <div className="ct-links rv" style={{ "--i": 1 } as React.CSSProperties}>
              <a className="btn btn-ghost" href={PROFILE.phoneHref}>
                <span aria-hidden="true">☏</span> {PROFILE.phone}
              </a>
              {PROFILE.github && (
                <a className="btn btn-ghost" href={PROFILE.github} target="_blank" rel="noreferrer">
                  GitHub <span aria-hidden="true">↗</span>
                </a>
              )}
              <a className="btn btn-ghost" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a className="btn btn-primary" href={PROFILE.resume} download>
                Résumé <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <a className="ct-badge rv" href={`mailto:${PROFILE.email}`} aria-label={`Say hello: email ${PROFILE.name}`}>
            <svg className="ct-ring" viewBox="0 0 168 168" aria-hidden="true">
              <defs>
                <path id="ct-circle" d="M84,84 m-64,0 a64,64 0 1,1 128,0 a64,64 0 1,1 -128,0" />
              </defs>
              <text>
                <textPath href="#ct-circle">say hello · say hello · say hello · </textPath>
              </text>
            </svg>
            <span className="ct-badge-core" aria-hidden="true">
              →
            </span>
          </a>
        </div>

        <footer className="ft">
          <p>
            © {new Date().getFullYear()} {PROFILE.name}
          </p>
          <p>Built with Next.js</p>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("top");
            }}
          >
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </footer>
      </div>
    </section>
  );
}
