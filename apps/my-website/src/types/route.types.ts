/**
 * Controls how internal routes cross their rendering boundary.
 * `document` uses native anchors for standalone documents such as
 * global-not-found, where App Router client transitions are unreliable.
 */
export type NavigationMode = "client" | "document";

// 導航路由型別定義
export interface NavRoute {
  href: string;
  label: string;
}
