import { CERTIFICATIONS } from "@/lib/data";

const css = `
@layer components {
.certs { background: var(--card); border-block: 1px solid var(--line); }
.certs-grid { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: clamp(32px, 5vw, 96px); align-items: start; }
.certs-head { position: sticky; top: 110px; }
.certs-count { margin-top: 22px; font: 500 13px/1.5 var(--font-mono); color: var(--mute); }
.certs-count b { color: var(--ink); font-weight: 600; }
.certs-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); counter-reset: c; }
.cert { position: relative; display: grid; grid-template-columns: 56px minmax(0,1fr) 32px; gap: 16px; align-items: center;
  padding: 26px 20px 26px 16px; border-bottom: 1px solid var(--line); isolation: isolate; outline: none; cursor: default; }
.cert::before { content: ""; position: absolute; inset: 0; z-index: -1; background: var(--ink); transform: scaleX(0); transform-origin: 0 50%;
  transition: transform .75s var(--ease); }
.cert:hover::before, .cert:focus-visible::before { transform: scaleX(1); }
.cert:focus-visible { box-shadow: 0 0 0 2px var(--ink); }
.cert-n { font: 500 13px/1 var(--font-mono); color: var(--mute); transition: color .5s var(--ease); }
.cert-t { font-weight: 600; font-size: clamp(18px, 1.7vw, 24px); letter-spacing: -0.025em; line-height: 1.2; transition: color .5s var(--ease); }
.cert-i { margin-top: 6px; font-size: 14px; color: var(--mute); transition: color .5s var(--ease); display: flex; gap: 10px; flex-wrap: wrap; }
.cert-i .mono { font-size: 12px; }
.cert-arrow { font-size: 20px; color: #fff; opacity: 0; transform: translateX(-14px); transition: opacity .5s var(--ease), transform .7s var(--ease); }
.cert:hover .cert-n, .cert:focus-visible .cert-n, .cert:hover .cert-i, .cert:focus-visible .cert-i { color: rgba(255,255,255,.62); }
.cert:hover .cert-t, .cert:focus-visible .cert-t { color: #fff; }
.cert:hover .cert-arrow, .cert:focus-visible .cert-arrow { opacity: 1; transform: none; }
@media (max-width: 859px) {
  .certs-grid { grid-template-columns: minmax(0,1fr); }
  .certs-head { position: relative; top: 0; }
  .cert { grid-template-columns: 40px minmax(0,1fr) 22px; padding-inline: 8px; }
}
}
`;

export default function Certifications() {
  return (
    <section id="certifications" className="section certs" aria-labelledby="certs-title">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="wrap certs-grid">
        <div className="certs-head">
          <p className="tag rv">
            <span>04 — Certifications</span>
          </p>
          <h2 id="certs-title" className="h-section mt-6">
            <span className="rv-mask">
              <span>
                Always <span className="accent">learning.</span>
              </span>
            </span>
          </h2>
          <p className="certs-count rv" style={{ "--i": 1 } as React.CSSProperties}>
            <b>{String(CERTIFICATIONS.length).padStart(2, "0")}</b> certifications &amp; trainings, from database
            fundamentals to MongoDB.
          </p>
        </div>
        <ol className="certs-list">
          {CERTIFICATIONS.map((c, i) => (
            <li
              key={c.title}
              className="cert rv"
              tabIndex={0}
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="cert-n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="cert-t">{c.title}</p>
                <p className="cert-i">
                  <span>{c.issuer}</span>
                  {c.date && <span className="mono">{c.date}</span>}
                </p>
              </div>
              <span className="cert-arrow" aria-hidden="true">
                ↗
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
