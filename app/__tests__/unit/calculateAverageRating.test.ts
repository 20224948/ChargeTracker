import { calculateAverageRating } from "../../utils/calculateAverageRating";

// === Unit Tests for calculateAverageRating ===
describe("calculateAverageRating", () => {
  test("returns 0 for empty array", () => {
    expect(calculateAverageRating([])).toBe(0);
  });

  test("returns correct average for ratings", () => {
    expect(calculateAverageRating([4, 5, 3])).toBe(4.0);
    expect(calculateAverageRating([1, 2, 3, 4, 5])).toBe(3.0);
  });

  test("returns value rounded to 1 decimal", () => {
    expect(calculateAverageRating([4, 4, 5])).toBe(4.3);
  });
});