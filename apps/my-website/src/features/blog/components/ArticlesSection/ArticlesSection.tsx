"use client";

import { m } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { useMediumArticles } from "../../hooks/useMediumArticles";
import type { MediumPost } from "../../types";
import ArticleCard from "./ArticleCard";
import ArticleStats from "./ArticleStats";
import CompletedState from "./CompletedState";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";
import LoadMoreButton from "./LoadMoreButton";

const ArticlesSection: React.FC = () => {
  // 內部調用資料 hook
  const { data, error, fetchNextPage, hasNextPage, isError, isFetchingNextPage, isLoading } = useMediumArticles({
    limit: 9,
  });

  // 無限滾動偵測
  const { inView, ref: loadMoreRef } = useInView({
    rootMargin: "200px",
    threshold: 0,
  });

  // 當滾動到底部時自動載入更多
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 合併所有頁面的文章，使用更安全的型別處理
  const allPosts: MediumPost[] = data?.pages.flatMap((page) => page.posts) ?? [];

  // 處理重新載入
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <section className="bg-base-200 py-20">
      <div className="container mx-auto px-4">
        {/* 錯誤狀態 */}
        {isError && error && <ErrorState error={error} onRetry={handleRetry} />}

        {/* 載入狀態 */}
        {isLoading && <LoadingState />}

        {/* 文章內容區域 */}
        {!isLoading && (
          <>
            {/* 統計資訊 */}
            {allPosts.length > 0 && <ArticleStats hasNextPage={hasNextPage} totalCount={allPosts.length} />}

            {/* 文章列表 */}
            {allPosts.length > 0 && (
              <m.div
                animate={{ opacity: 1 }}
                className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0 }}
              >
                {allPosts.map((post, index) => (
                  <m.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    key={post.id}
                    transition={{
                      delay: Math.min(index * 0.1, 0.6), // 限制最大延遲
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  >
                    <ArticleCard article={post} />
                  </m.div>
                ))}
              </m.div>
            )}

            {/* 無限滾動載入區域 */}
            {hasNextPage && (
              <m.div animate={{ opacity: 1 }} className="text-center" initial={{ opacity: 0 }} ref={loadMoreRef}>
                <LoadMoreButton isLoading={isFetchingNextPage} onLoadMore={fetchNextPage} />
              </m.div>
            )}

            {/* 完成指示器 */}
            {!hasNextPage && allPosts.length > 0 && <CompletedState totalCount={allPosts.length} />}

            {/* 空狀態 */}
            {allPosts.length === 0 && !isLoading && !isError && <EmptyState />}
          </>
        )}
      </div>
    </section>
  );
};

export default ArticlesSection;
