/**
 * Brand logos (official colours, files in /public/logos; devicon MIT, simple-icons CC0)
 * and thin line icons for concepts, drawn in the same 24px grid.
 */

import { asset } from "@/lib/asset";

type Brand = { file: string; label: string; tint: string };

export const BRAND: Record<string, Brand> = {
  react: { file: "react.svg", label: "React", tint: "#61DAFB" },
  redux: { file: "redux.svg", label: "Redux", tint: "#764ABC" },
  html5: { file: "html5.svg", label: "HTML5", tint: "#E34F26" },
  css3: { file: "css3.svg", label: "CSS3", tint: "#1572B6" },
  javascript: { file: "javascript.svg", label: "JavaScript", tint: "#F7DF1E" },
  tailwindcss: { file: "tailwindcss.svg", label: "Tailwind CSS", tint: "#06B6D4" },
  nodejs: { file: "nodejs.svg", label: "Node.js", tint: "#5FA04E" },
  express: { file: "express.svg", label: "Express", tint: "#8a8a8a" },
  mongodb: { file: "mongodb.svg", label: "MongoDB", tint: "#47A248" },
  firebase: { file: "firebase.svg", label: "Firebase", tint: "#FFCA28" },
  mysql: { file: "mysql.svg", label: "MySQL", tint: "#4479A1" },
  github: { file: "github.svg", label: "GitHub", tint: "#8a8a8a" },
  postman: { file: "postman.svg", label: "Postman", tint: "#FF6C37" },
  vscode: { file: "vscode.svg", label: "VS Code", tint: "#007ACC" },
  bootstrap: { file: "bootstrap.svg", label: "Bootstrap", tint: "#7952B3" },
  jwt: { file: "jwt.svg", label: "JSON Web Tokens", tint: "#8a8a8a" },
  mongoose: { file: "mongoose.svg", label: "Mongoose", tint: "#880000" },
  git: { file: "git.svg", label: "Git", tint: "#F05032" },
};

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.25, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const CONCEPT: Record<string, { label: string; draw: React.ReactNode }> = {
  rest: {
    label: "RESTful APIs",
    draw: (
      <g {...s}>
        <rect x="3" y="4" width="18" height="16" rx="3" />
        <path d="M3 8.5h18" />
        <path d="M8 12.5 6 14.5l2 2M16 12.5l2 2-2 2M13 12l-2 5" />
      </g>
    ),
  },
  lowcode: {
    label: "Low-code platform",
    draw: (
      <g {...s}>
        <rect x="3" y="3.5" width="7" height="7" rx="1.8" />
        <rect x="14" y="13.5" width="7" height="7" rx="1.8" />
        <rect x="3" y="13.5" width="7" height="7" rx="1.8" />
        <path d="M17.5 4v6M14.5 7h6M10 7h2M6.5 10.5v3M10 17h4" />
      </g>
    ),
  },
  badge: {
    label: "Certifications",
    draw: (
      <g {...s}>
        <circle cx="12" cy="9" r="5.5" />
        <path d="m9.6 9 1.7 1.7 3.2-3.4M8.5 13.4 7 21l5-2.6 5 2.6-1.5-7.6" />
      </g>
    ),
  },
  briefcase: {
    label: "Experience",
    draw: (
      <g {...s}>
        <rect x="3" y="7" width="18" height="13" rx="2.5" />
        <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18M11 12.5v1.5h2v-1.5" />
      </g>
    ),
  },
  building: {
    label: "Companies",
    draw: (
      <g {...s}>
        <path d="M4 20V5.5A1.5 1.5 0 0 1 5.5 4h7A1.5 1.5 0 0 1 14 5.5V20M14 10h4.5A1.5 1.5 0 0 1 20 11.5V20M2.5 20h19" />
        <path d="M7.5 8h3M7.5 11.5h3M7.5 15h3M16.5 14h1M16.5 17h1" />
      </g>
    ),
  },
  paper: {
    label: "Publications",
    draw: (
      <g {...s}>
        <path d="M6 3.5h8l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1-1.5Z" />
        <path d="M14 3.5V7.5h4M8.5 11h7M8.5 14h7M8.5 17h4" />
      </g>
    ),
  },
  cap: {
    label: "Education",
    draw: (
      <g {...s}>
        <path d="m2.5 9.5 9.5-5 9.5 5-9.5 5-9.5-5Z" />
        <path d="M6.5 11.6v4.4c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3v-4.4M21.5 9.5v5" />
      </g>
    ),
  },
};

export function isBrand(key: string): boolean {
  return key in BRAND;
}

export function brandTint(key: string): string | undefined {
  return BRAND[key]?.tint;
}

type Props = {
  name: string;
  size?: number;
  className?: string;
  /** when true the logo is purely decorative (label rendered next to it) */
  decorative?: boolean;
};

export default function TechLogo({ name, size = 24, className = "", decorative = true }: Props) {
  const brand = BRAND[name];
  if (brand) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={asset(`/logos/${brand.file}`)}
        width={size}
        height={size}
        alt={decorative ? "" : `${brand.label} logo`}
        loading="lazy"
        decoding="async"
        draggable={false}
        className={className}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }
  const concept = CONCEPT[name];
  if (!concept) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : concept.label}
    >
      {concept.draw}
    </svg>
  );
}
