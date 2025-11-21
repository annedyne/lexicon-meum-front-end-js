// noinspection SpellCheckingInspection

import { renderDeclensionTable } from "./render-declension-table.js";
import { renderConjugationTable } from "./render-conjugation-table.js";
import { renderAdjectiveAgreementTable } from "./render-adjective-agreement-table.js";
import { renderLemmaHeader } from "./render-lemma-header.js";
import { renderPrincipalParts } from "./render-principal-parts.js";
import { renderDefinitions } from "./render-definitions.js";
import { renderInflectionType } from "./render-inflection-type.js";
import {renderPOSAfterLemma} from "./render-pos-after-lemma.js";
/**
 *  Displays word details
 *
 *  Renders elements common to all words
 *  Routes data for elements specific to partOfSpeech (e.g., NOUN, VERB) to the appropriate renderer
 *  If the pos is unrecognized, no pos specific action is taken.
 *  Errors encountered during data rendering are logged and displayed in the UI status element.
 *
 * @param wordDetailData
 */
export function renderWordDetail(wordDetailData) {
    const {
        lemma,
        partOfSpeech,
        syntacticSubtype: subtype,
        grammaticalGender: gender,
        governedCase,
        inflectionClass,
        principalParts,
        definitions,
    } = wordDetailData;

    try {
        renderLemmaHeader(lemma);
        renderDefinitions(definitions, governedCase, partOfSpeech, subtype);

        renderPOSAfterLemma(partOfSpeech);
        renderPrincipalParts(principalParts);
        renderInflectionType(inflectionClass, partOfSpeech);

        // Add noun gender only when relevant and principal parts exist
        if (partOfSpeech === "NOUN" && principalParts && gender) {
            addNounGender(gender);
        }

        const { inflectionTable } = wordDetailData ?? {};
        const {
            conjugations = [],
            agreements = [],
            declensions,
        } = inflectionTable ?? {};


        // Show exactly one inflection table depending on POS; clear otherwise
        const pos = typeof partOfSpeech === "string" ? partOfSpeech.trim().toUpperCase() : "";

        // noinspection BlockStatementJS
        switch (pos) {
            case "NOUN":
                renderDeclensionTable(declensions);
                break;

            case "VERB":
                renderConjugationTable(conjugations, "ACTIVE");
                break;

            case "ADJECTIVE":
            case "DETERMINER":
            case "PRONOUN":
                renderAdjectiveAgreementTable(agreements);
                break;

            default: {
                // No inflections for this POS; ensure area is cleared
                const container = document.querySelector("#inflections-container");
                container && container.replaceChildren();
            }

        }

    } catch (error) {
        console.error(`Rendering error for ${lemma} details:`, error);
        throw error;
    }
}


function addNounGender(gender) {
    const container = document.querySelector("#principal-parts-container");
    const ppSpan = container?.querySelector(".principal-parts");
    if (ppSpan) {
        const abbr = (typeof gender === "string" && gender.trim().length > 0)
            ? gender.trim().charAt(0).toLowerCase()
            : "";

        if (abbr) {
            // Add a leading space so it reads like: "puella, puellae f."
            ppSpan.append(document.createTextNode(" "));

            const em = document.createElement("em");
            em.classList.add("gender");
            em.textContent = `${abbr}.`;
            ppSpan.append(em);
        }
    }
}

