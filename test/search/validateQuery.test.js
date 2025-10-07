import { describe, it, expect } from "vitest";
import { validateSearchQueryLength } from "@search";

describe("validateQuery", () => {
  it("returns the trimmed query if it meets the minimum length", () => {
    const result = validateSearchQueryLength(" apple ", 3);
    expect(result).toBe("apple");
  });

  it("returns null for a query shorter than the minimum length", () => {
    const result = validateSearchQueryLength("ap", 3);
    expect(result).toBeNull();
  });

  it("returns null for a query with only whitespace", () => {
    const result = validateSearchQueryLength("   ", 3);
    expect(result).toBeNull();
  });
});
