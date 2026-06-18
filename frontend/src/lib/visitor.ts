const VISITOR_NAME_KEY = "portfolio:visitor_name";
const WELCOME_SHOWN_KEY = "portfolio:welcome_shown";

export const MAX_VISITOR_NAME_LENGTH = 15;

export function sanitizeVisitorName(raw: string): string {
  return raw.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "").slice(0, MAX_VISITOR_NAME_LENGTH);
}

function safeGet(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(storage: Storage, key: string, value: string) {
  try {
    storage.setItem(key, value);
  } catch {
    // localStorage/sessionStorage indisponível (ex: modo privado)
  }
}

export function getStoredVisitorName(): string {
  if (typeof window === "undefined") return "";
  return safeGet(window.localStorage, VISITOR_NAME_KEY) ?? "";
}

export function storeVisitorName(name: string) {
  if (typeof window === "undefined") return;
  safeSet(window.localStorage, VISITOR_NAME_KEY, name);
}

export function hasSeenWelcome(): boolean {
  if (typeof window === "undefined") return false;
  return safeGet(window.sessionStorage, WELCOME_SHOWN_KEY) === "1";
}

export function markWelcomeSeen() {
  if (typeof window === "undefined") return;
  safeSet(window.sessionStorage, WELCOME_SHOWN_KEY, "1");
}
