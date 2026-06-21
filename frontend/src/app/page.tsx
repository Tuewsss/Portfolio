import { AuroraBackground } from "@/components/AuroraBackground";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/nav/Navbar";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Panel } from "@/components/sections/Panel";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { getExperiences, getProfile, getProjects } from "@/lib/api";
import type { Experience as ExperienceType, Profile, Project } from "@/types/portfolio";

export default async function Home() {
  const [profile, projects, experiences] = await Promise.all([
    getProfile()
      .then((res) => res.results[0] as Profile | undefined)
      .catch(() => undefined),
    getProjects()
      .then((res) => res.results)
      .catch(() => [] as Project[]),
    getExperiences().catch(() => [] as ExperienceType[]),
  ]);

  return (
    <div id="top" className="relative flex-1">
      <AuroraBackground />
      <Navbar profile={profile ?? null} />
      <Hero profile={profile ?? null} />
      <Projects projects={projects} />
      <About profile={profile ?? null} />
      <Experience experiences={experiences} />
      <Skills />
      <Panel profile={profile ?? null} />
      <Contact profile={profile ?? null} />
      <Footer profile={profile ?? null} />
    </div>
  );
}
