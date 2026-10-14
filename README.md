# Harsh Gupta: Portfolio

A quiet, single-page portfolio built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4 and Lenis. The palette is warm paper, ink and grays plus one oxblood accent (`--accent: #8a1c2b`, 8.3:1 contrast on paper). There is no WebGL, no GSAP and no loader. All motion comes from CSS, IntersectionObserver and small `requestAnimationFrame` loops.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (type-check + lint)
npm start          # serve the production build
```

Requires Node 18.18+ (tested on Node 20).

## Content

All text comes from `resume.pdf`, including its embedded links, and lives in **`src/lib/data.ts`** (`PROFILE`, `NAV`, `SKILL_GROUPS`, `EXPERIENCE`, `EDUCATION`, `PROJECTS`, `CERTIFICATIONS`, `ACHIEVEMENTS`, `TIMELINE`). Components only read from that file. To change the copy, edit `data.ts`. To replace the résumé, swap `public/Harsh-Gupta-Resume.pdf`.

Owner-approved deviations from the PDF:

| Item | PDF | Site |
| --- | --- | --- |
| Total experience | "around 4.8 years" | **5.1+ years** (`PROFILE.experienceYears`) |
| ID card "Valid till" | – | **2027** (`PROFILE.idValidTill`) |
| LinkedIn | link text `guptaharsh847` / href `harsh-gupta-483b88157` | `linkedin.com/in/guptaharsh847` |
| Work section | no projects list | built from the products named in the experience bullets |
| `--mute` token | spec `#77756f` | `#6c6a64` so it passes WCAG AA contrast on paper |
| ID card "ID No." | – | replaced by "Since 09/2021" (career start) |
| Contact status | – | "Based in Bengaluru · open to conversations" (owner-approved) |
| Skills table | 16 listed skills | plus Bootstrap, Mongoose, Git and Neutrinos, which are named in the experience bullets |

**Company logos:** each `EXPERIENCE` entry has an optional `logo`. Add the file to `public/logos/companies/` and set, for example, `logo: "/logos/companies/infosys.svg"`; it then appears on that timeline stop.

The résumé has no GitHub link, so every GitHub button is hidden. Setting `PROFILE.github` or a project's `github` makes them appear.

## Sections

| # | Section | Component | Signature motion |
| --- | --- | --- | --- |
| – | Hero | `hero/Hero.tsx` | looping intro video (multiply blend), ghost word, sound toggle with ping ring; pauses below 35 % visibility |
| 01 | About | `sections/About.tsx` | lanyard ID card: damped pendulum swing, idle sway, 3D flip (hover / tap / Enter) |
| 02 | Skills | `sections/Skills.tsx` | periodic table with a diagonal wave reveal, family filters and a sticky inspector with logo pop |
| 03 | Work | `sections/Work.tsx` + `ui/MiniUI.tsx` | expanding accordion (flex 8) with spines; clip-path wipe of an "Illustrative UI" |
| 04 | Experience | `sections/Experience.tsx` | scroll-drawn spine; stops light up; expandable highlights with tech chips |
| 05 | Certifications | `sections/Certifications.tsx` | accent-flood rows (`scaleX` on `::before`), featured "Latest" badge |
| 06 | Achievements | `sections/Achievements.tsx` | pinned horizontal gallery, count-up (easeOutQuart, 1.4 s), nearest card lifts |
| 07 | Contact | `sections/Contact.tsx` | hopping letters, copy-email chip (`aria-live`), spinning "say hello" badge |

Shared code: `Navigation.tsx` (active-section pill, progress bar, mobile overlay), `ui/RevealObserver.tsx` (`.rv` / `.rv-mask`), `ui/SectionHead.tsx`, `ui/TechLogo.tsx` (`BRAND`, `CONCEPT`, `isBrand()`), `lib/hooks.ts`, `lib/scroll.tsx` (Lenis + `scrollToTarget`).

## Rebuilding the hero video

`scripts/build-hero-assets.py` turns `intro.mp4` into the hero assets. It needs ffmpeg and numpy; if ffmpeg isn't on `PATH`, the script falls back to the binary bundled with `imageio-ffmpeg`.

```bash
npm run hero
# = uv run --with numpy --with imageio-ffmpeg --with pillow python scripts/build-hero-assets.py
# options: --src intro.mp4 --photo idphoto.png --crop W:H:X:Y --whiten 0.98 --seconds 10 --fade 0.5
```

What the script does:

1. **Detect and crop.** Finds the person against the backdrop over 8 sampled frames and crops head-to-toe at 4:5, centred. You can override this with `--crop` (for example `crop=800:1000:<x>:80`).
2. **Scale and whiten.** Scales to 768 × 960 and applies `colorlevels=rimax=gimax=bimax`. The default is 0.98, but the script measures the backdrop and lowers the value when the backdrop is grayer. This source measured about 232/255, which gives roughly 0.89. Either way the backdrop becomes pure white, so `mix-blend-mode: multiply` dissolves it into the page.
3. **Loop seamlessly.** Video: the tail `[L-0.5, L]` is `xfade`d into the head `[0, 0.5]`. Audio: the same cross-fade is done sample-accurately in numpy (equal power). Nothing is retimed, so the lips stay in sync.
4. **Export.**
   - `public/hero/hero.webm`: VP9 CRF 36 + Opus 80k (first `<source>`)
   - `public/hero/hero.mp4`: H.264 CRF 24 slow, yuv420p, AAC 96k, `+faststart`
   - `public/hero/poster.webp`: the first frame of the loop
   - `public/portrait-bust.webp`: 480 × 600, from `idphoto.png`, or from the sharpest video frame with `--photo none`
   - `public/og.jpg`: 1200 × 630

## Fonts

All fonts are self-hosted via `next/font/local` from `src/fonts`, and are licensed under the SIL Open Font License 1.1 (taken from the Fontsource packages):

- Inter Tight (variable)
- Instrument Serif (italic is used; the regular cut is included)
- JetBrains Mono (variable)

## Logos: credits and licences

The brand logos in `public/logos` keep their official colours and are used only to identify the technologies.

- **Devicon** "original" SVGs (React, Redux, HTML5, CSS3, JavaScript, Tailwind CSS, Node.js, Express, MongoDB, Firebase, MySQL, GitHub, Postman, VS Code, Bootstrap): MIT, see `public/logos/LICENSE-devicon.txt`.
- **Simple Icons** (JSON Web Tokens): CC0 1.0, see `public/logos/LICENSE-simple-icons.md` and `DISCLAIMER-simple-icons.md`.

All trademarks belong to their respective owners. The concept icons (REST APIs, experience, companies, publications, education) are original line drawings in `ui/TechLogo.tsx`.

## Quality checks run

- `npm run build`: passes with no type or lint errors. First-load JS for `/` is 134 kB.
- Playwright at 1440 × 900 and 390 × 844:
  - `scrollWidth === innerWidth` in every section.
  - No console errors.
  - The video pauses off-hero and resumes on return, and sound unlocks on the first gesture.
  - The ▶/❚❚ toggle, ID card swing and flip (keyboard and tap), mobile menu with Esc and scroll lock, pinned achievements and count-up all work.
- Lighthouse (local production build):
  - Desktop: Performance 95–99, Accessibility 100, Best Practices 100, SEO 100.
  - Mobile: Performance 80–91 (varies between runs), Accessibility 100.
