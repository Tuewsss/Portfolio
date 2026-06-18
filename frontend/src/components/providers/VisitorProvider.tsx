"use client";

import { createContext, useContext, type ReactNode } from "react";
import { getStoredVisitorName, storeVisitorName } from "@/lib/visitor";
import { useStoredState } from "@/lib/useStoredState";

interface VisitorContextValue {
  name: string;
  setName: (name: string) => void;
}

const VisitorContext = createContext<VisitorContextValue | null>(null);

export function VisitorProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useStoredState("", getStoredVisitorName, storeVisitorName);

  return <VisitorContext.Provider value={{ name, setName }}>{children}</VisitorContext.Provider>;
}

export function useVisitor() {
  const ctx = useContext(VisitorContext);
  if (!ctx) throw new Error("useVisitor must be used within a VisitorProvider");
  return ctx;
}
