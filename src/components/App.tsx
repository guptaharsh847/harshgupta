import Navigation from "@/components/Navigation";
import Hero from "@/components/hero/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Work from "@/components/sections/Work";
import Certifications from "@/components/sections/Certifications";
import Experience from "@/components/sections/Experience";
import Achievements from "@/components/sections/Achievements";
import Contact from "@/components/sections/Contact";
import RevealObserver from "@/components/ui/RevealObserver";
import { SmoothScroll } from "@/lib/scroll";

/** Hero → About → Skills → Work → Experience → Certifications → Achievements → Contact */
export default function App() {
  return (
    <>
      <a href="#about" className="sr-only-focusable btn btn-primary fixed left-4 top-4 z-[70]">
        Skip to content
      </a>
      <SmoothScroll />
      <RevealObserver />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Work />
        <Experience />
        <Certifications />
        <Achievements />
        <Contact />
      </main>
    </>
  );
}
