"use client";

import { useState, type FormEvent } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { sendContactMessage } from "@/lib/api";

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "w-full border-0 border-b bg-transparent py-2 text-base outline-none transition-colors placeholder:text-[var(--ink-3)]";

export function ContactForm() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus("sending");
    try {
      await sendContactMessage({ name: name.trim(), email: email.trim(), message: message.trim() });
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-base" style={{ color: "var(--ink-2)" }}>
        {t.contact.success}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-md flex-col gap-5 text-left">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t.contact.namePlaceholder}
        required
        className={inputClass}
        style={{ borderColor: "var(--line)" }}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t.contact.emailPlaceholder}
        required
        className={inputClass}
        style={{ borderColor: "var(--line)" }}
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={t.contact.messagePlaceholder}
        required
        rows={3}
        className={`${inputClass} resize-none`}
        style={{ borderColor: "var(--line)" }}
      />
      <div className="flex flex-col items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? t.contact.sending : t.contact.send}
        </button>
        {status === "error" && (
          <span className="text-sm" style={{ color: "var(--ink-3)" }}>
            {t.contact.error}
          </span>
        )}
      </div>
    </form>
  );
}
