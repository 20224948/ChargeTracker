export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const total = ratings.reduce((sum, r) => sum + r, 0);
  return parseFloat((total / ratings.length).toFixed(1));
}
