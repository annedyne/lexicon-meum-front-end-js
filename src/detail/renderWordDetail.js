import { renderDeclensionTable } from "./renderDeclensionTable.js";
import { renderConjugationTable } from "./renderConjugationTable.js";
import { renderAdjectiveAgreementTable } from "./renderAdjectiveAgreementTable.js";
import { renderLemmaHeader } from "./renderLemmaHeader.js";
import { renderPrincipalParts } from "./renderPrincipalParts.js";
import { renderDefinitions } from "./renderDefinitions.js";
import { renderInflectionType } from "./renderInflectionType.js";
import {renderPOSAfterLemma} from "@detail/renderPOSAfterLemma.js";
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
        grammaticalGender: gender,
        governedCase,
        inflectionClass,
        principalParts,
        definitions,
    } = wordDetailData;

    try {
        renderLemmaHeader(lemma);
        renderDefinitions(definitions, governedCase, partOfSpeech);

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
            declensions = null,
        } = inflectionTable ?? {};


        // Show exactly one inflection table depending on POS; clear otherwise
        const pos = typeof partOfSpeech === "string" ? partOfSpeech.trim().toUpperCase() : "";

        if (pos === "NOUN") {
            renderDeclensionTable(declensions);
        } else if (pos === "VERB") {
            renderConjugationTable(conjugations, "ACTIVE");
        } else if (pos === "ADJECTIVE") {
            renderAdjectiveAgreementTable(agreements);
        } else {
            // No inflections for this POS; ensure area is cleared
            const container = document.getElementById("inflections-container");
            container && container.replaceChildren();
        }

    } catch (err) {
        console.error(`Rendering error for ${lemma} details:`, err);
        throw err;
    }
}


function addNounGender(gender) {
    const container = document.getElementById("principal-parts-container");
    const ppSpan = container?.querySelector(".principal-parts");
    if (ppSpan) {
        const abbr = (typeof gender === "string" && gender.trim().length > 0)
            ? gender.trim().charAt(0).toLowerCase()
            : "";

        if (abbr) {
            // Add a leading space so it reads like: "puella, puellae f."
            ppSpan.appendChild(document.createTextNode(" "));

            const em = document.createElement("em");
            em.classList.add("gender");
            em.textContent = `${abbr}.`;
            ppSpan.appendChild(em);
        }
    }
}

