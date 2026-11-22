import { ArticleCard } from "./components/ArticleCard";
import type { PostSummary } from "./types";

interface BlogFeatureProps {
  posts: PostSummary[];
}

export function BlogFeature({ posts }: BlogFeatureProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-12 px-4 py-12">
      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">部落格</h1>
        <p className="text-base-content/70 text-lg">軟體工程、AI 應用與職涯成長的觀察與紀錄。</p>
      </div>

      {/* Articles: a single-column, text-only editorial list, matching the article
          page's minimal tone */}
      {posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="border-base-200 bg-base-100 rounded-lg border py-12 text-center">
          <p className="text-base-content/60">還沒有文章發佈</p>
        </div>
      )}
    </div>
  );
}
