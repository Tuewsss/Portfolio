export type Language = "pt" | "en" | "es";

export interface Dictionary {
  locale: string;
  nav: {
    projects: string;
    about: string;
    experience: string;
    skills: string;
    panel: string;
    contact: string;
  };
  hero: {
    ctaProjects: string;
    ctaContact: string;
  };
  heroGreeting: {
    defaultVisitor: string;
    prefix: string;
    suffix: string;
  };
  projects: {
    label: string;
    title: string;
    description: string;
    empty: string;
  };
  projectDetail: {
    back: string;
    liveLink: string;
    repoLink: string;
    gallery: string;
  };
  about: {
    label: string;
    title: string;
    description: string;
    emptyBio: string;
    yearsExperience: string;
    projectsDelivered: string;
  };
  experience: {
    label: string;
    title: string;
    description: string;
    current: string;
    workTitle: string;
    educationTitle: string;
  };
  skills: {
    label: string;
    title: string;
  };
  contact: {
    title: string;
    description: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    success: string;
    error: string;
    linkedin: string;
  };
  footer: {
    madeWith: string;
  };
  panel: {
    label: string;
    title: string;
    description: string;
    nowPlayingLive: string;
    nowPlayingIdle: string;
    nowPlayingEmpty: string;
    loading: string;
    localTime: string;
    weatherNow: string;
    weatherLoading: string;
    weatherUnavailable: string;
    weatherMax: string;
    weatherMin: string;
    weatherFallback: string;
    weatherConditions: Record<number, string>;
    github: string;
    githubNoData: string;
    repos: string;
    stars: string;
    commits: string;
    calendar: string;
    contributionOne: string;
    contributionOther: string;
    weekdays: string[];
  };
  welcome: {
    greeting: string;
    namePrompt: string;
    namePlaceholder: string;
    pressEnter: string;
  };
  theme: {
    selectLabel: string;
    white: string;
    dark: string;
    weather: string;
  };
}
