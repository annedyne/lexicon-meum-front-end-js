
// noinspection XHTMLIncompatabilitiesJS

import { describe, it, expect, beforeEach } from "vitest";
import { renderPrincipalParts } from "@detail/verb/render-principal-parts.js";
import { GRAMMAR_KEYS, GRAMMAR_ABBREV_LABEL } from "@utilities/constants.js";

describe("renderPrincipalParts", () => {
    beforeEach(() => {
        // Create the required DOM element
        const container = document.createElement('div');
        container.id = 'principal-parts-container';
        document.body.replaceChildren(container);
    });

    it("adds deponent subtype label when morphologicalSubtype is 'DEPONENT'", () => {
        const principalParts = ["amo", "amare", "amavi", "amatus"];
        const morphologicalSubtype = GRAMMAR_KEYS.DEPONENT;

        renderPrincipalParts(principalParts, morphologicalSubtype);

        const container = document.querySelector("#principal-parts-container");
        const subtypeSpan = container.querySelector(".principal-parts-subtype");

        expect(subtypeSpan).not.toBeNull();
        expect(subtypeSpan.textContent).toBe(` (${GRAMMAR_ABBREV_LABEL.DEPONENT})`);
        expect(subtypeSpan.textContent).toBe(" (dep)");
    });

    it("does not add deponent subtype label when morphologicalSubtype is undefined", () => {
        const principalParts = ["amo", "amare", "amavi", "amatus"];
        const morphologicalSubtype = undefined;

        renderPrincipalParts(principalParts, morphologicalSubtype);

        const container = document.querySelector("#principal-parts-container");
        const subtypeSpan = container.querySelector(".principal-parts-subtype");

        expect(subtypeSpan).toBeNull();
    });

    it("does not add deponent subtype label when morphologicalSubtype is null", () => {
        const principalParts = ["amo", "amare", "amavi", "amatus"];
        const morphologicalSubtype = undefined;

        renderPrincipalParts(principalParts, morphologicalSubtype);

        const container = document.querySelector("#principal-parts-container");
        const subtypeSpan = container.querySelector(".principal-parts-subtype");

        expect(subtypeSpan).toBeNull();
    });

    it("does not add deponent subtype label when morphologicalSubtype is a different value", () => {
        const principalParts = ["amo", "amare", "amavi", "amatus"];
        const morphologicalSubtype = "SOME_OTHER_SUBTYPE";

        renderPrincipalParts(principalParts, morphologicalSubtype);

        const container = document.querySelector("#principal-parts-container");
        const subtypeSpan = container.querySelector(".principal-parts-subtype");

        expect(subtypeSpan).toBeNull();
    });

    it("renders principal parts correctly with deponent subtype", () => {
        const principalParts = ["sequor", "sequi", "secutus"];
        const morphologicalSubtype = GRAMMAR_KEYS.DEPONENT;

        renderPrincipalParts(principalParts, morphologicalSubtype);

        const container = document.querySelector("#principal-parts-container");
        const principalPartsSpan = container.querySelector(".principal-parts");
        const subtypeSpan = container.querySelector(".principal-parts-subtype");

        expect(principalPartsSpan.textContent).toBe("sequor, sequi, secutus");
        expect(subtypeSpan.textContent).toBe(" (dep)");
        expect(container.children.length).toBe(2);
    });

    it("renders principal parts correctly without subtype", () => {
        const principalParts = ["amo", "amare", "amavi", "amatus"];
        const morphologicalSubtype = undefined;

        renderPrincipalParts(principalParts, morphologicalSubtype);

        const container = document.querySelector("#principal-parts-container");
        const principalPartsSpan = container.querySelector(".principal-parts");

        expect(principalPartsSpan.textContent).toBe("amo, amare, amavi, amatus");
        expect(container.children.length).toBe(1);
    });
});