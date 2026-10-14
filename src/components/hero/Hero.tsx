"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { asset } from "@/lib/asset";
import { scrollToTarget } from "@/lib/scroll";

const css = `
@layer components {
.hero { position: relative; min-height: 100svh; overflow: clip; isolation: isolate; background: var(--paper); }
.hero-stage { position: relative; height: 100svh; min-height: 620px; max-height: 1120px; }

/* the ghost word is masked out of the central column so the person reads as standing in front of it */
.hero-ghost-mask { position: absolute; inset: 0; z-index: 0; pointer-events: none; --hole: calc(min(96svh, 1040px) * .15);
  -webkit-mask-image: linear-gradient(90deg, #000 calc(50% - var(--hole) - 40px), transparent calc(50% - var(--hole)), transparent calc(50% + var(--hole)), #000 calc(50% + var(--hole) + 40px));
  mask-image: linear-gradient(90deg, #000 calc(50% - var(--hole) - 40px), transparent calc(50% - var(--hole)), transparent calc(50% + var(--hole)), #000 calc(50% + var(--hole) + 40px)); }
.hero-ghost { position: absolute; left: 50%; top: 46%; transform: translate(-50%, -50%);
  display: flex; font-weight: 800; font-size: clamp(120px, 27vw, 460px); line-height: .8; letter-spacing: -0.06em;
  color: transparent; -webkit-text-stroke: 1.5px rgba(138,28,43,.2); white-space: nowrap; user-select: none; pointer-events: none; }
.hero-ghost span { display: inline-block; animation: ghost-in 1.6s var(--ease) both; animation-delay: calc(var(--i) * 70ms + 150ms); }
@keyframes ghost-in { from { opacity: 0; transform: translateY(18%); } to { opacity: 1; transform: none; } }

.hero-video-wrap { position: absolute; left: 50%; bottom: 0; z-index: 1; transform: translateX(-50%);
  height: min(96svh, 1040px); aspect-ratio: 768 / 960; max-width: 100%; mix-blend-mode: multiply;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent);
  animation: hero-rise 1.6s var(--ease) both .1s; }
@keyframes hero-rise { from { transform: translate(-50%, 3%); } to { transform: translate(-50%, 0); } }
.hero-video { width: 100%; height: 100%; object-fit: cover; object-position: 50% 100%; }

.hero-copy { position: absolute; z-index: 2; left: var(--gutter); right: var(--gutter); bottom: clamp(28px, 7vh, 72px); pointer-events: none;
  display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }
.hero-copy > * { pointer-events: auto; }
.hero-title { max-width: 30%; }
.hero-title h1 { font-weight: 700; letter-spacing: -0.045em; line-height: .96; font-size: clamp(40px, 5vw, 84px); }
.hero-kicker { font: 500 12px/1.4 var(--font-mono); letter-spacing: .04em; text-transform: uppercase; color: var(--mute);
  margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
.hero-kicker::before { content: ""; width: 8px; height: 8px; border-radius: 99px; background: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-soft); animation: kick-pulse 2.4s var(--ease) infinite; }
@keyframes kick-pulse { 0%,100% { box-shadow: 0 0 0 4px var(--accent-soft); } 50% { box-shadow: 0 0 0 8px rgba(138,28,43,0); } }
.hero-side p b { color: var(--ink); font-weight: 600; }
.hero-domains { display: flex; flex-wrap: wrap; gap: 6px; }
.hero-domains li { font: 500 11px/1 var(--font-mono); letter-spacing: .04em; text-transform: uppercase; color: var(--accent);
  background: var(--accent-soft); padding: 7px 10px; border-radius: 99px; }
.hero-side { max-width: min(30%, 360px); display: grid; gap: 22px; justify-items: start; }
.hero-side p { color: var(--ink-2); font-size: 15px; line-height: 1.55; }
.hero-ctas { display: flex; flex-wrap: wrap; gap: 10px; }

.hero-in { animation: hero-copy-in 1.2s var(--ease) both; animation-delay: calc(var(--i) * 90ms + 350ms); }
@keyframes hero-copy-in { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }

.hero-sound { position: absolute; z-index: 3; right: var(--gutter); top: 50%; transform: translateY(-50%);
  width: 46px; height: 46px; border-radius: 999px; background: var(--ink); color: #fff; display: grid; place-items: center;
  box-shadow: 0 12px 26px -14px rgba(13,13,13,.7); transition: transform .5s var(--ease), background-color .4s; }
.hero-sound:hover { transform: translateY(-50%) scale(1.06); background: #262626; }
.hero-sound svg { width: 16px; height: 16px; }
.hero-sound.is-blocked::before, .hero-sound.is-blocked::after { content: ""; position: absolute; inset: 0; border-radius: inherit;
  box-shadow: 0 0 0 1.5px rgba(138,28,43,.55); animation: ping 2.2s var(--ease) infinite; pointer-events: none; }
.hero-sound.is-blocked::after { animation-delay: 1.1s; }
@keyframes ping { from { transform: scale(1); opacity: 1; } to { transform: scale(1.9); opacity: 0; } }

.hero-scroll { position: absolute; z-index: 2; left: 50%; bottom: 14px; transform: translateX(-50%);
  font: 500 11px/1 var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--mute);
  display: none; }

@media (max-width: 899px) {
  .hero-stage { height: auto; max-height: none; min-height: 0; display: flex; flex-direction: column; padding-top: 76px; }
  .hero-ghost-mask { --hole: calc(62svh * .14); }
  .hero-ghost { top: calc(76px + 28svh); font-size: 31vw; }
  .hero-video-wrap { position: relative; left: auto; transform: none; margin-inline: auto; height: 62svh; min-height: 380px;
    animation-name: hero-rise-m; }
  @keyframes hero-rise-m { from { transform: translateY(3%); } to { transform: none; } }
  .hero-copy { position: relative; left: auto; right: auto; bottom: auto; flex-direction: column; align-items: stretch; gap: 22px;
    padding-top: 26px; padding-bottom: 56px; border-top: 1px solid var(--line); }
  .hero-title, .hero-side { max-width: none; }
  .hero-title h1 { font-size: clamp(40px, 11.5vw, 64px); }
  .hero-sound { top: calc(76px + 62svh - 64px); transform: none; }
  .hero-sound:hover { transform: scale(1.06); }
}
}
`;

type SoundState = { on: boolean; blocked: boolean };

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4.5 2.8v10.4c0 .5.5.8.9.5l8.1-5.2c.4-.2.4-.8 0-1L5.4 2.3c-.4-.3-.9 0-.9.5Z" fill="currentColor" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="3.5" y="2.5" width="3" height="11" rx="1" fill="currentColor" />
      <rect x="9.5" y="2.5" width="3" height="11" rx="1" fill="currentColor" />
    </svg>
  );
}

export default function Hero() {
  preload(asset("/hero/poster.webp"), { as: "image", fetchPriority: "high" });
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const soundBtnRef = useRef<HTMLButtonElement>(null);
  const [sound, setSound] = useState<SoundState>({ on: false, blocked: false });
  const visible = useRef(true);
  const userMuted = useRef(false);

  const started = useRef(false);
  const pendingStart = useRef<(() => void) | null>(null);

  // 1. start with sound; fall back to muted autoplay only when the browser
  //    actually refuses (NotAllowedError). An interrupted play() (AbortError:
  //    StrictMode re-run, the observer pausing a hero that loaded scrolled away)
  //    is retried instead of being mistaken for "blocked".
  useEffect(() => {
    const v = videoRef.current;
    if (!v || started.current) return;
    started.current = true;
    v.muted = true; // default attribute state (React does not render `muted`)
    if (prefersReducedMotion()) return; // poster only until the visitor presses play

    let attempts = 0;
    const tryStart = () => {
      if (userMuted.current) return;
      if (!visible.current) {
        pendingStart.current = tryStart; // resume when the hero is back in view
        return;
      }
      v.muted = false;
      v.play()
        .then(() => setSound({ on: true, blocked: false }))
        .catch((err: DOMException) => {
          if (err?.name === "NotAllowedError") {
            v.muted = true;
            v.play().catch(() => {});
            setSound({ on: false, blocked: true });
          } else if (attempts++ < 4) {
            setTimeout(tryStart, 200);
          }
        });
    };
    tryStart();
  }, []);

  // 2. unlock sound on the first gesture anywhere (except the sound button itself)
  useEffect(() => {
    if (!sound.blocked) return;
    const unlock = (e: Event) => {
      const v = videoRef.current;
      if (!v || userMuted.current) return;
      if (soundBtnRef.current?.contains(e.target as Node)) return;
      v.muted = false;
      if (visible.current) v.play().catch(() => {});
      setSound({ on: true, blocked: false });
    };
    const opts = { once: true, passive: true } as const;
    window.addEventListener("pointerdown", unlock, opts);
    window.addEventListener("keydown", unlock, opts);
    window.addEventListener("touchend", unlock, opts);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchend", unlock);
    };
  }, [sound.blocked]);

  // 3. pause when < 35 % of the hero is visible, resume when back
  useEffect(() => {
    const el = sectionRef.current;
    const v = videoRef.current;
    if (!el || !v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.intersectionRatio >= 0.35;
        if (!visible.current) v.pause();
        else if (pendingStart.current) {
          const start = pendingStart.current;
          pendingStart.current = null;
          start();
        } else if (v.paused && !(prefersReducedMotion() && v.currentTime === 0)) v.play().catch(() => {});
      },
      { threshold: [0, 0.35, 0.6, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    if (sound.on) {
      v.muted = true;
      userMuted.current = true;
      setSound({ on: false, blocked: false });
    } else {
      userMuted.current = false;
      v.muted = false;
      v.play().catch(() => {});
      setSound({ on: true, blocked: false });
    }
  };

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToTarget(id);
  };

  const ghost = PROFILE.firstName.toUpperCase().split("");

  return (
    <section id="top" ref={sectionRef} className="hero" aria-labelledby="hero-title">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="hero-stage wrap">
        <div className="hero-ghost-mask" aria-hidden="true">
          <div className="hero-ghost">
            {ghost.map((c, i) => (
              <span key={i} style={{ "--i": i } as React.CSSProperties}>
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-video-wrap">
          <video
            ref={videoRef}
            className="hero-video"
            muted
            loop
            playsInline
            preload="auto"
            poster={asset("/hero/poster.webp")}
            width={768}
            height={960}
            aria-describedby="hero-video-desc"
          >
            <source src={asset("/hero/hero.webm")} type="video/webm" />
            <source src={asset("/hero/hero.mp4")} type="video/mp4" />
          </video>
          <p id="hero-video-desc" className="sr-only">
            Intro video: an animated avatar of {PROFILE.name}, standing and speaking a short self-introduction.
          </p>
        </div>

        <button
          ref={soundBtnRef}
          type="button"
          className={`hero-sound${sound.blocked ? " is-blocked" : ""}`}
          onClick={toggleSound}
          aria-label={sound.on ? "Mute the intro video" : "Play the intro video with sound"}
        >
          {sound.on ? <PauseIcon /> : <PlayIcon />}
        </button>

        <div className="hero-copy">
          <div className="hero-title">
            <p className="hero-kicker hero-in" style={{ "--i": 0 } as React.CSSProperties}>
              {PROFILE.currentRole} · {PROFILE.currentCompany}
            </p>
            <h1 id="hero-title" className="hero-in" style={{ "--i": 1 } as React.CSSProperties}>
              Full Stack MERN <span className="accent">Developer.</span>
            </h1>
          </div>
          <div className="hero-side">
            <p className="hero-in" style={{ "--i": 2 } as React.CSSProperties}>
              {PROFILE.experienceYears} years building web apps with React.js, Node.js, Express.js and MongoDB, including APIs
              for a gaming platform <b>serving millions of users</b>.
            </p>
            <ul className="hero-domains hero-in" style={{ "--i": 2.5 } as React.CSSProperties} aria-label="Domains">
              {PROFILE.domains.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <div className="hero-ctas hero-in" style={{ "--i": 3 } as React.CSSProperties}>
              <a href="#work" className="btn btn-primary" onClick={go("work")}>
                Explore work
              </a>
              <a href="#contact" className="btn btn-ghost" onClick={go("contact")}>
                Let&apos;s talk
              </a>
              <a href={PROFILE.resume} className="btn btn-ghost" download>
                Résumé <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
