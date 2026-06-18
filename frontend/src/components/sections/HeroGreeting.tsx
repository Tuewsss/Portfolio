"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { ScrambleText } from "@/components/ScrambleText";
import { useVisitor } from "@/components/providers/VisitorProvider";
import { MAX_VISITOR_NAME_LENGTH, sanitizeVisitorName } from "@/lib/visitor";

export function HeroGreeting() {
  const { t } = useLanguage();
  const visitor = useVisitor();
  const [trigger, setTrigger] = useState(0);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const name = visitor.name || t.heroGreeting.defaultVisitor;

  function startEditing() {
    setDraft(visitor.name);
    setEditing(true);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function commit() {
    const trimmed = draft.trim();
    setEditing(false);
    if (trimmed && trimmed !== visitor.name) {
      visitor.setName(trimmed);
      setTrigger((t) => t + 1);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Escape") {
      setEditing(false);
    }
  }

  return (
    <h1
      className="mx-auto mb-6 max-w-3xl font-semibold leading-[1.05] tracking-tight"
      style={{ fontSize: "clamp(40px, 8vw, 80px)", color: "var(--ink)" }}
    >
      {t.heroGreeting.prefix}
      {editing ? (
        <span className="inline-flex items-baseline font-mono">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(sanitizeVisitorName(e.target.value))}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            maxLength={MAX_VISITOR_NAME_LENGTH}
            autoFocus
            className="fade-pulse m-0 border-0 bg-transparent p-0 font-mono"
            style={{ width: `${Math.max(draft.length, 1)}ch`, outline: "none" }}
          />
          <span className="fade-pulse font-mono">_</span>
        </span>
      ) : (
        <span
          onMouseEnter={() => setTrigger((t) => t + 1)}
          onDoubleClick={startEditing}
          className="cursor-default select-none"
        >
          <ScrambleText text={name} trigger={trigger} />
        </span>
      )}
      {t.heroGreeting.suffix}
    </h1>
  );
}
