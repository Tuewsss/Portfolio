import type {
  ContactPayload,
  PaginatedResponse,
  Profile,
  Project,
  Skill,
} from "@/types/portfolio";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export function getProfile() {
  return apiFetch<PaginatedResponse<Profile>>("/profile/");
}

export function getSkills() {
  return apiFetch<PaginatedResponse<Skill>>("/skills/");
}

export function getProjects() {
  return apiFetch<PaginatedResponse<Project>>("/projects/");
}

export function getProject(slug: string) {
  return apiFetch<Project>(`/projects/${slug}/`);
}

export function sendContactMessage(payload: ContactPayload) {
  return apiFetch<ContactPayload & { id: number; created_at: string }>("/contact/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
