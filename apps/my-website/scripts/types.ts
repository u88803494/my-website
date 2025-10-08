// 專門為腳本創建的類型定義
export interface Article {
  claps?: number;
  description: string;
  publishedDate: string;
  readTime: string;
  subtitle: string;
  tags: string[];
  thumbnail?: string;
  title: string;
  url: string;
  views?: number;
}
