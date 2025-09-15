import { describe, it, expect } from "vitest";
import { validateQuery } from "@search";

describe("validateQuery", () => {
  it("returns the trimmed query if it meets the minimum length", () => {
    const result = validateQuery(" apple ", 3);
    expect(result).toBe("apple");
  });

  it("returns null for a query shorter than the minimum length", () => {
    const result = validateQuery("ap", 3);
    expect(result).toBeNull();
  });

  it("returns null for a query with only whitespace", () => {
    const result = validateQuery("   ", 3);
    expect(result).toBeNull();
  });
});
