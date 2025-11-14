import { describe, it, expect } from "vitest";
import { prepareSuggestionItems } from "@search";
import testSuggestionItems from "./testSuggestionItems.json";

describe("prepareSuggestionItems", () => {
  it("deduplicates by lexemeId but keeps exact match to searchInput", () => {
    const searchInput = "feci";
    const result = prepareSuggestionItems(testSuggestionItems, searchInput);

    // Should have only 2 items: one for each unique lexemeId
    expect(result).toHaveLength(2);

    // Both "feci" entries should be present (one for each lexeme)
    const suggestions = result.map(item => item.suggestion);
    expect(suggestions).toContain("facere (vrb)");
    expect(suggestions).toContain("fēx (nom)");

    // Verify the word is "feci" for both
    expect(result[0].word).toBe("feci");
    expect(result[1].word).toBe("feci");
  });

  it("marks exact matches for highlighting", () => {
    const searchInput = "feci";
    const result = prepareSuggestionItems(testSuggestionItems, searchInput);

    // Both items should be highlighted (exact word match)
    expect(result[0].highlight).toBe(true);
    expect(result[1].highlight).toBe(true);
  });

  it("sets showInflection to true when word matches but suggestionParent does not", () => {
    const searchInput = "feci";
    const result = prepareSuggestionItems(testSuggestionItems, searchInput);

    // Both should have showInflection true since "feci" !== "facere" or "fēx"
    expect(result[0].showInflection).toBe(true);
    expect(result[1].showInflection).toBe(true);
  });

  it("sorts results alphabetically by suggestion", () => {
    const searchInput = "feci";
    const result = prepareSuggestionItems(testSuggestionItems, searchInput);

    // "facere (vrb)" should come before "fēx (nom)" alphabetically
    expect(result[0].suggestion).toBe("facere (vrb)");
    expect(result[1].suggestion).toBe("fēx (nom)");
  });

  it("deduplicates when search does not match, keeping only first occurrence", () => {
    const searchInput = "xyz";
    const result = prepareSuggestionItems(testSuggestionItems, searchInput);

    // Should have only 2 items (one per unique lexemeId)
    expect(result).toHaveLength(2);

    // Should keep the first occurrence of each lexemeId
    expect(result[0].word).toBe("feci");
    expect(result[0].suggestion).toBe("facere (vrb)");
    expect(result[1].word).toBe("feci");
    expect(result[1].suggestion).toBe("fēx (nom)");
  });

  it("does not highlight when search input does not match", () => {
    const searchInput = "xyz";
    const result = prepareSuggestionItems(testSuggestionItems, searchInput);

    // No highlights since nothing matches
    expect(result[0].highlight).toBe(false);
    expect(result[1].highlight).toBe(false);
    expect(result[0].showInflection).toBe(false);
    expect(result[1].showInflection).toBe(false);
  });

  it("highlights when searchInput matches suggestionParent", () => {
    const searchInput = "facere";
    const result = prepareSuggestionItems(testSuggestionItems, searchInput);

    const facereItem = result.find(item => item.suggestionParent === "facere");
    expect(facereItem).toBeDefined();
    expect(facereItem.highlight).toBe(true);
    expect(facereItem.showInflection).toBe(false); // suggestionParent matches, so no inflection prefix
  });

  it("is case-insensitive when matching", () => {
    const searchInput = "FECI";
    const result = prepareSuggestionItems(testSuggestionItems, searchInput);

    // Should still match and highlight despite case difference
    expect(result[0].highlight).toBe(true);
    expect(result[1].highlight).toBe(true);
  });
});