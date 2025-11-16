import { describe, it, expect } from "vitest";
import { transformWordSuggestionData } from "@search";

describe("transformWordSuggestionData", () => {
  it("transforms valid word data into display-friendly format", () => {
    const words = [
      { word: "curris", lexemeId: 1, partOfSpeech: "VERB", suggestionParent: "currere" },
      { word: "cursui", lexemeId: 2, partOfSpeech: "NOUN", suggestionParent: "" },
    ];

    const result = transformWordSuggestionData(words);

    expect(result).toEqual([
      { word: "curris", lexemeId: 1, display: "currere (vrb)", suggestionParent: "currere" },
    ]);
  });
  it("transforms an unknown partOfSpeech to a lowercase string ", () => {
    const words = [
      { word: "curris", lexemeId: 1, partOfSpeech: "VERB", suggestionParent: "currere" },
      { word: "cursui", lexemeId: 2, partOfSpeech: "random", suggestionParent: "cursus" },
    ];

    const result = transformWordSuggestionData(words);

    expect(result).toEqual([
      { word: "curris", lexemeId: 1, display: "currere (vrb)", suggestionParent: "currere" },
      { word: "cursui", lexemeId: 2, display: "cursus (random)", suggestionParent: "cursus" },
    ]);
  });

  it("filters out word data with empty word field", () => {
    const words = [
      { word: "curris", lexemeId: 1, partOfSpeech: "VERB", suggestionParent: "currere" },
      { word: "", lexemeId: 2, partOfSpeech: "NOUN", suggestionParent: "cursus" },
    ];

    const result = transformWordSuggestionData(words);

    expect(result).toEqual([
      { word: "curris", lexemeId: 1, display: "currere (vrb)", suggestionParent: "currere" },
    ]);
  });
  it("filters out word data with empty id field", () => {
    const words = [
      { word: "curris", lexemeId: 1, partOfSpeech: "VERB" },
      { word: "cursus", lexemeId: "", partOfSpeech: "NOUN" },
    ];

    const result = transformWordSuggestionData(words);

    expect(result).toEqual([
    ]);
  });
  it("filters out word data with empty suggestion field", () => {
    const words = [
      { word: "curris", lexemeId: 1, partOfSpeech: "VERB" },
      { word: "cursus", lexemeId: "", partOfSpeech: "" },
    ];

    const result = transformWordSuggestionData(words);

    expect(result).toEqual([
    ]);
  });
});
