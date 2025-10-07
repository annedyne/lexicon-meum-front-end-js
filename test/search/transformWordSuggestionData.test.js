import { describe, it, expect } from "vitest";
import { transformWordSuggestionData } from "@search";

describe("transformWordSuggestionData", () => {
  it("transforms valid word data into display-friendly format", () => {
    const words = [
      { word: "run", lexemeId: 1, partOfSpeech: "VERB" },
      { word: "runner", lexemeId: 2, partOfSpeech: "NOUN" },
    ];

    const result = transformWordSuggestionData(words);

    expect(result).toEqual([
      { word: "run", lexemeId: 1, suggestion: "run (vrb)" },
      { word: "runner", lexemeId: 2, suggestion: "runner (nom)" },
    ]);
  });
  it("transforms an unknown partOfSpeech to a lowercase string ", () => {
    const words = [
      { word: "run", lexemeId: 1, partOfSpeech: "VERB" },
      { word: "runner", lexemeId: 2, partOfSpeech: "random" },
    ];

    const result = transformWordSuggestionData(words);

    expect(result).toEqual([
      { word: "run", lexemeId: 1, suggestion: "run (vrb)" },
      { word: "runner", lexemeId: 2, suggestion: "runner (random)" },
    ]);
  });

  it("filters out word data with empty word field", () => {
    const words = [
      { word: "run", lexemeId: 1, partOfSpeech: "VERB" },
      { word: "", lexemeId: 2, partOfSpeech: "NOUN" },
    ];

    const result = transformWordSuggestionData(words);

    expect(result).toEqual([
      { word: "run", lexemeId: 1, suggestion: "run (vrb)" },
    ]);
  });
  it("filters out word data with empty id field", () => {
    const words = [
      { word: "run", lexemeId: 1, partOfSpeech: "VERB" },
      { word: "runner", lexemeId: "", partOfSpeech: "NOUN" },
    ];

    const result = transformWordSuggestionData(words);

    expect(result).toEqual([
      { word: "run", lexemeId: 1, suggestion: "run (vrb)" },
    ]);
  });
  it("filters out word data with empty suggestion field", () => {
    const words = [
      { word: "run", lexemeId: 1, partOfSpeech: "VERB" },
      { word: "runner", lexemeId: "", partOfSpeech: "" },
    ];

    const result = transformWordSuggestionData(words);

    expect(result).toEqual([
      { word: "run", lexemeId: 1, suggestion: "run (vrb)" },
    ]);
  });
});
