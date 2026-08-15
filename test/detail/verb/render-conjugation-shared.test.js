import { describe, it, expect, beforeEach } from "vitest";
import { renderConjugationByVoice } from "@detail/verb/render-conjugation-shared.js";
import { TAB_KEY } from "@detail/verb/tabs/tab-keys.js";

// Gender resolution and view-model logic are covered purely in build-conjugation-view-model.test.js.
// These are thin smoke checks that the renderer paints the resolved cells into the DOM.

// Passive voice of a standard verb (amare): gender-agnostic present, gender-specific perfect.
const passiveConjugations = [
    {
        voice: TAB_KEY.PASSIVE,
        mood: "Indicative",
        tenses: [
            { defaultName: "Present", forms: ["amor", "amāris"] },
            {
                defaultName: "Perfect",
                formsByGender: {
                    masculine: ["amātus sum"],
                    feminine: ["amāta sum"],
                    neuter: ["amātum sum"],
                },
            },
        ],
    },
];

// Deponent verb (sequi): passive form, active meaning, so displayed under the ACTIVE voice.
const deponentConjugations = [
    {
        voice: TAB_KEY.ACTIVE,
        mood: "Indicative",
        tenses: [
            { defaultName: "Present", forms: ["sequor", "sequitur"] },
            {
                defaultName: "Perfect",
                formsByGender: {
                    masculine: ["secūtus sum"],
                    feminine: ["secūta sum"],
                    neuter: ["secūtum sum"],
                },
            },
        ],
    },
];

function renderedCells() {
    return [...document.querySelectorAll("#conjugation-table td")].map((c) => c.textContent);
}

describe("renderConjugationByVoice", () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="inflections-container"></div>';
    });

    it("paints resolved cells for the active gender, agnostic forms always shown", () => {
        renderConjugationByVoice(passiveConjugations, TAB_KEY.FEMININE, TAB_KEY.PASSIVE, "passive-conjugation-table");
        const cells = renderedCells();
        expect(cells).toContain("amor"); // agnostic present
        expect(cells).toContain("amāta sum"); // feminine perfect
        expect(cells).not.toContain("amātus sum"); // masculine not shown
    });

    it("renders a deponent verb under the active voice", () => {
        renderConjugationByVoice(deponentConjugations, TAB_KEY.FEMININE, TAB_KEY.ACTIVE, "active-conjugation-table");
        const cells = renderedCells();
        expect(cells).toContain("sequor");
        expect(cells).toContain("secūta sum");
        expect(cells).not.toContain("secūtus sum");
    });
});
