import { describe, it, expect, beforeEach } from "vitest";
import { setSearchInput, clearSearchInput } from "@detail/searchContext.js";
import { renderAdjectiveAgreementTable } from "@detail/renderAdjectiveAgreementTable.js";
import testAgreements from "./testAgreements.json";

describe("renderAdjectiveAgreementTable highlighting", () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="inflections-container"></div>';
        clearSearchInput(); // Reset state between tests
    });

    it("highlights singular cell matching search input", () => {
        setSearchInput("pulchrum");


        renderAdjectiveAgreementTable(testAgreements);

        const cells = document.querySelectorAll("td");
        const accusativeSingular = Array.from(cells).find(
            cell => cell.textContent === "pulchrum"
        );

        expect(accusativeSingular.classList.contains("inflection-match-highlight")).toBe(true);

        // Test that all other inflection cells are NOT highlighted
        const otherInflectionCells = Array.from(cells).filter(
            cell => cell.textContent !== "pulchrum" &&
                cell.textContent !== "Nominative" &&
                cell.textContent !== "Accusative"
        );

        otherInflectionCells.forEach(cell => {
            expect(cell.classList.contains("inflection-match-highlight")).toBe(false);
        });

    });

    it("highlights singular cell matching search input", () => {
        setSearchInput("pulchrum");


        renderAdjectiveAgreementTable(testAgreements);

        const cells = document.querySelectorAll("td");
        const accusativeSingular = Array.from(cells).find(
            cell => cell.textContent === "pulchrum"
        );

        expect(accusativeSingular.classList.contains("inflection-match-highlight")).toBe(true);

        // Test that all other inflection cells are NOT highlighted
        const otherInflectionCells = Array.from(cells).filter(
            cell => cell.textContent !== "pulchrum" &&
                cell.textContent !== "Nominative" &&
                cell.textContent !== "Accusative"
        );

        otherInflectionCells.forEach(cell => {
            expect(cell.classList.contains("inflection-match-highlight")).toBe(false);
        });

    });

});