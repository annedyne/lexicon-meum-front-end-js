import { describe, it, expect } from "vitest";
import {
    setSelectedSuggestionIndex,
    getSelectedSuggestionIndex,
    resetSelectedSuggestionIndex,
} from "@search/search-context.js";

describe("search suggestion selection state", () => {
    it("defaults to index 0", () => {
        expect(getSelectedSuggestionIndex()).toBe(0);
    });

    it("sets and gets the selected index", () => {
        setSelectedSuggestionIndex(3);
        expect(getSelectedSuggestionIndex()).toBe(3);
    });

    it("resets the selected index back to 0", () => {
        setSelectedSuggestionIndex(3);
        resetSelectedSuggestionIndex();
        expect(getSelectedSuggestionIndex()).toBe(0);
    });
});
