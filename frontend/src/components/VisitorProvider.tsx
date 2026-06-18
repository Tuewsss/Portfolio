"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getStoredVisitorName, storeVisitorName } from "@/lib/visitor";

interface VisitorContextValue {
  name: string;
  setName: (name: string) => void;
}

const VisitorContext = createContext<VisitorContextValue | null>(null);

export function VisitorProvider({ children }: { children: ReactNode }) {
  const [name, setNameState] = useState("");

  // Browser storage isn't available during SSR, so the real value is only
  // known after mount. See WelcomeSplash for why this can't be a lazy
  // useState initializer instead (would cause a hydration mismatch).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setNameState(getStoredVisitorName());
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function setName(next: string) {
    storeVisitorName(next);
    setNameState(next);
  }

  return <VisitorContext.Provider value={{ name, setName }}>{children}</VisitorContext.Provider>;
}

export function useVisitor() {
  const ctx = useContext(VisitorContext);
  if (!ctx) throw new Error("useVisitor must be used within a VisitorProvider");
  return ctx;
}
