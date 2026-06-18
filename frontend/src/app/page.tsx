import { AuroraBackground } from "@/components/AuroraBackground";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Panel } from "@/components/sections/Panel";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { getProfile, getProjects, getSkills } from "@/lib/api";
import type { Profile, Project, Skill } from "@/types/portfolio";

export default async function Home() {
  const [profile, skills, projects] = await Promise.all([
    getProfile()
      .then((res) => res.results[0] as Profile | undefined)
      .catch(() => undefined),
    getSkills()
      .then((res) => res.results)
      .catch(() => [] as Skill[]),
    getProjects()
      .then((res) => res.results)
      .catch(() => [] as Project[]),
  ]);

  return (
    <div id="top" className="relative flex-1">
      <AuroraBackground />
      <Navbar profile={profile ?? null} />
      <Hero profile={profile ?? null} />
      <Projects projects={projects} />
      <About profile={profile ?? null} />
      <Skills skills={skills} />
      <Panel profile={profile ?? null} />
      <Contact profile={profile ?? null} />
      <Footer profile={profile ?? null} />
    </div>
  );
}
