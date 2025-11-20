
/* @vitest-environment jsdom */
import { describe, it, expect, beforeEach, vi } from "vitest";

// Use real implementations
vi.mock("../../src/detail/render-declension-table.js", async (orig) => await orig());
vi.mock("../../src/detail/render-conjugation-table.js", async (orig) => await orig());
vi.mock("../../src/detail/render-adjective-agreement-table.js", async (orig) => await orig());
vi.mock("../../src/detail/render-lemma-header.js", async (orig) => await orig());
vi.mock("../../src/detail/render-definitions.js", async (orig) => await orig());
vi.mock("../../src/detail/render-inflection-type.js", async (orig) => await orig());
vi.mock("../../src/detail/render-principal-parts.js", async (orig) => await orig());
vi.mock("../../src/detail/render-pos-after-lemma.js", async (orig) => await orig());

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

describe("Integration: real renderers clear correctly", () => {
    beforeEach(() => {
        vi.resetModules();
        setupDom();
    });

    it("switching POS replaces the table content (declension -> conjugation)", () => {
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
        const container = document.createElement('div');
        container.id = 'inflections-container';
        document.body.replaceChildren(container);

        renderWordDetail(noun);
        const afterNounHTML = container.innerHTML;
        expect(afterNounHTML).toContain("declension-table");

        const verb = {
            lemma: "amo",
            partOfSpeech: "VERB",
            grammaticalGender: undefined,
            inflectionClass: "FIRST",
            principalParts: ["amo", "amare", "amavi", "amatum"],
            definitions: ["love"],
            inflectionTable: { conjugations: [{ voice: "ACTIVE" }], agreements: [], declensions: {} },
        };
        container.id = 'inflections-container';
        document.body.replaceChildren(container);

        renderWordDetail(verb);
        const afterVerbHTML = container.innerHTML;
        expect(afterVerbHTML).toContain("conjugation-table");
        expect(afterVerbHTML).not.toContain("declension-table");
    });

    it("principal parts clear when none provided on next render", () => {
        const withParts = {
            lemma: "puella",
            partOfSpeech: "NOUN",
            grammaticalGender: "FEMININE",
            inflectionClass: "FIRST",
            principalParts: ["puella", "puellae"],
            definitions: ["girl"],
            inflectionTable: { conjugations: [], agreements: [], declensions: { SINGULAR: {}, PLURAL: {} } },
        };
        renderWordDetail(withParts);
        expect(document.querySelector("#principal-parts-container").textContent)
            .toMatch(/puella, puellae/);

        const noParts = {
            lemma: "bene",
            partOfSpeech: "ADVERB",
            grammaticalGender: undefined,
            inflectionClass: undefined,
            principalParts: [],
            definitions: ["well"],
            inflectionTable: { conjugations: [], agreements: [], declensions: {} },
        };
        renderWordDetail(noParts);
        expect(document.querySelector("#principal-parts-container").textContent.trim()).toBe("");
    });

    it("inflection-type container is cleared each time and shows POS only for configured types", () => {
        const noun = {
            lemma: "puella",
            partOfSpeech: "NOUN",
            grammaticalGender: "FEMININE",
            inflectionClass: "FIRST",
            principalParts: [],
            definitions: [],
            inflectionTable: { conjugations: [], agreements: [], declensions: { SINGULAR: {}, PLURAL: {} } },
        };
        renderWordDetail(noun);
        const inflectionTypeAfterNoun = document.querySelector("#inflection-type-container").textContent;
        expect(inflectionTypeAfterNoun).toMatch(/\(noun\)/i);

        const adverb = {
            lemma: "bene",
            partOfSpeech: "ADVERB",
            grammaticalGender: undefined,
            inflectionClass: undefined,
            principalParts: [],
            definitions: [],
            inflectionTable: { conjugations: [], agreements: [], declensions: {} },
        };
        renderWordDetail(adverb);
        const inflectionTypeAfterAdverb = document.querySelector("#inflection-type-container").textContent;
        // should not include part-of-speech for adverb (rendered elsewhere)
        expect(inflectionTypeAfterAdverb.toLowerCase()).not.toMatch(/\(adverb\)/);
    });

    it("adds POS badge to lemma-container for ADVERB and removes it for a subsequent non-adverb", () => {
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

        const lemmaContainerAfterAdverb = document.querySelector("#lemma-container");
        const adverbBadge = lemmaContainerAfterAdverb.querySelector(".part-of-speech");
        expect(adverbBadge).toBeTruthy();

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

        const lemmaContainerAfterNoun = document.querySelector("#lemma-container");
        const nounBadge = lemmaContainerAfterNoun.querySelector(".part-of-speech");
        expect(nounBadge).toBeFalsy();
    });

});