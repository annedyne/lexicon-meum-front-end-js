/* @vitest-environment jsdom */
import { describe, it, expect, beforeEach, vi } from "vitest";

// Lightweight mocks for the 3 inflection renderers to isolate orchestrator behavior
vi.mock("../../src/detail/renderDeclensionTable.js", () => ({
    renderDeclensionTable: () => {
        const c = document.getElementById("inflections-container");
        if (c) {
            c.replaceChildren();
            const marker = document.createElement("div");
            marker.id = "declension-marker";
            marker.textContent = "DECL";
            c.appendChild(marker);
        }
    },
}));

vi.mock("../../src/detail/renderConjugationTable.js", () => ({
    renderConjugationTable: () => {
        const c = document.getElementById("inflections-container");
        if (c) {
            c.replaceChildren();
            const marker = document.createElement("div");
            marker.id = "conjugation-marker";
            marker.textContent = "CONJ";
            c.appendChild(marker);
        }
    },
}));

vi.mock("../../src/detail/renderAdjectiveAgreementTable.js", () => ({
    renderAdjectiveAgreementTable: () => {
        const c = document.getElementById("inflections-container");
        if (c) {
            c.replaceChildren();
            const marker = document.createElement("div");
            marker.id = "agreement-marker";
            marker.textContent = "AGRM";
            c.appendChild(marker);
        }
    },
}));

// Keep these real to verify their own clearing logic as part of flows
vi.mock("../../src/detail/renderLemmaHeader.js", async (orig) => await orig());
vi.mock("../../src/detail/renderDefinitions.js", async (orig) => await orig());
vi.mock("../../src/detail/renderInflectionType.js", async (orig) => await orig());
vi.mock("../../src/detail/renderPrincipalParts.js", async (orig) => await orig());
vi.mock("../../src/detail/renderPOSAfterLemma.js", async (orig) => await orig());

import { renderWordDetail } from "../../src/detail/renderWordDetail.js";

function setupDom() {
    document.body.innerHTML = `
    <div id="lemma-container"></div>
    <div id="definitions-container"></div>
    <div id="principal-parts-container"></div>
    <div id="inflection-type-container"></div>
    <div id="inflections-container"></div>
  `;
}

describe("renderWordDetail clearing/orchestration behavior (with markers)", () => {
    beforeEach(() => {
        vi.resetModules();
        setupDom();
    });

    it("clears inflections for an adverb, then renders declension only for a noun", () => {
        const adverb = {
            lemma: "bene",
            partOfSpeech: "ADVERB",
            grammaticalGender: null,
            inflectionClass: null,
            principalParts: [],
            definitions: ["well"],
            inflectionTable: { conjugations: [], agreements: [], declensions: {} },
        };
        renderWordDetail(adverb);
        const inflectionsAfterAdverb = document.getElementById("inflections-container");
        expect(inflectionsAfterAdverb.childElementCount).toBe(0);

        const noun = {
            lemma: "puella",
            partOfSpeech: "NOUN",
            grammaticalGender: "FEMININE",
            inflectionClass: "FIRST",
            principalParts: ["puella", "puellae"],
            definitions: ["girl"],
            inflectionTable: {
                conjugations: [{ voice: "ACTIVE" }],
                agreements: [{}],
                declensions: { SINGULAR: { NOMINATIVE: "puella" }, PLURAL: { NOMINATIVE: "puellae" } },
            },
        };
        renderWordDetail(noun);
        const inflectionsAfterNoun = document.getElementById("inflections-container");
        expect(inflectionsAfterNoun.querySelector("#declension-marker")).toBeTruthy();
        expect(inflectionsAfterNoun.querySelector("#conjugation-marker")).toBeFalsy();
        expect(inflectionsAfterNoun.querySelector("#agreement-marker")).toBeFalsy();
    });

    it("switching from noun to verb replaces the previous inflection table content", () => {
        const noun = {
            lemma: "puella",
            partOfSpeech: "NOUN",
            grammaticalGender: "FEMININE",
            inflectionClass: "FIRST",
            principalParts: ["puella", "puellae"],
            definitions: ["girl"],
            inflectionTable: {
                conjugations: [{ voice: "ACTIVE" }],
                agreements: [{}],
                declensions: { SINGULAR: { NOMINATIVE: "puella" }, PLURAL: { NOMINATIVE: "puellae" } },
            },
        };
        renderWordDetail(noun);
        expect(document.querySelector("#declension-marker")).toBeTruthy();

        const verb = {
            lemma: "amo",
            partOfSpeech: "VERB",
            grammaticalGender: null,
            inflectionClass: "FIRST",
            principalParts: ["amo", "amare", "amavi", "amatum"],
            definitions: ["love"],
            inflectionTable: { conjugations: [{ voice: "ACTIVE" }], agreements: [], declensions: {} },
        };
        renderWordDetail(verb);
        expect(document.querySelector("#conjugation-marker")).toBeTruthy();
        expect(document.querySelector("#declension-marker")).toBeFalsy();
        expect(document.querySelector("#agreement-marker")).toBeFalsy();
    });

    it("principal parts container reflects only latest data (cleared when empty)", () => {
        const first = {
            lemma: "puella",
            partOfSpeech: "NOUN",
            grammaticalGender: "FEMININE",
            inflectionClass: "FIRST",
            principalParts: ["puella", "puellae"],
            definitions: ["girl"],
            inflectionTable: { conjugations: [], agreements: [], declensions: { SINGULAR: {}, PLURAL: {} } },
        };
        renderWordDetail(first);
        expect(document.getElementById("principal-parts-container").textContent)
            .toMatch(/puella, puellae/);

        const second = {
            lemma: "bene",
            partOfSpeech: "ADVERB",
            grammaticalGender: null,
            inflectionClass: null,
            principalParts: [],
            definitions: ["well"],
            inflectionTable: { conjugations: [], agreements: [], declensions: {} },
        };
        renderWordDetail(second);
        expect(document.getElementById("principal-parts-container").textContent.trim()).toBe("");
    });

    it("inflections area is empty for POS without inflection tables", () => {
        const data = {
            lemma: "bene",
            partOfSpeech: "ADVERB",
            grammaticalGender: null,
            inflectionClass: null,
            principalParts: [],
            definitions: ["well"],
            inflectionTable: { conjugations: [], agreements: [], declensions: {} },
        };
        renderWordDetail(data);
        expect(document.getElementById("inflections-container").childElementCount).toBe(0);
    });
});