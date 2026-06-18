"use client";

import { ContactForm } from "@/components/sections/ContactForm";
import { GlassCard } from "@/components/GlassCard";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import type { Profile } from "@/types/portfolio";

interface ContactProps {
  profile: Profile | null;
}

export function Contact({ profile }: ContactProps) {
  const { t } = useLanguage();
  const email = profile?.email;
  const linkedin = profile?.linkedin_url;

  return (
    <section id="contato" className="relative z-[1] px-6 py-16">
      <div className="mx-auto max-w-[1080px]">
        <Reveal>
          <GlassCard className="px-8 py-16 text-center">
            <h2 className="mb-3.5 font-bold tracking-tight" style={{ fontSize: "clamp(30px, 5vw, 46px)" }}>
              {t.contact.title}
            </h2>
            <p className="mb-8 text-lg" style={{ color: "var(--ink-2)" }}>
              {t.contact.description}
            </p>

            <ContactForm />

            {(email || linkedin) && (
              <div className="mt-10 flex flex-wrap justify-center gap-3 border-t pt-8" style={{ borderColor: "var(--line)" }}>
                {email && (
                  <a href={`mailto:${email}`} className="btn btn-glass">
                    {email}
                  </a>
                )}
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-glass">
                    {t.contact.linkedin}
                  </a>
                )}
              </div>
            )}
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
