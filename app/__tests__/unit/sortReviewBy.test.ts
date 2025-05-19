import { sortReviewsBy, Review } from "../../utils/sortReviewsBy";

// === Unit Tests for sortReviewsBy ===
describe("sortReviewsBy", () => {
  const reviews: Review[] = [
    { rating: 3, timestamp: 1000 },
    { rating: 5, timestamp: 3000 },
    { rating: 4, timestamp: 2000 },
  ];

  test("sorts by Newest", () => {
    const sorted = sortReviewsBy(reviews, "Newest");
    expect(sorted.map(r => r.timestamp)).toEqual([3000, 2000, 1000]);
  });

  test("sorts by Oldest", () => {
    const sorted = sortReviewsBy(reviews, "Oldest");
    expect(sorted.map(r => r.timestamp)).toEqual([1000, 2000, 3000]);
  });

  test("sorts by Rating", () => {
    const sorted = sortReviewsBy(reviews, "Rating");
    expect(sorted.map(r => r.rating)).toEqual([5, 4, 3]);
  });
});