/**
 * Single source of content. Everything here is taken from resume.pdf
 * (text + embedded hyperlinks). Components only read from this file.
 * If it is not in the résumé, it is not on the site.
 */

export type SectionId =
  | "top"
  | "about"
  | "skills"
  | "work"
  | "certifications"
  | "experience"
  | "achievements"
  | "contact";

export const PROFILE = {
  name: "Harsh Gupta",
  firstName: "Harsh",
  initials: "HG",
  role: "Full Stack MERN Developer",
  email: "guptaharsh847@gmail.com",
  phone: "9131379080",
  phoneHref: "tel:+919131379080",
  /** Not stated as a personal location; this is where the current role (Nexsys IT) is based. */
  location: "Bengaluru",
  resumeSummary:
    "Full Stack Developer with 5.1+ years of experience in developing and maintaining web applications using React.js, Node.js, Express.js, and MongoDB. Proficient in building RESTful APIs, handling database operations, and implementing user authentication. Experienced in integrating third-party services, improving application performance, and ensuring cross-browser compatibility. Focused on writing clean, maintainable code and delivering reliable, production-ready solutions.",
  /** first sentence of the summary, shown large in About */
  summaryLead:
    "Full Stack Developer with 5.1+ years of experience in developing and maintaining web applications using React.js, Node.js, Express.js, and MongoDB.",
  /** the remaining summary sentences, verbatim, as highlight rows */
  summaryHighlights: [
    { label: "APIs & auth", text: "Proficient in building RESTful APIs, handling database operations, and implementing user authentication." },
    { label: "Integration & speed", text: "Experienced in integrating third-party services, improving application performance, and ensuring cross-browser compatibility." },
    { label: "Craft", text: "Focused on writing clean, maintainable code and delivering reliable, production-ready solutions." },
  ],
  /** industries worked in, from the employers in the résumé */
  domains: ["Insurance", "Gaming", "Enterprise IT"],
  careerStart: "09/2021",
  /** owner-confirmed update (résumé PDF says "around 4.8 years") */
  experienceYears: "5.1+",
  /** owner-chosen "Valid till" year for the ID card */
  idValidTill: "2027",
  currentRole: "Senior Software Developer",
  currentCompany: "Nexsys IT",
  github: null as string | null, // not in the résumé
  linkedin: "https://www.linkedin.com/in/guptaharsh847",
  linkedinLabel: "linkedin.com/in/guptaharsh847",
  resume: "/Harsh-Gupta-Resume.pdf",
  languages: ["English", "Hindi"],
} as const;

export const NAV: { id: SectionId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

/* ------------------------------------------------------------------ skills */
export type Family = "Frontend" | "Backend" | "Database" | "Tools";

export type Skill = {
  name: string;
  symbol: string;
  family: Family;
  /** key into TechLogo BRAND / CONCEPT maps */
  logo: string;
  /** Work panel ids where this skill is used (named in the bullet, or the stack it is built on) */
  usedIn: string[];
  /** experience ids whose role-level bullets name this skill (not tied to one product) */
  at?: string[];
};

export const SKILL_GROUPS: { family: Family; skills: Skill[] }[] = [
  {
    family: "Frontend",
    skills: [
      { name: "React.js", symbol: "Re", family: "Frontend", logo: "react", usedIn: ["wellness", "gaming", "admin"] },
      { name: "Redux", symbol: "Rx", family: "Frontend", logo: "redux", usedIn: ["admin"] },
      { name: "HTML5", symbol: "Ht", family: "Frontend", logo: "html5", usedIn: ["wellness", "gaming", "admin"] },
      { name: "CSS3", symbol: "Cs", family: "Frontend", logo: "css3", usedIn: ["wellness", "gaming", "admin"] },
      { name: "JavaScript (ES6+)", symbol: "Js", family: "Frontend", logo: "javascript", usedIn: ["insurance", "policy", "wellness", "gaming", "admin"] },
      { name: "Tailwind CSS", symbol: "Tw", family: "Frontend", logo: "tailwindcss", usedIn: ["admin"] },
      { name: "Bootstrap", symbol: "Bs", family: "Frontend", logo: "bootstrap", usedIn: ["admin"] },
    ],
  },
  {
    family: "Backend",
    skills: [
      { name: "Node.js", symbol: "No", family: "Backend", logo: "nodejs", usedIn: ["insurance", "policy", "gaming", "admin"] },
      { name: "Express.js", symbol: "Ex", family: "Backend", logo: "express", usedIn: ["insurance", "gaming", "admin"] },
      { name: "RESTful APIs", symbol: "Ap", family: "Backend", logo: "rest", usedIn: ["insurance", "policy", "gaming", "admin"] },
      { name: "JWT Authentication", symbol: "Jw", family: "Backend", logo: "jwt", usedIn: ["admin"] },
    ],
  },
  {
    family: "Database",
    skills: [
      { name: "MongoDB", symbol: "Mg", family: "Database", logo: "mongodb", usedIn: ["gaming", "admin"], at: ["canara"] },
      { name: "Firebase", symbol: "Fb", family: "Database", logo: "firebase", usedIn: [], at: ["canara"] },
      { name: "Mongoose", symbol: "Mo", family: "Database", logo: "mongoose", usedIn: ["gaming"] },
      { name: "MySQL", symbol: "Sq", family: "Database", logo: "mysql", usedIn: [] },
    ],
  },
  {
    family: "Tools",
    skills: [
      { name: "Git", symbol: "Gt", family: "Tools", logo: "git", usedIn: ["gaming"] },
      { name: "GitHub", symbol: "Gh", family: "Tools", logo: "github", usedIn: ["gaming"] },
      { name: "Postman", symbol: "Pm", family: "Tools", logo: "postman", usedIn: ["gaming", "admin"] },
      { name: "VS Code", symbol: "Vs", family: "Tools", logo: "vscode", usedIn: [] },
      { name: "Neutrinos", symbol: "Nt", family: "Tools", logo: "lowcode", usedIn: ["insurance"] },
    ],
  },
];

/* -------------------------------------------------------------- experience */
export type Experience = {
  id: string;
  role: string;
  company: string;
  place: string;
  start: string;
  end: string;
  duration?: string;
  points: string[];
  /** optional company logo, e.g. "/logos/companies/infosys.svg" (add the file, then set this) */
  logo?: string;
  /** tools named in this role's bullets */
  tech: { name: string; logo?: string }[];
};

export const EXPERIENCE: Experience[] = [
  {
    id: "nexsys",
    tech: [{ name: "Neutrinos", logo: "lowcode" }, { name: "Node.js", logo: "nodejs" }, { name: "Express.js", logo: "express" }, { name: "REST APIs", logo: "rest" }],
    role: "Senior Software Developer",
    company: "Nexsys IT",
    place: "Bengaluru",
    start: "05/2026",
    end: "Present",
    points: [
      "Completed training on the Neutrinos no-code/low-code platform (SSD, Alpha, and Reels) and developed insurance applications by configuring business workflows, master data, and platform components.",
      "Built and customized customer and internal insurance portals, developed Node.js/Express.js REST APIs, and integrated backend services with Neutrinos applications.",
    ],
  },
  {
    id: "canara",
    tech: [{ name: "Node.js", logo: "nodejs" }, { name: "React.js", logo: "react" }, { name: "MongoDB", logo: "mongodb" }, { name: "Firebase", logo: "firebase" }, { name: "REST APIs", logo: "rest" }],
    role: "Full Stack Developer (Assistant Manager)",
    company: "Canara HSBC Life Insurance",
    place: "Gurugram",
    start: "07/2025",
    end: "02/2026",
    duration: "7 months",
    points: [
      "Developed and maintained RESTful APIs using Node.js for a policy management platform enabling users to view policies, make payments, and raise service requests.",
      "Implemented new backend features based on business requirements, ensuring clean architecture and structured code practices.",
      "Debugged and resolved production-level issues by analyzing code and fixing defects to improve application stability.",
      "Contributed to the development of an internal Wellness Portal using React.js in a 2-member team, supporting internal user operations.",
      "Integrated MongoDB and Google Firebase for efficient data storage, retrieval, and real-time data handling.",
      "Followed best practices for writing modular, maintainable, and scalable code.",
    ],
  },
  {
    id: "atmegame",
    tech: [{ name: "MongoDB", logo: "mongodb" }, { name: "Express.js", logo: "express" }, { name: "React.js", logo: "react" }, { name: "Node.js", logo: "nodejs" }, { name: "Mongoose", logo: "mongoose" }, { name: "Postman", logo: "postman" }, { name: "Git", logo: "git" }, { name: "GitHub", logo: "github" }],
    role: "Full Stack MERN Developer",
    company: "Atmegame",
    place: "New Delhi",
    start: "01/2023",
    end: "07/2025",
    duration: "2 years 7 months",
    points: [
      "Designed scalable web features for an online gaming platform using the MERN stack.",
      "Enhanced dynamic React components to enhance UI responsiveness and improve overall user interaction on the gaming platform.",
      "Built and integrated RESTful APIs using Node.js and Express.js to manage user data, game logic, and leaderboards for a platform serving millions of users; validated endpoints and data flow using Postman.",
      "Structured MongoDB collections and models using Mongoose for efficient handling of user profiles, scores, and gameplay analytics.",
      "Collaborated with UI/UX designers and testers to ensure functionality across devices and browsers.",
      "Managed code using Git for version control and coordinated updates through GitHub repositories.",
      "Regularly optimized application performance and fixed production issues to ensure smooth gameplay.",
    ],
  },
  {
    id: "infosys",
    tech: [{ name: "React.js", logo: "react" }, { name: "Redux", logo: "redux" }, { name: "Tailwind CSS", logo: "tailwindcss" }, { name: "Bootstrap", logo: "bootstrap" }, { name: "Node.js", logo: "nodejs" }, { name: "Express.js", logo: "express" }, { name: "JWT", logo: "jwt" }, { name: "Postman", logo: "postman" }],
    role: "System Engineer (Developer)",
    company: "Infosys",
    place: "Pune",
    start: "09/2021",
    end: "12/2022",
    duration: "1 year 3 months",
    points: [
      "Deployed a scalable MERN stack web application enabling user authentication, content browsing, and role-based access control.",
      "Built non-static, responsive UI components using React.js, Redux, Tailwind CSS, and Bootstrap, improving user engagement and usability.",
      "Created secure backend APIs to handle CRUD operations, session management, and role-based access control using Node.js, Express.js, and JWT authentication; focused on modular and reusable code design.",
      "Created an Admin Dashboard for managing users, content analytics, and system configurations with granular role-based permissions.",
      "Applied RESTful API architecture principles to ensure modularity, reusability, and maintainability of backend services.",
      "Conducted unit testing and API testing using Postman to validate data flow and ensure application reliability.",
    ],
  },
];

/* --------------------------------------------------------------- education */
export type Education = {
  id: string;
  degree: string;
  short: string;
  school: string;
  place: string;
  start: string;
  end: string;
  mode: string;
  score: string;
};

export const EDUCATION: Education[] = [
  {
    id: "mba",
    degree: "Masters in Business Administration (Finance)",
    short: "MBA (Finance)",
    school: "Chandigarh University",
    place: "Chandigarh",
    start: "2022",
    end: "2024",
    mode: "Online Learning",
    score: "GPA 8.2",
  },
  {
    id: "btech",
    degree: "Bachelor of Technology (B. Tech) in Information Technology",
    short: "B.Tech (IT)",
    school: "Acropolis Institute of Technology and Research",
    place: "Indore",
    start: "2017",
    end: "2021",
    mode: "Full Time",
    score: "GPA 7.9",
  },
];

/* ---------------------------------------------------------------- projects */
/**
 * The résumé has no separate projects list. These panels are the products
 * named in the experience bullets; descriptions and features are résumé text.
 */
export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  description: string;
  features: string[];
  tech: { name: string; logo?: string }[];
  /** headline outcome, résumé wording */
  impact: string;
  github: string | null;
  ui: "insurance" | "policy" | "wellness" | "gaming" | "admin";
};

export const PROJECTS: Project[] = [
  {
    id: "insurance",
    index: "01",
    title: "Insurance Portals",
    kicker: "Nexsys IT · 2026 – Present",
    description:
      "Built and customized customer and internal insurance portals, developed Node.js/Express.js REST APIs, and integrated backend services with Neutrinos applications.",
    features: [
      "Customer & internal portals",
      "Business workflows",
      "Master data & platform components",
      "Neutrinos (SSD, Alpha, Reels)",
    ],
    tech: [
      { name: "Node.js", logo: "nodejs" },
      { name: "Express.js", logo: "express" },
      { name: "REST APIs", logo: "rest" },
      { name: "Neutrinos" },
    ],
    github: null,
    impact: "Customer & internal portals",
    ui: "insurance",
  },
  {
    id: "policy",
    index: "02",
    title: "Policy Management Platform",
    kicker: "Canara HSBC Life Insurance · 2025 – 26",
    description:
      "Developed and maintained RESTful APIs using Node.js for a policy management platform enabling users to view policies, make payments, and raise service requests.",
    features: ["View policies", "Make payments", "Raise service requests", "Production defect fixes"],
    tech: [
      { name: "Node.js", logo: "nodejs" },
      { name: "RESTful APIs", logo: "rest" },
    ],
    github: null,
    impact: "View policies, pay & raise requests",
    ui: "policy",
  },
  {
    id: "wellness",
    index: "03",
    title: "Wellness Portal",
    kicker: "Canara HSBC Life Insurance · Internal",
    description:
      "Contributed to the development of an internal Wellness Portal using React.js in a 2-member team, supporting internal user operations.",
    features: ["Internal tool", "2-member team", "React.js front end", "Supports internal user operations"],
    tech: [{ name: "React.js", logo: "react" }],
    github: null,
    impact: "Built in a 2-member team",
    ui: "wellness",
  },
  {
    id: "gaming",
    index: "04",
    title: "Online Gaming Platform",
    kicker: "Atmegame · 2023 – 25",
    description:
      "Built and integrated RESTful APIs using Node.js and Express.js to manage user data, game logic, and leaderboards for a platform serving millions of users.",
    features: [
      "User data, game logic, leaderboards",
      "Mongoose models for scores & analytics",
      "Responsive dynamic React components",
      "Cross-device & cross-browser checks",
    ],
    tech: [
      { name: "MongoDB", logo: "mongodb" },
      { name: "Express.js", logo: "express" },
      { name: "React.js", logo: "react" },
      { name: "Node.js", logo: "nodejs" },
      { name: "Postman", logo: "postman" },
      { name: "GitHub", logo: "github" },
    ],
    github: null,
    impact: "Serving millions of users",
    ui: "gaming",
  },
  {
    id: "admin",
    index: "05",
    title: "Admin Dashboard",
    kicker: "Infosys · 2021 – 22",
    description:
      "Created an Admin Dashboard for managing users, content analytics, and system configurations with granular role-based permissions.",
    features: [
      "Role-based access control",
      "JWT auth & session management",
      "CRUD APIs",
      "Unit & API testing with Postman",
    ],
    tech: [
      { name: "React.js", logo: "react" },
      { name: "Redux", logo: "redux" },
      { name: "Tailwind CSS", logo: "tailwindcss" },
      { name: "Bootstrap", logo: "bootstrap" },
      { name: "Node.js", logo: "nodejs" },
      { name: "Express.js", logo: "express" },
      { name: "JWT", logo: "jwt" },
    ],
    github: null,
    impact: "Granular role-based permissions",
    ui: "admin",
  },
];

/* ---------------------------------------------------------- certifications */
export const CERTIFICATIONS: { title: string; issuer: string; date?: string; logo?: string; featured?: boolean }[] = [
  { title: "MongoDB Certified Associate Developer", issuer: "MongoDB", date: "11/2025", logo: "mongodb", featured: true },
  { title: "Official Training for MongoDB Associate Developer Exam", issuer: "MongoDB office", logo: "mongodb" },
  { title: "NPTEL certification in Database Management System", issuer: "IIT Kharagpur", date: "04/2019" },
  { title: "Microsoft Technology Associate (HTML, CS)", issuer: "Microsoft", date: "04/2019" },
];

/* ------------------------------------------------------------ achievements */
export type Achievement = {
  label: string;
  value: number;
  decimals: number;
  suffix?: string;
  caption: string;
  detail: string;
  /** brand logo key, or concept icon key */
  logo: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    label: "Experience",
    value: 5.1,
    decimals: 1,
    suffix: "+ yrs",
    caption: "Building web applications since 09/2021",
    detail: "React.js · Node.js · Express.js · MongoDB",
    logo: "briefcase",
  },
  {
    label: "MongoDB Certified Associate Developer",
    value: 2025,
    decimals: 0,
    caption: "Certified by MongoDB, 11/2025",
    detail: "After official exam training in the MongoDB office",
    logo: "mongodb",
  },
  {
    label: "Research publications",
    value: 2,
    decimals: 0,
    caption: "International Research Journal of Modernization in Engineering Technology and Science (2021)",
    detail: "International Research Journal of Multidisciplinary Studies (2020)",
    logo: "paper",
  },
  {
    label: "Certifications",
    value: 4,
    decimals: 0,
    caption: "MongoDB, NPTEL (IIT Kharagpur) & Microsoft",
    detail: "Database Management System · MTA (HTML, CS)",
    logo: "badge",
  },
  {
    label: "MBA (Finance)",
    value: 8.2,
    decimals: 1,
    suffix: "GPA",
    caption: "Chandigarh University",
    detail: "2022 – 2024 · Online Learning",
    logo: "cap",
  },
];

export const PUBLICATIONS = [
  "Published a research paper in (IRJMETS) International Research Journal of Modernization in Engineering Technology and Science – e-ISSN: 2582-5208 (2021)",
  "Published a paper numbered e-ISSN: 2582-5208 (2020) in International Research Journal of Multidisciplinary Studies (IRJMS)",
];

/* --------------------------------------------------------------- timeline */
export type TimelineStop = {
  year: string;
  title: string;
  place: string;
  detail: string;
  kind: "education" | "work";
  points?: string[];
  tech?: { name: string; logo?: string }[];
  logo?: string;
};

/** Education + experience in chronological order (oldest first). */
export const TIMELINE: TimelineStop[] = [
  {
    year: "2017 – 2021",
    title: EDUCATION[1].degree,
    place: `${EDUCATION[1].school}, ${EDUCATION[1].place}`,
    detail: `${EDUCATION[1].mode} · ${EDUCATION[1].score}`,
    kind: "education",
  },
  {
    year: "09/2021 – 12/2022",
    title: EXPERIENCE[3].role,
    place: `${EXPERIENCE[3].company}, ${EXPERIENCE[3].place}`,
    detail: `${EXPERIENCE[3].duration} · ${EXPERIENCE[3].points[0]}`,
    kind: "work",
    points: EXPERIENCE[3].points.slice(1),
    tech: EXPERIENCE[3].tech,
    logo: EXPERIENCE[3].logo,
  },
  {
    year: "2022 – 2024",
    title: EDUCATION[0].degree,
    place: `${EDUCATION[0].school}, ${EDUCATION[0].place}`,
    detail: `${EDUCATION[0].mode} · ${EDUCATION[0].score}`,
    kind: "education",
  },
  {
    year: "01/2023 – 07/2025",
    title: EXPERIENCE[2].role,
    place: `${EXPERIENCE[2].company}, ${EXPERIENCE[2].place}`,
    detail: `${EXPERIENCE[2].duration} · ${EXPERIENCE[2].points[0]}`,
    kind: "work",
    points: EXPERIENCE[2].points.slice(1),
    tech: EXPERIENCE[2].tech,
    logo: EXPERIENCE[2].logo,
  },
  {
    year: "07/2025 – 02/2026",
    title: EXPERIENCE[1].role,
    place: `${EXPERIENCE[1].company}, ${EXPERIENCE[1].place}`,
    detail: `${EXPERIENCE[1].duration} · ${EXPERIENCE[1].points[0]}`,
    kind: "work",
    points: EXPERIENCE[1].points.slice(1),
    tech: EXPERIENCE[1].tech,
    logo: EXPERIENCE[1].logo,
  },
  {
    year: "05/2026 – Present",
    title: EXPERIENCE[0].role,
    place: `${EXPERIENCE[0].company}, ${EXPERIENCE[0].place}`,
    detail: EXPERIENCE[0].points[1],
    kind: "work",
    points: [EXPERIENCE[0].points[0]],
    tech: EXPERIENCE[0].tech,
    logo: EXPERIENCE[0].logo,
  },
];
