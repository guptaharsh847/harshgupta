import type { Project } from "@/lib/data";

/**
 * Grayscale, pure-CSS illustrations that hint at what each product does.
 * They are explicitly labelled "Illustrative UI" and contain no real data:
 * labels reuse résumé wording, values are abstract bars.
 */

export const miniUiCss = `
@layer components {
.mu { position: absolute; inset: 0; padding: 44px 18px 18px; display: flex; flex-direction: column; gap: 10px; font-size: 11px; color: var(--ink-2); }
.mu-win { flex: 1; min-height: 0; background: #fff; border-radius: 14px; box-shadow: var(--hair), 0 18px 36px -24px rgba(13,13,13,.35);
  display: flex; flex-direction: column; overflow: hidden; }
.mu-bar { height: 30px; flex: none; display: flex; align-items: center; gap: 5px; padding: 0 12px; border-bottom: 1px solid var(--line); }
.mu-bar i { width: 7px; height: 7px; border-radius: 99px; background: var(--soft); box-shadow: inset 0 0 0 1px var(--line); }
.mu-bar span { margin-left: 8px; font: 500 10px/1 var(--font-mono); color: var(--mute); }
.mu-main { flex: 1; min-height: 0; display: flex; }
.mu-side { width: 26%; border-right: 1px solid var(--line); padding: 12px 10px; display: grid; align-content: start; gap: 8px; }
.mu-side b { height: 8px; border-radius: 4px; background: var(--soft); display: block; }
.mu-side b.on { background: var(--ink); }
.mu-content { flex: 1; min-width: 0; padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.mu-h { font-weight: 700; font-size: 13px; color: var(--ink); letter-spacing: -0.02em; }
.mu-line { height: 7px; border-radius: 4px; background: var(--soft); }
.mu-row { display: flex; align-items: center; gap: 8px; padding: 8px; border-radius: 10px; box-shadow: var(--hair); background: #fff; }
.mu-pill { height: 20px; padding: 0 9px; border-radius: 99px; display: inline-flex; align-items: center; font-size: 10px; font-weight: 600;
  box-shadow: inset 0 0 0 1px rgba(13,13,13,.18); white-space: nowrap; }
.mu-pill.ink { background: var(--ink); color: #fff; box-shadow: none; }
.mu-av { width: 22px; height: 22px; border-radius: 99px; flex: none; background: linear-gradient(135deg, #cfccc5, #8f8c86); }
.mu-grow { flex: 1; min-width: 0; display: grid; gap: 5px; }
.mu-steps { display: flex; align-items: center; gap: 0; }
.mu-step { flex: none; padding: 8px 10px; border-radius: 10px; background: #fff; box-shadow: var(--hair); font-weight: 600; font-size: 10.5px; white-space: nowrap; }
.mu-step.ink { background: var(--ink); color: #fff; }
.mu-link { flex: 1; height: 1.5px; min-width: 10px; background: repeating-linear-gradient(90deg, var(--ink) 0 4px, transparent 4px 8px);
  animation: mu-dash 1.2s linear infinite; background-size: 16px 100%; }
@keyframes mu-dash { to { background-position: 16px 0; } }
.mu-tiles { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
.mu-tile { border-radius: 12px; box-shadow: var(--hair); padding: 10px; display: grid; gap: 8px; justify-items: start; background: #fff; }
.mu-ring { width: 40px; height: 40px; border-radius: 99px; background: conic-gradient(var(--ink) calc(var(--p) * 1%), var(--soft) 0);
  -webkit-mask: radial-gradient(closest-side, transparent 72%, #000 73%); mask: radial-gradient(closest-side, transparent 72%, #000 73%); }
.mu-score { height: 6px; border-radius: 4px; background: var(--ink); transform-origin: 0 50%; animation: mu-grow 2.4s var(--ease) infinite alternate; }
@keyframes mu-grow { from { transform: scaleX(.75); } to { transform: scaleX(1); } }
.mu-rank { width: 20px; font: 600 10px/1 var(--font-mono); color: var(--mute); }
.mu-table { display: grid; border-radius: 10px; box-shadow: var(--hair); overflow: hidden; background: #fff; }
.mu-tr { display: grid; grid-template-columns: 22px minmax(0,1fr) auto 26px; gap: 10px; align-items: center; padding: 8px 10px; border-top: 1px solid var(--line); }
.mu-tr:first-child { border-top: 0; font: 500 9.5px/1 var(--font-mono); text-transform: uppercase; color: var(--mute); letter-spacing: .05em; }
.mu-toggle { width: 26px; height: 15px; border-radius: 99px; background: var(--soft); position: relative; box-shadow: inset 0 0 0 1px var(--line); }
.mu-toggle::after { content: ""; position: absolute; top: 2px; left: 2px; width: 11px; height: 11px; border-radius: 99px; background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,.3); transition: transform .4s; }
.mu-toggle.on { background: var(--ink); }
.mu-toggle.on::after { transform: translateX(11px); }
.mu-chart { flex: 1; min-height: 40px; display: flex; align-items: flex-end; gap: 5px; padding: 8px; border-radius: 10px; box-shadow: var(--hair); background: #fff; }
.mu-chart i { flex: 1; border-radius: 3px 3px 0 0; background: var(--ink); opacity: .85; height: var(--h); }
.mu-chart i:nth-child(even) { background: var(--faint); }
}
`;

const Win = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mu-win">
    <div className="mu-bar">
      <i />
      <i />
      <i />
      <span>{title}</span>
    </div>
    {children}
  </div>
);

const Side = ({ on = 0, n = 5 }: { on?: number; n?: number }) => (
  <div className="mu-side">
    {Array.from({ length: n }, (_, i) => (
      <b key={i} className={i === on ? "on" : ""} style={{ width: `${60 + ((i * 17) % 35)}%` }} />
    ))}
  </div>
);

function Insurance() {
  return (
    <Win title="insurance-portal">
      <div className="mu-main">
        <Side on={1} />
        <div className="mu-content">
          <p className="mu-h">Business workflow</p>
          <div className="mu-steps">
            <span className="mu-step">Customer</span>
            <span className="mu-link" />
            <span className="mu-step ink">REST API</span>
            <span className="mu-link" />
            <span className="mu-step">Neutrinos</span>
          </div>
          <p className="mu-h" style={{ marginTop: 6 }}>
            Master data
          </p>
          {[78, 62, 70].map((w, i) => (
            <div key={i} className="mu-row">
              <span className="mu-grow">
                <span className="mu-line" style={{ width: `${w}%`, background: i === 0 ? "#cfccc5" : undefined }} />
                <span className="mu-line" style={{ width: `${w - 30}%` }} />
              </span>
              <span className={`mu-toggle${i !== 1 ? " on" : ""}`} />
            </div>
          ))}
        </div>
      </div>
    </Win>
  );
}

function Policy() {
  return (
    <Win title="my-policies">
      <div className="mu-content">
        <p className="mu-h">Your policies</p>
        {[0, 1].map((i) => (
          <div key={i} className="mu-row" style={{ alignItems: "flex-start", flexDirection: "column", gap: 8 }}>
            <span className="mu-line" style={{ width: i ? "48%" : "60%", background: "#cfccc5" }} />
            <span className="mu-line" style={{ width: "36%" }} />
            <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span className="mu-pill">View policy</span>
              <span className="mu-pill ink">Make payment</span>
              <span className="mu-pill">Raise request</span>
            </span>
          </div>
        ))}
        <div className="mu-row">
          <span className="mu-pill">Service request</span>
          <span className="mu-grow">
            <span className="mu-line" style={{ width: "70%" }} />
          </span>
        </div>
      </div>
    </Win>
  );
}

function Wellness() {
  return (
    <Win title="wellness-portal">
      <div className="mu-main">
        <Side on={0} n={4} />
        <div className="mu-content">
          <p className="mu-h">Wellness</p>
          <div className="mu-tiles">
            {[72, 45, 88].map((p, i) => (
              <div key={i} className="mu-tile">
                <span className="mu-ring" style={{ "--p": p } as React.CSSProperties} />
                <span className="mu-line" style={{ width: "80%" }} />
              </div>
            ))}
          </div>
          <div className="mu-chart">
            {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
              <i key={i} style={{ "--h": `${h}%` } as React.CSSProperties} />
            ))}
          </div>
        </div>
      </div>
    </Win>
  );
}

function Gaming() {
  return (
    <Win title="leaderboard">
      <div className="mu-content">
        <p className="mu-h" style={{ display: "flex", justifyContent: "space-between" }}>
          Leaderboard <span className="mu-pill ink">Live</span>
        </p>
        {[100, 86, 74, 61, 50].map((w, i) => (
          <div key={i} className="mu-row" style={{ padding: "6px 8px" }}>
            <span className="mu-rank">{String(i + 1).padStart(2, "0")}</span>
            <span className="mu-av" />
            <span className="mu-grow">
              <span className="mu-line" style={{ width: "46%", background: "#cfccc5" }} />
              <span className="mu-score" style={{ width: `${w}%`, animationDelay: `${i * 0.2}s` }} />
            </span>
          </div>
        ))}
      </div>
    </Win>
  );
}

function Admin() {
  const roles = ["Admin", "Editor", "Viewer", "Editor"];
  return (
    <Win title="admin-dashboard">
      <div className="mu-main">
        <Side on={2} />
        <div className="mu-content">
          <p className="mu-h">Users &amp; roles</p>
          <div className="mu-table">
            <div className="mu-tr">
              <span />
              <span>User</span>
              <span>Role</span>
              <span>On</span>
            </div>
            {roles.map((r, i) => (
              <div key={i} className="mu-tr">
                <span className="mu-av" />
                <span className="mu-line" style={{ width: `${70 - i * 9}%` }} />
                <span className={`mu-pill${i === 0 ? " ink" : ""}`}>{r}</span>
                <span className={`mu-toggle${i !== 2 ? " on" : ""}`} />
              </div>
            ))}
          </div>
          <div className="mu-chart" style={{ maxHeight: 70 }}>
            {[30, 55, 45, 70, 60, 85].map((h, i) => (
              <i key={i} style={{ "--h": `${h}%` } as React.CSSProperties} />
            ))}
          </div>
        </div>
      </div>
    </Win>
  );
}

const MAP: Record<Project["ui"], () => React.JSX.Element> = {
  insurance: Insurance,
  policy: Policy,
  wellness: Wellness,
  gaming: Gaming,
  admin: Admin,
};

export default function MiniUI({ kind }: { kind: Project["ui"] }) {
  const C = MAP[kind];
  return (
    <div className="mu" aria-hidden="true">
      <C />
    </div>
  );
}
