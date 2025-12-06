import { describe, it, expect, beforeEach } from "vitest";
import { setSearchInputContext, clearSearchInput } from "@detail/detail-context.js";
import { renderAdjectiveAgreementTable } from "@detail/render-adjective-agreement-table.js";
import testAgreements from "./testAgreements.json";

describe("renderAdjectiveAgreementTable highlighting", () => {
    beforeEach(() => {
        const container = document.createElement('div');
        container.id = 'inflections-container';
        document.body.replaceChildren(container);
        clearSearchInput(); // Reset state between tests
    });


    it("highlights singular cell matching search input", () => {
        setSearchInputContext("pulchrum");


        renderAdjectiveAgreementTable(testAgreements);

        const cells = document.querySelectorAll("td");
        const accusativeSingular = [...cells].find(
            cell => cell.textContent === "pulchrum"
        );

        expect(accusativeSingular.classList.contains("inflection-match-highlight")).toBe(true);

        // Test that all other inflection cells are NOT highlighted
        const otherInflectionCells = [...cells].filter(
            cell => cell.textContent !== "pulchrum" &&
                cell.textContent !== "Nominative" &&
                cell.textContent !== "Accusative"
        );

        for (const cell of otherInflectionCells) {
            expect(cell.classList.contains("inflection-match-highlight")).toBe(false);
        }

    });

    it("highlights singular cell matching search input", () => {
        setSearchInputContext("pulchrum");


        renderAdjectiveAgreementTable(testAgreements);

        const cells = document.querySelectorAll("td");
        const accusativeSingular = [...cells].find(
            cell => cell.textContent === "pulchrum"
        );

        expect(accusativeSingular.classList.contains("inflection-match-highlight")).toBe(true);

        // Test that all other inflection cells are NOT highlighted
        const otherInflectionCells = [...cells].filter(
            cell => cell.textContent !== "pulchrum" &&
                cell.textContent !== "Nominative" &&
                cell.textContent !== "Accusative"
        );

        for (const cell of otherInflectionCells) {
            expect(cell.classList.contains("inflection-match-highlight")).toBe(false);
        }

    });

});