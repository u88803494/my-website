import { ArticleCard } from "./components/ArticleCard";
import type { PostSummary } from "./types";

interface BlogFeatureProps {
  posts: PostSummary[];
}

export function BlogFeature({ posts }: BlogFeatureProps) {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Blog</h1>
        <p className="text-base-content/70 text-lg">想法、筆記與技術分享。</p>
      </div>

      {/* Articles Grid */}
      {posts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
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
