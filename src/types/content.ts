export interface SiteNavItem {
  href: string;
  label: string;
}

export interface SiteStat {
  label: string;
  value: number;
  suffix?: string;
}

export interface SiteTechCategory {
  title: string;
  items: string[];
  highlight?: boolean;
}

export interface SiteTrailItem {
  label: string;
  status?: "done" | "current" | "";
}

export interface SiteCertification {
  title: string;
  issuer: string;
  date: string;
  link?: string;
  linkLabel?: string;
}

export interface SiteContent {
  meta: {
    siteTitle: string;
    siteDescription: string;
    projectsPageTitle: string;
    projectsPageDescription: string;
  };
  nav: {
    home: string;
    projects: string;
    tech: string;
    certifications: string;
    contact: string;
    about: string;
  };
  hero: {
    eyebrow: string;
    name: string;
    role: string;
    bio: string;
    primaryCta: string;
    secondaryCta: string;
    badges: string[];
  };
  projectsSection: {
    title: string;
    viewAllLabel: string;
  };
  tech: {
    title: string;
    intro: string;
    stats: SiteStat[];
    categories: SiteTechCategory[];
    trailTitle: string;
    trail: SiteTrailItem[];
  };
  certifications: {
    title: string;
    intro: string;
    items: SiteCertification[];
  };
  contact: {
    title: string;
    emailLabel: string;
    email: string;
    linkedinLabel: string;
    linkedinText: string;
    linkedinUrl: string;
    githubLabel: string;
    githubText: string;
    githubUrl: string;
    whatsappLabel: string;
    whatsappText: string;
    whatsappUrl: string;
  };
  about: {
    title: string;
    paragraphs: string[];
  };
  footer: {
    homeText: string;
    adminLinkLabel: string;
    projectsPageText: string;
  };
  projectsPage: {
    eyebrow: string;
    title: string;
    intro: string;
    empty: string;
    emptyFiltered: string;
    backLabel: string;
    searchLabel: string;
    searchPlaceholder: string;
    filterAllLabel: string;
    filtersLabel: string;
    noResults: string;
    resultsLabel: string;
    viewToggleLabel: string;
    viewGridLabel: string;
    viewShowcaseLabel: string;
    statsTotalLabel: string;
    statsFeaturedLabel: string;
    statsTechLabel: string;
    featuredBadge: string;
  };
}
