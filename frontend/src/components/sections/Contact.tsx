"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import type { Profile } from "@/types/portfolio";

interface ContactProps {
  profile: Profile | null;
}

interface SocialLink {
  key: string;
  href: string;
  label: string;
  icon: ReactNode;
  external: boolean;
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4.5 7l7.5 5.5L19.5 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.7 19.7h-3.1v-4.9c0-1.17-.02-2.67-1.63-2.67-1.63 0-1.88 1.27-1.88 2.59v4.98H9.99V9.5h2.98v1.37h.04c.42-.79 1.44-1.62 2.96-1.62 3.17 0 3.76 2.08 3.76 4.79v5.66ZM6.3 8.13a1.81 1.81 0 1 1 0-3.63 1.81 1.81 0 0 1 0 3.63ZM7.85 19.7H4.74V9.5h3.11v10.2Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1.5C6.201 1.5 1.5 6.201 1.5 12c0 4.642 3.01 8.583 7.182 9.978.525.097.717-.228.717-.506 0-.249-.009-.913-.014-1.792-2.922.635-3.539-1.409-3.539-1.409-.477-1.213-1.164-1.538-1.164-1.538-.953-.651.072-.638.072-.638 1.053.074 1.607 1.082 1.607 1.082.936 1.605 2.457 1.142 3.055.874.094-.679.366-1.142.666-1.405-2.331-.265-4.784-1.166-4.784-5.193 0-1.147.41-2.085 1.08-2.82-.108-.265-.469-1.334.103-2.78 0 0 .881-.282 2.888 1.078A10.06 10.06 0 0 1 12 6.844c.892.004 1.79.121 2.629.355 2.005-1.36 2.885-1.078 2.885-1.078.574 1.446.213 2.515.105 2.78.672.735 1.078 1.673 1.078 2.82 0 4.038-2.457 4.926-4.797 5.187.377.325.713.967.713 1.95 0 1.408-.013 2.541-.013 2.886 0 .281.19.609.722.506C19.49 20.58 22.5 16.64 22.5 12c0-5.799-4.701-10.5-10.5-10.5Z" />
    </svg>
  );
}

export function Contact({ profile }: ContactProps) {
  const { t } = useLanguage();
  const email = profile?.email;
  const linkedin = profile?.linkedin_url;
  const github = profile?.github_url;

  const socialLinks: SocialLink[] = [];
  if (email) {
    socialLinks.push({ key: "email", href: `mailto:${email}`, label: "Email", icon: <EmailIcon />, external: false });
  }
  if (linkedin) {
    socialLinks.push({ key: "linkedin", href: linkedin, label: t.contact.linkedin, icon: <LinkedInIcon />, external: true });
  }
  if (github) {
    socialLinks.push({ key: "github", href: github, label: "GitHub", icon: <GitHubIcon />, external: true });
  }

  if (socialLinks.length === 0) return null;

  return (
    <section id="contato" className="relative z-[1] px-6 py-16">
      <div className="mx-auto max-w-[1080px]">
        <Reveal className="flex flex-wrap justify-center gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              aria-label={link.label}
              title={link.label}
              className="flex h-12 w-12 items-center justify-center rounded-full border transition-transform hover:scale-105"
              style={{ background: "var(--glass)", borderColor: "var(--glass-border)", color: "var(--ink-2)" }}
            >
              {link.icon}
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
