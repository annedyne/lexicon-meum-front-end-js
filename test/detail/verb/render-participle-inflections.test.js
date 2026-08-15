import { describe, it, expect, beforeEach } from "vitest";
import { renderParticipleInflections } from "@detail/verb/render-participle-inflections.js";
import { clearSearchInput, setSearchInputContext } from "@detail/detail-context.js";

const participles = [
    {
        voice: "participle",
        gender: "MASCULINE",
        tenses: [
            {
                defaultName: "Present Participle",
                declensions: {
                    SINGULAR: { NOMINATIVE: "amāns", GENITIVE: "amantis" },
                    PLURAL: { NOMINATIVE: "amantēs", GENITIVE: "amantium" },
                },
            },
            {
                defaultName: "Gerund",
                declensions: {
                    SINGULAR: { GENITIVE: "amandī", DATIVE: "amandō", ACCUSATIVE: "amandum", ABLATIVE: "amandō" },
                    PLURAL: { GENITIVE: "amandī", DATIVE: "amandō", ACCUSATIVE: "amandum", ABLATIVE: "amandō" },
                },
            },
            {
                defaultName: "Supine",
                declensions: {
                    SINGULAR: { ACCUSATIVE: "amātum", ABLATIVE: "amātū" },
                    PLURAL: { ACCUSATIVE: "amātum", ABLATIVE: "amātū" },
                },
            },
        ],
    },
];

// The verbal noun section is the last tbody of the rendered table
function getVerbalNounSection() {
    const sections = document.querySelectorAll("#conjugation-table tbody");
    return sections.item(sections.length - 1);
}

describe("renderParticipleInflections verbal noun section", () => {
    beforeEach(() => {
        clearSearchInput();
        document.body.innerHTML = '<div id="inflections-container"></div>';
    });

    it("renders gerund and supine in their own section below the participle tenses", () => {
        renderParticipleInflections(participles, "MASCULINE");

        const sections = document.querySelectorAll("#conjugation-table tbody");
        expect(sections).toHaveLength(2);

        const headers = [...getVerbalNounSection().querySelectorAll("th.tense-header")].map((th) => th.textContent);
        expect(headers).toEqual(["Gerund", "Supine"]);
    });

    it("does not render gerund or supine as regular participle tense sections", () => {
        renderParticipleInflections(participles, "MASCULINE");

        const tenseHeaders = [...document.querySelectorAll("th.tense-header")]
            .filter((th) => th.colSpan === 2)
            .map((th) => th.textContent);
        expect(tenseHeaders).toEqual(["Present Participle"]);
    });

    it("aligns the union of cases, leaving a blank cell where a form is missing", () => {
        renderParticipleInflections(participles, "MASCULINE");

        const rows = [...getVerbalNounSection().querySelectorAll("tr")].map((row) =>
            [...row.children].map((cell) => cell.textContent),
        );
        expect(rows).toEqual([
            ["Gen.", "amandī", ""],
            ["Dat.", "amandō", ""],
            ["Acc.", "amandum", "amātum"],
            ["Abl.", "amandō", "amātū"],
        ]);
    });

    it("highlights a matching verbal noun form", () => {
        setSearchInputContext("amatum");
        renderParticipleInflections(participles, "MASCULINE");

        const marks = [...getVerbalNounSection().querySelectorAll("mark")].map((mark) => mark.textContent);
        expect(marks).toEqual(["amātum"]);
    });

    it("omits the section when neither gerund nor supine is present", () => {
        const withoutVerbalNouns = [
            {
                ...participles[0],
                tenses: [participles[0].tenses[0]],
            },
        ];

        renderParticipleInflections(withoutVerbalNouns, "MASCULINE");

        expect(document.querySelectorAll("#conjugation-table tbody")).toHaveLength(1);
    });
});
