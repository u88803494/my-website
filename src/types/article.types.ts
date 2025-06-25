export interface Article {
  title: string;
  subtitle: string;
  publishedDate: string;
  readTime: string;
  url: string;
  tags: string[];
  views?: number;
  claps?: number;
  description: string;
  thumbnail?: string;
}
