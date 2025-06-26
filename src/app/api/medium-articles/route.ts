import { NextRequest, NextResponse } from "next/server";

// Medium GraphQL API 端點
const MEDIUM_GRAPHQL_URL = "https://hugh-program-learning-diary-js.medium.com/_/graphql";

// GraphQL Query 模板
const GRAPHQL_QUERY = `query UserProfileQuery($id: ID, $username: ID, $homepagePostsLimit: PaginationLimit, $homepagePostsFrom: String = null) { 
  userResult(id: $id, username: $username) { 
    __typename 
    ... on User { 
      id 
      ...UserProfileScreen_user 
    } 
  } 
} 

fragment UserProfileScreen_user on User { 
  __typename 
  id 
  ...PublisherHomepagePosts_publisher 
} 

fragment PublisherHomepagePosts_publisher on Publisher { 
  homepagePostsConnection(paging: {limit: $homepagePostsLimit, from: $homepagePostsFrom}) { 
    posts { 
      ...StreamPostPreview_post 
    } 
    pagingInfo { 
      next { 
        from 
        limit 
        __typename 
      } 
      __typename 
    } 
    __typename 
  } 
} 

fragment StreamPostPreview_post on Post { 
  id 
  title 
  mediumUrl 
  firstPublishedAt 
  previewImage { 
    id 
    __typename 
  } 
  extendedPreviewContent { 
    subtitle 
    __typename 
  } 
  creator { 
    id 
    name 
    username 
    __typename 
  } 
  collection { 
    id 
    name 
    __typename 
  } 
}`;

export async function GET(request: NextRequest) {
  try {
    // 從查詢參數中獲取 cursor 和 limit
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limitParam = searchParams.get("limit");

    // 解析 limit 參數，預設為 8，最大為 20
    const limit = Math.min(Math.max(parseInt(limitParam || "8", 10), 1), 20);

    // 構建 GraphQL payload
    const payload = [
      {
        operationName: "UserProfileQuery",
        query: GRAPHQL_QUERY,
        variables: {
          homepagePostsFrom: cursor || null, // 如果沒有 cursor 則為 null
          homepagePostsLimit: limit,
          id: "cd53d8c994f6",
        },
      },
    ];

    // 發送 POST 請求到 Medium GraphQL API
    const response = await fetch(MEDIUM_GRAPHQL_URL, {
      body: JSON.stringify(payload),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Medium API responded with status: ${response.status}`);
    }

    // 解析 JSON 回應
    const data = await response.json();

    // 提取文章列表和下一個 cursor
    const posts = data[0]?.data?.userResult?.homepagePostsConnection?.posts || [];
    const nextCursor = data[0]?.data?.userResult?.homepagePostsConnection?.pagingInfo?.next?.from || null;

    // 回傳結果給前端
    return NextResponse.json({
      nextCursor,
      posts,
    });
  } catch (error) {
    console.error("Error fetching Medium articles:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch Medium articles",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
