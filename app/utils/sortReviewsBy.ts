export type Review = {
  rating: number;
  timestamp: number; // in milliseconds
};

export function sortReviewsBy(reviews: Review[], criteria: "Newest" | "Oldest" | "Rating"): Review[] {
  if (criteria === "Newest") {
    return [...reviews].sort((a, b) => b.timestamp - a.timestamp);
  } else if (criteria === "Oldest") {
    return [...reviews].sort((a, b) => a.timestamp - b.timestamp);
  } else if (criteria === "Rating") {
    return [...reviews].sort((a, b) => b.rating - a.rating);
  }
  return reviews;
}
