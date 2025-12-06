import { describe, it, expect, beforeEach } from "vitest";
import { setSearchInputContext, clearSearchInput } from "@detail/detail-context.js";
import { renderDeclensionTable } from "@detail/render-declension-table.js";

describe("renderDeclensionTable highlighting", () => {
    beforeEach(() => {
        const container = document.createElement('div');
        container.id = 'inflections-container';
        document.body.replaceChildren(container);
        clearSearchInput(); // Reset state between tests
    });

    it("highlights singular cell matching search input", () => {
        setSearchInputContext("puellam");

        const declensions = {
            SINGULAR: { NOMINATIVE: "puella", ACCUSATIVE: "puellam" },
            PLURAL: { NOMINATIVE: "puellae", ACCUSATIVE: "puellas" }
        };

        renderDeclensionTable(declensions);

        const cells = document.querySelectorAll("td");
        const accusativeSingular = [...cells].find(
            cell => cell.textContent === "puellam"
        );

        expect(accusativeSingular.classList.contains("inflection-match-highlight")).toBe(true);

        // Test that all other inflection cells are NOT highlighted
        const otherInflectionCells = [...cells].filter(
            cell => cell.textContent !== "puellam" &&
                cell.textContent !== "Nominative" &&
                cell.textContent !== "Accusative"
        );

        for (const cell of otherInflectionCells) {
            expect(cell.classList.contains("inflection-match-highlight")).toBe(false);
        }

    });

    it("handles macron normalization in highlighting", () => {
        setSearchInputContext("puella"); // without macron

        const declensions = {
            SINGULAR: { NOMINATIVE: "puēlla" }, // with macron
            PLURAL: { NOMINATIVE: "puellae" }
        };

        renderDeclensionTable(declensions);

        // Should still match due to normalization
        const cell = [...document.querySelectorAll("td")].find(
            cell => cell.textContent === "puēlla"
        );

        expect(cell.classList.contains("inflection-match-highlight")).toBe(true);
    });

});