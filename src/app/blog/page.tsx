"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

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

// 獲取文章的函數
const fetchMediumArticles = async ({ pageParam }: { pageParam?: string }): Promise<ApiResponse> => {
  const url = pageParam ? `/api/medium-articles?cursor=${encodeURIComponent(pageParam)}` : "/api/medium-articles";

  const response = await fetch(url);
  const data: ApiResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API 請求失敗");
  }

  return data;
};

const BlogPage = () => {
  // 使用 react-intersection-observer 偵測滾動
  const { inView, ref: loadMoreRef } = useInView({
    rootMargin: "200px", // 提前 200px 觸發
    threshold: 0,
  });

  // 使用 TanStack Query 的 useInfiniteQuery
  const { data, error, fetchNextPage, hasNextPage, isError, isFetchingNextPage, isLoading } = useInfiniteQuery({
    gcTime: 10 * 60 * 1000, // 10 分鐘後清除快取
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    queryFn: fetchMediumArticles,
    queryKey: ["medium-articles"],
    staleTime: 5 * 60 * 1000, // 5 分鐘內認為資料是新的
  });

  // 當滾動到底部時自動載入更多
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log("滾動觸發載入更多");
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 合併所有頁面的文章
  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  // 移除重複文章（額外的安全措施）
  const uniquePosts = allPosts.filter((post, index, array) => array.findIndex((p) => p.id === post.id) === index);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">部落格 Blog - Medium 文章</h1>

      {isError && error && (
        <div className="mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          <strong>錯誤：</strong> {error.message}
          <button className="ml-4 text-sm underline hover:no-underline" onClick={() => window.location.reload()}>
            重新載入
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500" />
          <p className="mt-2 text-gray-600">載入文章中...</p>
        </div>
      ) : (
        <>
          <div className="mb-6 text-sm text-gray-600">
            已載入 {uniquePosts.length} 篇文章
            {hasNextPage && " • 向下滾動載入更多"}
            {!hasNextPage && uniquePosts.length > 0 && " • 已載入所有文章"}
          </div>

          <div className="space-y-6">
            {uniquePosts.map((post) => (
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

          {/* 滾動載入觸發點 */}
          {hasNextPage && (
            <div className="py-8 text-center" ref={loadMoreRef}>
              {isFetchingNextPage ? (
                <>
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-b-2 border-blue-500" />
                  <p className="mt-2 text-gray-600">載入更多文章中...</p>
                </>
              ) : (
                <button
                  className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
                  onClick={() => fetchNextPage()}
                >
                  載入更多文章
                </button>
              )}
            </div>
          )}

          {/* 結束指示器 */}
          {!hasNextPage && uniquePosts.length > 0 && (
            <div className="py-8 text-center text-gray-500">
              <div className="border-t border-gray-200 pt-8">
                <p>🎉 所有文章已載入完成</p>
                <p className="mt-1 text-sm">總共 {uniquePosts.length} 篇文章</p>
              </div>
            </div>
          )}

          {/* 空狀態 */}
          {!isLoading && uniquePosts.length === 0 && !isError && (
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
