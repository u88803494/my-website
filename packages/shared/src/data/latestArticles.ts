import { type Article } from '../types';
// 載入所有文章
import { articles } from './articleData';

// 最新 3 篇文章
export const latestArticles: Article[] = articles.slice(0, 3);