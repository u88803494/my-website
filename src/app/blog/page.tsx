"use client";

import { useCallback,useEffect, useState } from "react";

interface ApiResponse {
  error?: string;
  message?: string;
  nextCursor: null | string;
  posts: MediumPost[];
}

interface MediumPost {
  collection?: {
    name: string;
  };
  creator: {
    name: string;
    username: string;
  };
  extendedPreviewContent?: {
    subtitle: string;
  };
  firstPublishedAt: number;
  id: string;
  mediumUrl: string;
  title: string;
}

const BlogPage = () => {
  const [posts, setPosts] = useState<MediumPost[]>([]);
  const [nextCursor, setNextCursor] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchMediumArticles = useCallback(
    async (cursor?: string) => {
      if (loading) return; // 防止重複請求

      setLoading(true);
      setError(null);

      try {
        const url = cursor ? `/api/medium-articles?cursor=${encodeURIComponent(cursor)}` : "/api/medium-articles";

        const response = await fetch(url);
        const data: ApiResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "API 請求失敗");
        }

        // 累積文章而不是替換
        setPosts((prevPosts) => (cursor ? [...prevPosts, ...data.posts] : data.posts));
        setNextCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
      } catch (err) {
        setError(err instanceof Error ? err.message : "未知錯誤");
        setHasMore(false);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    },
    [loading],
  );

  // 滾動偵測函數
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    // 當滾動到底部前 100px 時開始載入
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      if (nextCursor) {
        fetchMediumArticles(nextCursor);
      }
    }
  }, [loading, hasMore, nextCursor, fetchMediumArticles]);

  // 初始載入
  useEffect(() => {
    fetchMediumArticles();
  }, [fetchMediumArticles]);

  // 設置滾動監聽
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">部落格 Blog - Medium 文章</h1>

      {error && (
        <div className="mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          <strong>錯誤：</strong> {error}
          <button className="ml-4 text-sm underline hover:no-underline" onClick={() => fetchMediumArticles()}>
            重新載入
          </button>
        </div>
      )}

      {initialLoad && loading ? (
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500" />
          <p className="mt-2 text-gray-600">載入文章中...</p>
        </div>
      ) : (
        <>
          <div className="mb-6 text-sm text-gray-600">
            已載入 {posts.length} 篇文章
            {hasMore && " • 向下滾動載入更多"}
            {!hasMore && posts.length > 0 && " • 已載入所有文章"}
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <article className="rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md" key={post.id}>
                <div className="mb-3 flex items-start justify-between">
                  <h2 className="text-xl leading-tight font-semibold text-gray-800">{post.title}</h2>
                  <time className="ml-4 flex-shrink-0 text-sm text-gray-500">
                    {new Date(post.firstPublishedAt).toLocaleDateString("zh-TW", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>

                {post.extendedPreviewContent?.subtitle && (
                  <p className="mb-4 leading-relaxed text-gray-600">{post.extendedPreviewContent.subtitle}</p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div>
                    <span>作者：{post.creator.name}</span>
                    {post.collection && <span className="ml-4">專欄：{post.collection.name}</span>}
                  </div>

                  <a
                    className="font-medium text-blue-500 hover:text-blue-700"
                    href={post.mediumUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    在 Medium 上閱讀 →
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* 載入更多指示器 */}
          {loading && !initialLoad && (
            <div className="py-8 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-b-2 border-blue-500" />
              <p className="mt-2 text-gray-600">載入更多文章中...</p>
            </div>
          )}

          {/* 結束指示器 */}
          {!hasMore && posts.length > 0 && (
            <div className="py-8 text-center text-gray-500">
              <div className="border-t border-gray-200 pt-8">
                <p>🎉 所有文章已載入完成</p>
                <p className="mt-1 text-sm">總共 {posts.length} 篇文章</p>
              </div>
            </div>
          )}

          {/* 空狀態 */}
          {!loading && posts.length === 0 && !error && (
            <div className="py-12 text-center text-gray-500">
              <p className="text-lg">目前沒有文章</p>
              <p className="mt-1 text-sm">請稍後再試</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogPage;
