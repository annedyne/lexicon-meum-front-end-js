/* @vitest-environment jsdom */
import { describe, it, expect, beforeEach, vi } from "vitest";

// Lightweight mocks for the 3 inflection renderers to isolate orchestrator behavior
vi.mock("@detail/render-declension-table.js", () => ({
    renderDeclensionTable: () => {
        const c = document.querySelector("#inflections-container");
        if (c) {
            c.replaceChildren();
            const marker = document.createElement("div");
            marker.id = "declension-marker";
            marker.textContent = "DECL";
            c.append(marker);
        }
    },
}));

vi.mock("@detail/verb/render-conjugation-table.js", () => ({
    renderConjugationTable: () => {
        const c = document.querySelector("#inflections-container");
        if (c) {
            c.replaceChildren();
            const marker = document.createElement("div");
            marker.id = "conjugation-marker";
            marker.textContent = "CONJ";
            c.append(marker);
        }
    },
    renderConjugationForTab: () => {
        // No-op or you could add logic if needed
    },
}));

vi.mock("@detail/render-adjective-agreement-table.js", () => ({
    renderAdjectiveAgreementTable: () => {
        const c = document.querySelector("#inflections-container");
        if (c) {
            c.replaceChildren();
            const marker = document.createElement("div");
            marker.id = "agreement-marker";
            marker.textContent = "AGRM";
            c.append(marker);
        }
    },
}));

// Keep these real to verify their own clearing logic as part of flows
vi.mock("@detail/render-lemma-header.js", async (orig) => await orig());
vi.mock("@detail/render-definitions.js", async (orig) => await orig());
vi.mock("@detail/render-inflection-type.js", async (orig) => await orig());
vi.mock("@detail/render-principal-parts.js", async (orig) => await orig());
vi.mock("@detail/render-pos-after-lemma.js", async (orig) => await orig());

import { renderWordDetail } from "@detail/render-word-detail.js";

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
       // vi.resetModules();
        setupDom();
    });

    it("clears inflections for an adverb, then renders declension only for a noun", () => {
        const adverb = {
            lemma: "bene",
            partOfSpeech: "ADVERB",
            grammaticalGender: undefined,
            inflectionClass: undefined,
            principalParts: [],
            definitions: ["well"],
            inflectionTable: { conjugations: [], agreements: [], declensions: {} },
        };
        renderWordDetail(adverb);
        const inflectionsAfterAdverb = document.querySelector("#inflections-container");
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
        const inflectionsAfterNoun = document.querySelector("#inflections-container");
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
            grammaticalGender: undefined,
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
        expect(document.querySelector("#principal-parts-container").textContent)
            .toMatch(/puella, puellae/);

        const second = {
            lemma: "bene",
            partOfSpeech: "ADVERB",
            grammaticalGender: undefined,
            inflectionClass: undefined,
            principalParts: [],
            definitions: ["well"],
            inflectionTable: { conjugations: [], agreements: [], declensions: {} },
        };
        renderWordDetail(second);
        expect(document.querySelector("#principal-parts-container").textContent.trim()).toBe("");
    });

    it("inflections area is empty for POS without inflection tables", () => {
        const data = {
            lemma: "bene",
            partOfSpeech: "ADVERB",
            grammaticalGender: undefined,
            inflectionClass: undefined,
            principalParts: [],
            definitions: ["well"],
            inflectionTable: { conjugations: [], agreements: [], declensions: {} },
        };
        renderWordDetail(data);
        expect(document.querySelector("#inflections-container").childElementCount).toBe(0);
    });
});