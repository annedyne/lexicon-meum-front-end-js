import { describe, it, expect, beforeEach } from "vitest";
import { setSearchInput, clearSearchInput } from "@detail/searchContext.js";
import { renderDeclensionTable } from "@detail/renderDeclensionTable.js";

describe("renderDeclensionTable highlighting", () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="inflections-container"></div>';
        clearSearchInput(); // Reset state between tests
    });

    it("highlights singular cell matching search input", () => {
        setSearchInput("puellam");

        const declensions = {
            SINGULAR: { NOMINATIVE: "puella", ACCUSATIVE: "puellam" },
            PLURAL: { NOMINATIVE: "puellae", ACCUSATIVE: "puellas" }
        };

        renderDeclensionTable(declensions);

        const cells = document.querySelectorAll("td");
        const accusativeSingular = Array.from(cells).find(
            cell => cell.textContent === "puellam"
        );

        expect(accusativeSingular.classList.contains("inflection-match-highlight")).toBe(true);

        // Test that all other inflection cells are NOT highlighted
        const otherInflectionCells = Array.from(cells).filter(
            cell => cell.textContent !== "puellam" &&
                cell.textContent !== "Nominative" &&
                cell.textContent !== "Accusative"
        );

        otherInflectionCells.forEach(cell => {
            expect(cell.classList.contains("inflection-match-highlight")).toBe(false);
        });

    });

    it("handles macron normalization in highlighting", () => {
        setSearchInput("puella"); // without macron

        const declensions = {
            SINGULAR: { NOMINATIVE: "puēlla" }, // with macron
            PLURAL: { NOMINATIVE: "puellae" }
        };

        renderDeclensionTable(declensions);

        // Should still match due to normalization
        const cell = Array.from(document.querySelectorAll("td")).find(
            cell => cell.textContent === "puēlla"
        );

        expect(cell.classList.contains("inflection-match-highlight")).toBe(true);
    });

});