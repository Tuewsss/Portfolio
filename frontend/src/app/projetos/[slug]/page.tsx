import { notFound } from "next/navigation";
import { AuroraBackground } from "@/components/AuroraBackground";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/nav/Navbar";
import { ProjectDetail } from "@/components/project/ProjectDetail";
import { getProfile, getProject } from "@/lib/api";
import type { Profile } from "@/types/portfolio";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  const [profile, project] = await Promise.all([
    getProfile()
      .then((res) => res.results[0] as Profile | undefined)
      .catch(() => undefined),
    getProject(slug).catch(() => null),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="relative flex-1">
      <AuroraBackground />
      <Navbar profile={profile ?? null} />
      <ProjectDetail project={project} />
      <Footer profile={profile ?? null} />
    </div>
  );
}
