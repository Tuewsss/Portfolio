export interface Technology {
  id: number;
  name: string;
}

export interface ProjectMedia {
  id: number;
  image: string;
  caption: string;
  order: number;
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
  media?: ProjectMedia[];
}

export interface Profile {
  id: number;
  full_name: string;
  role: string;
  headline: string;
  tagline: string;
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

export interface SpotifyTrack {
  name: string;
  artists: string[];
  album_art: string | null;
  url: string | null;
  is_playing: boolean;
  played_at: string | null;
  progress_ms: number | null;
  duration_ms: number | null;
}

export interface GitHubStats {
  total_commits: number;
  total_repos: number;
  total_stars: number;
  estimated_lines: number;
  languages: Record<string, number>;
  updated_at: string | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
