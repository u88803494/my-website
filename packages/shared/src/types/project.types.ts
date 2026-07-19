export interface Project {
  category: string;
  description: ProjectDescription;
  imageUrl: string;
  links: ProjectLink[];
  techStack: string[];
  title: string;
}

export interface ProjectDescription {
  features: string[];
  intro: string;
}

export type ProjectLinkType = "article" | "live" | "source";

export interface ProjectLink {
  label: string;
  type: ProjectLinkType;
  url: string;
}
