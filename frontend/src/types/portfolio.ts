export interface Technology {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  tag: "featured" | "saas" | "ecommerce" | "other";
  tag_display: string;
  description: string;
  technologies: Technology[];
  image: string | null;
  project_url: string;
  repo_url: string;
  is_featured: boolean;
  order: number;
  created_at: string;
}

export interface Skill {
  id: number;
  name: string;
  order: number;
}

export interface Profile {
  id: number;
  full_name: string;
  role: string;
  bio: string;
  years_experience: number;
  projects_delivered: number;
  recurring_clients: number;
  available_for_work: boolean;
  email: string;
  linkedin_url: string;
  github_url: string;
  avatar: string | null;
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
