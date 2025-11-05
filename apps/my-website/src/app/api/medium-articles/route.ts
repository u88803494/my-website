import { createLogger, logError } from "@packages/shared/utils";
import { type NextRequest, NextResponse } from "next/server";

const logger = createLogger({ context: "api/medium-articles" });

// Medium GraphQL API endpoint
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
    // Extract cursor and limit from query parameters
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limitParam = searchParams.get("limit");

    // Parse limit parameter, default 8, max 20
    const limit = Math.min(Math.max(parseInt(limitParam || "8", 10), 1), 20);

    logger.info({ cursor, limit }, "Fetching Medium articles");

    // Build GraphQL payload
    const payload = [
      {
        operationName: "UserProfileQuery",
        query: GRAPHQL_QUERY,
        variables: {
          homepagePostsFrom: cursor || null,
          homepagePostsLimit: limit,
          id: "cd53d8c994f6",
        },
      },
    ];

    // Send POST request to Medium GraphQL API
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

    // Parse JSON response
    const data = await response.json();

    // Extract article list and next cursor
    const posts = data[0]?.data?.userResult?.homepagePostsConnection?.posts || [];
    const nextCursor = data[0]?.data?.userResult?.homepagePostsConnection?.pagingInfo?.next?.from || null;

    logger.info({ postsCount: posts.length, hasNextCursor: !!nextCursor }, "Medium articles fetched successfully");

    // Return result to frontend
    return NextResponse.json({
      nextCursor,
      posts,
    });
  } catch (error) {
    logError("Failed to fetch Medium articles", error, { route: "/api/medium-articles" });

    return NextResponse.json(
      {
        error: "Failed to fetch Medium articles",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
