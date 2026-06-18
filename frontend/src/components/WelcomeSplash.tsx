"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AuroraBackground } from "./AuroraBackground";
import { GlassCard } from "./GlassCard";
import { useLanguage } from "./LanguageProvider";
import { ScrambleText } from "./ScrambleText";
import { useVisitor } from "./VisitorProvider";
import {
  MAX_VISITOR_NAME_LENGTH,
  getStoredVisitorName,
  hasSeenWelcome,
  markWelcomeSeen,
  sanitizeVisitorName,
  storeVisitorName,
} from "@/lib/visitor";

type Phase = "checking" | "intro" | "name-input" | "greeting" | "leaving" | "done";

export function WelcomeSplash() {
  const { t } = useLanguage();
  const visitor = useVisitor();
  const [phase, setPhase] = useState<Phase>("checking");
  const [name, setName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [trigger, setTrigger] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reads browser-only storage (unavailable during SSR) to decide the initial
  // phase. Must run as a post-hydration effect, not a lazy useState initializer,
  // or the client's first render would mismatch the server-rendered (empty) HTML.
  /* eslint-disable react-hooks/set-state-in-effect */
  useLayoutEffect(() => {
    if (hasSeenWelcome()) {
      setPhase("done");
      return;
    }

    document.body.style.overflow = "hidden";

    const savedName = getStoredVisitorName();
    if (savedName) {
      setName(savedName);
      setPhase("greeting");
    } else {
      setPhase("intro");
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (phase === "name-input") inputRef.current?.focus();
  }, [phase]);

  function leave() {
    setPhase("leaving");
    markWelcomeSeen();
    window.setTimeout(() => {
      document.body.style.overflow = "";
      setPhase("done");
    }, 600);
  }

  function handleScrambleComplete() {
    if (phase === "intro") {
      setPhase("name-input");
    } else if (phase === "greeting") {
      window.setTimeout(leave, 1100);
    }
  }

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    storeVisitorName(trimmed);
    visitor.setName(trimmed);
    setName(trimmed);
    setTrigger((t) => t + 1);
    setPhase("greeting");
  }

  if (phase === "checking" || phase === "done") return null;

  const heading = phase === "intro" || phase === "name-input" ? t.welcome.greeting : `${t.welcome.greeting}, ${name}`;

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[var(--bg)] px-6 transition-opacity duration-500 ${
        phase === "leaving" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <AuroraBackground />

      <GlassCard className="relative z-[1] flex flex-col items-center px-10 py-14 sm:px-16 sm:py-16">
        <h1
          onMouseEnter={() => setTrigger((t) => t + 1)}
          className="cursor-default select-none text-center font-mono text-4xl font-medium tracking-tight sm:text-6xl"
          style={{ color: "var(--ink)" }}
        >
          <ScrambleText text={heading} trigger={trigger} onComplete={handleScrambleComplete} />
          <span
            className="ml-2 inline-block h-[0.85em] w-[2px] animate-pulse align-middle"
            style={{ background: "var(--accent)" }}
          />
        </h1>

        {phase === "name-input" && (
          <form
            onSubmit={handleNameSubmit}
            className="mt-10 flex flex-col items-center gap-3"
            style={{ animation: "fadeIn .4s ease" }}
          >
            <label htmlFor="visitor-name" className="font-mono text-sm tracking-wide" style={{ color: "var(--ink-2)" }}>
              {t.welcome.namePrompt}
            </label>
            <input
              ref={inputRef}
              id="visitor-name"
              value={nameInput}
              onChange={(e) => setNameInput(sanitizeVisitorName(e.target.value))}
              placeholder={t.welcome.namePlaceholder}
              autoComplete="off"
              maxLength={MAX_VISITOR_NAME_LENGTH}
              className="w-64 border-0 border-b border-[var(--line)] bg-transparent py-1 text-center font-mono text-lg outline-none transition-colors placeholder:text-[var(--ink-3)] focus:border-[var(--accent)]"
              style={{ color: "var(--ink)" }}
            />
            <span className="font-mono text-xs" style={{ color: "var(--ink-3)" }}>
              {t.welcome.pressEnter}
            </span>
          </form>
        )}
      </GlassCard>
    </div>
  );
}
