export interface Project {
  categoryKey: string; // Translation key for category
  descriptionKeys: ProjectDescriptionKeys;
  imageUrl: string;
  links: ProjectLink[];
  techStack: string[]; // Tech names stay as-is
  titleKey: string; // Translation key for title
}

export interface ProjectDescriptionKeys {
  featureKeys: string[]; // Translation keys for features
  introKey: string; // Translation key for intro
}

export interface ProjectLink {
  isInternal?: boolean;
  labelKey: string; // Translation key for label
  url: string;
}
