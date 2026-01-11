/**
 * Returns the appropriate Tailwind grid classes based on the number of items.
 * - 1-3 items: 3 columns on medium screens
 * - 4 items: 2 columns on medium screens
 * - 5+ items: 2 columns on medium, 3 columns on large screens
 */
export const getAchievementGridClass = (count: number): string => {
  if (count <= 3) return "grid-cols-1 md:grid-cols-3";
  if (count === 4) return "grid-cols-1 md:grid-cols-2";
  return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
};
