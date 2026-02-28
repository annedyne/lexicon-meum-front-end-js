import {describe, it, expect, beforeEach, vi} from "vitest";
import {renderAdjectiveDegreeTables} from "@detail/render-adjective-degree-tables.js";
import {ADJECTIVE_DEGREES, CSS_CLASSES} from "@utilities/constants.js";
import testAgreements from "./testAgreements.json";

// Mock the renderAdjectiveAgreementTable function
vi.mock("@detail/render-adjective-agreement-table.js", () => ({
    renderAdjectiveAgreementTable: vi.fn()
}));

import {renderAdjectiveAgreementTable} from "@detail/render-adjective-agreement-table.js";

describe("renderAdjectiveDegreeTables", () => {
    beforeEach(() => {
        // Set up DOM container
        const container = document.createElement("div");
        container.id = "inflections-container";
        document.body.replaceChildren(container);

        // Clear mock calls
        vi.clearAllMocks();
    });

    it("should clear the container before rendering", () => {
        const container = document.querySelector("#inflections-container");
        container.innerHTML = "<div>existing content</div>";

        const degreeAgreements = {
            positive: testAgreements,
            comparative: [],
            superlative: []
        };

        // Sanity check - verify content exists before clearing
        const existingDiv = container.querySelector("div");
        expect(existingDiv).not.toBeNull();
        expect(existingDiv.textContent).toBe("existing content");

        // function should clear old children and add new stuff
        renderAdjectiveDegreeTables(degreeAgreements);

        // Verify content was cleared
        const divAfterClearing = container.querySelector("div");
        if (divAfterClearing) {
            expect(divAfterClearing.textContent).not.toBe("existing content");
        } else {
            // Or if the div itself was removed, that's also valid clearing behavior
            expect(divAfterClearing).toBeNull();
        }

    });

    it("should render positive degree when agreements exist", () => {
        const degreeAgreements = {
            positive: testAgreements,
            comparative: [],
            superlative: []
        };

        renderAdjectiveDegreeTables(degreeAgreements);

        const container = document.querySelector("#inflections-container");
        const header = container.querySelector("h3");

        expect(header).not.toBeNull();
        expect(header.textContent).toBe(ADJECTIVE_DEGREES.POSITIVE);
        expect(header.classList.contains(CSS_CLASSES.DEGREE_HEADER)).toBe(true);
        expect(renderAdjectiveAgreementTable).toHaveBeenCalledWith(testAgreements, false);
    });

    it("should render comparative degree when agreements exist", () => {
        const degreeAgreements = {
            positive: [],
            comparative: testAgreements,
            superlative: []
        };

        renderAdjectiveDegreeTables(degreeAgreements);

        const container = document.querySelector("#inflections-container");
        const header = container.querySelector("h3");

        expect(header).not.toBeNull();
        expect(header.textContent).toBe(ADJECTIVE_DEGREES.COMPARATIVE);
        expect(header.classList.contains(CSS_CLASSES.DEGREE_HEADER)).toBe(true);
        expect(renderAdjectiveAgreementTable).toHaveBeenCalledWith(testAgreements, false);
    });

    it("should render superlative degree when agreements exist", () => {
        const degreeAgreements = {
            positive: [],
            comparative: [],
            superlative: testAgreements
        };

        renderAdjectiveDegreeTables(degreeAgreements);

        const container = document.querySelector("#inflections-container");
        const header = container.querySelector("h3");

        expect(header).not.toBeNull();
        expect(header.textContent).toBe(ADJECTIVE_DEGREES.SUPERLATIVE);
        expect(header.classList.contains(CSS_CLASSES.DEGREE_HEADER)).toBe(true);
        expect(renderAdjectiveAgreementTable).toHaveBeenCalledWith(testAgreements, false);
    });

    it("should render all three degrees when all have agreements", () => {
        const degreeAgreements = {
            positive: testAgreements,
            comparative: testAgreements,
            superlative: testAgreements
        };

        renderAdjectiveDegreeTables(degreeAgreements);

        const container = document.querySelector("#inflections-container");
        const headers = container.querySelectorAll("h3");

        expect(headers.length).toBe(3);
        expect(headers[0].textContent).toBe(ADJECTIVE_DEGREES.POSITIVE);
        expect(headers[1].textContent).toBe(ADJECTIVE_DEGREES.COMPARATIVE);
        expect(headers[2].textContent).toBe(ADJECTIVE_DEGREES.SUPERLATIVE);

        // Should be called three times with the same agreements
        expect(renderAdjectiveAgreementTable).toHaveBeenCalledTimes(3);
        expect(renderAdjectiveAgreementTable).toHaveBeenNthCalledWith(1, testAgreements, false);
        expect(renderAdjectiveAgreementTable).toHaveBeenNthCalledWith(2, testAgreements, false);
        expect(renderAdjectiveAgreementTable).toHaveBeenNthCalledWith(3, testAgreements, false);

        // All headers should have the correct CSS class
        for (const header of headers) {
            expect(header.classList.contains(CSS_CLASSES.DEGREE_HEADER)).toBe(true);
        }
    });

    it("should not render degrees with empty agreements", () => {
        const degreeAgreements = {
            positive: [],
            comparative: testAgreements,
            superlative: []
        };

        renderAdjectiveDegreeTables(degreeAgreements);

        const container = document.querySelector("#inflections-container");
        const headers = container.querySelectorAll("h3");

        // Only comparative should be rendered
        expect(headers.length).toBe(1);
        expect(headers[0].textContent).toBe(ADJECTIVE_DEGREES.COMPARATIVE);
        expect(renderAdjectiveAgreementTable).toHaveBeenCalledTimes(1);
        expect(renderAdjectiveAgreementTable).toHaveBeenCalledWith(testAgreements, false);
    });

    it("should handle all empty degrees gracefully", () => {
        const degreeAgreements = {
            positive: [],
            comparative: [],
            superlative: []
        };

        renderAdjectiveDegreeTables(degreeAgreements);

        const container = document.querySelector("#inflections-container");
        const headers = container.querySelectorAll("h3");

        expect(headers.length).toBe(0);
        expect(renderAdjectiveAgreementTable).not.toHaveBeenCalled();
        expect(container.children.length).toBe(0);
    });

    it("should maintain correct order of degrees", () => {
        const positiveData = [{test: "positive"}];
        const comparativeData = [{test: "comparative"}];
        const superlativeData = [{test: "superlative"}];

        const degreeAgreements = {
            positive: positiveData,
            comparative: comparativeData,
            superlative: superlativeData
        };

        renderAdjectiveDegreeTables(degreeAgreements);

        const container = document.querySelector("#inflections-container");
        const headers = container.querySelectorAll("h3");

        expect(headers[0].textContent).toBe(ADJECTIVE_DEGREES.POSITIVE);
        expect(headers[1].textContent).toBe(ADJECTIVE_DEGREES.COMPARATIVE);
        expect(headers[2].textContent).toBe(ADJECTIVE_DEGREES.SUPERLATIVE);

        // Verify the calls were made in the correct order with correct data
        expect(renderAdjectiveAgreementTable).toHaveBeenNthCalledWith(1, positiveData, false);
        expect(renderAdjectiveAgreementTable).toHaveBeenNthCalledWith(2, comparativeData, false);
        expect(renderAdjectiveAgreementTable).toHaveBeenNthCalledWith(3, superlativeData, false);
    });

    it("should handle missing container gracefully", () => {
        // Remove the container
        document.body.replaceChildren();

        const degreeAgreements = {
            positive: testAgreements,
            comparative: [],
            superlative: []
        };

        // Should throw an error when trying to access querySelector result
        expect(() => {
            renderAdjectiveDegreeTables(degreeAgreements);
        }).toThrow();
    });

    it("should create header elements with correct structure", () => {
        const degreeAgreements = {
            positive: testAgreements,
            comparative: [],
            superlative: []
        };

        renderAdjectiveDegreeTables(degreeAgreements);

        const container = document.querySelector("#inflections-container");
        const header = container.querySelector("h3");

        expect(header.tagName.toLowerCase()).toBe("h3");
        expect(header.textContent).toBe(ADJECTIVE_DEGREES.POSITIVE);
        expect(header.classList.contains(CSS_CLASSES.DEGREE_HEADER)).toBe(true);
        expect(header.classList.length).toBe(1); // Should only have the one expected class
    });
});