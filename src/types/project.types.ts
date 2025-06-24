export interface ProjectDescription {
  intro: string;
  features: string[];
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  title: string;
  category: string;
  imageUrl: string;
  description: ProjectDescription;
  techStack: string[];
  links: ProjectLink[];
} 