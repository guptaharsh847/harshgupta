import type { ReactNode } from "react";

type Props = {
  index: number;
  label: string;
  /** heading lines; the last line is followed by the italic accent word */
  lines: ReactNode[];
  accent: string;
  id?: string;
  className?: string;
  children?: ReactNode;
};

/** Mono index tag + masked, line-by-line heading ending in one serif italic word. */
export default function SectionHead({ index, label, lines, accent, id, className = "", children }: Props) {
  return (
    <header className={className}>
      <p className="tag rv">
        <span>
          {String(index).padStart(2, "0")} — {label}
        </span>
      </p>
      <h2 id={id} className="h-section mt-6">
        {lines.map((line, i) => (
          <span key={i} className="rv-mask" style={{ "--i": i } as React.CSSProperties}>
            <span>
              {line}
              {i === lines.length - 1 && (
                <>
                  {" "}
                  <span className="accent">{accent}</span>
                </>
              )}
            </span>
          </span>
        ))}
      </h2>
      {children}
    </header>
  );
}
