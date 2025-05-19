import { isDockAvailable } from "../../utils/isDockAvailable";

describe("isDockAvailable", () => {
  test("returns true when at least one dock is available", () => {
    expect(isDockAvailable(3, 5)).toBe(true);
  });

  test("returns false when zero docks are available", () => {
    expect(isDockAvailable(0, 5)).toBe(false);
  });

  test("returns false when available exceeds total docks", () => {
    expect(isDockAvailable(7, 6)).toBe(false);
  });

  test("returns true when exactly one dock is available", () => {
    expect(isDockAvailable(1, 4)).toBe(true);
  });
});