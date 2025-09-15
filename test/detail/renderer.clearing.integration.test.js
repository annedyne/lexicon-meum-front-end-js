
/* @vitest-environment jsdom */
import { describe, it, expect, beforeEach, vi } from "vitest";

// Use real implementations
vi.mock("../../src/detail/renderDeclensionTable.js", async (orig) => await orig());
vi.mock("../../src/detail/renderConjugationTable.js", async (orig) => await orig());
vi.mock("../../src/detail/renderAdjectiveAgreementTable.js", async (orig) => await orig());
vi.mock("../../src/detail/renderLemmaHeader.js", async (orig) => await orig());
vi.mock("../../src/detail/renderDefinitions.js", async (orig) => await orig());
vi.mock("../../src/detail/renderInflectionType.js", async (orig) => await orig());
vi.mock("../../src/detail/renderPrincipalParts.js", async (orig) => await orig());
vi.mock("../../src/detail/renderAdverbSpecificElements.js", async (orig) => await orig());

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
        renderWordDetail(noun);
        const afterNounHTML = document.getElementById("inflections-container").innerHTML;
        expect(afterNounHTML).toContain("declension-table");

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
        const afterVerbHTML = document.getElementById("inflections-container").innerHTML;
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
        expect(document.getElementById("principal-parts-container").textContent)
            .toMatch(/puella, puellae/);

        const noParts = {
            lemma: "bene",
            partOfSpeech: "ADVERB",
            grammaticalGender: null,
            inflectionClass: null,
            principalParts: [],
            definitions: ["well"],
            inflectionTable: { conjugations: [], agreements: [], declensions: {} },
        };
        renderWordDetail(noParts);
        expect(document.getElementById("principal-parts-container").textContent.trim()).toBe("");
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
        const inflectionTypeAfterNoun = document.getElementById("inflection-type-container").textContent;
        expect(inflectionTypeAfterNoun).toMatch(/\(noun\)/i);

        const adverb = {
            lemma: "bene",
            partOfSpeech: "ADVERB",
            grammaticalGender: null,
            inflectionClass: null,
            principalParts: [],
            definitions: [],
            inflectionTable: { conjugations: [], agreements: [], declensions: {} },
        };
        renderWordDetail(adverb);
        const inflectionTypeAfterAdverb = document.getElementById("inflection-type-container").textContent;
        // should not include part-of-speech for adverb (rendered elsewhere)
        expect(inflectionTypeAfterAdverb.toLowerCase()).not.toMatch(/\(adverb\)/);
    });

    it("adds POS badge to lemma-container for ADVERB and removes it for a subsequent non-adverb", () => {
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

        const lemmaContainerAfterAdverb = document.getElementById("lemma-container");
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

        const lemmaContainerAfterNoun = document.getElementById("lemma-container");
        const nounBadge = lemmaContainerAfterNoun.querySelector(".part-of-speech");
        expect(nounBadge).toBeFalsy();
    });

});