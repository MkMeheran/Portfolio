import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";

// static imports
import data from "@/data/content.json";
import theme from "@/data/theme.json";

export default function Home() {
  return (
    <main>
      <Hero identity={data.identity} theme={theme} />
      <Projects projects={data.projects} theme={theme} />
      <Skills skills={data.skills} theme={theme} />
      <Education education={data.education} theme={theme} />
      <Experience experience={data.experience} theme={theme} />
      <Contact contact={data.contact} theme={theme} />
    </main>
  );
}
