export interface Achievement {
  descriptionKey: string; // Translation key for description (HTML supported)
  titleKey: string; // Translation key for title
}

export interface Experience {
  achievements: Achievement[];
  companyKey: string; // Translation key for company name
  logoUrl: string;
  periodKey: string; // Translation key for period
  roleKey: string; // Translation key for role
  techStackGroups: TechStackGroup[];
}

export interface TechStackGroup {
  items: string[]; // Tech names stay as-is (no translation needed)
  labelKey: string; // Translation key for label
}
