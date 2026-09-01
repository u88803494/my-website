export interface PostSummary {
  slug: string;
  title: string;
  description: string;
  date: string;
  updatedDate?: string;
  tags: string[];
  readTime: string;
  thumbnail?: string;
  mediumUrl?: string;
}
