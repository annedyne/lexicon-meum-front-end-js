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

        // Check that the cell contains a mark element with the search-match class
        const markElement = accusativeSingular.querySelector("mark.search-match");
        expect(markElement).not.toBeNull();
        expect(markElement.textContent).toBe("puellam");

        // Test that all other inflection cells do NOT contain mark elements with search-match class
        const otherInflectionCells = [...cells].filter(
            cell => cell.textContent !== "puellam" &&
                cell.textContent !== "Nominative" &&
                cell.textContent !== "Accusative"
        );

        for (const cell of otherInflectionCells) {
            const markElement = cell.querySelector("mark.search-match");
            expect(markElement).toBeNull();
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

        const markElement = cell.querySelector("mark.search-match");
        expect(markElement).not.toBeNull();
        expect(markElement.textContent).toBe("puēlla");
    });

});