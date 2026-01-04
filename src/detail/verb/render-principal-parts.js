import {GRAMMAR_ABBREV_LABEL, GRAMMAR_KEYS} from "@utilities";

export function renderPrincipalParts(principalParts, morphologicalSubtype) {
    const principalPartsContainer = document.querySelector("#principal-parts-container");
    principalPartsContainer.textContent = "";

    if (principalParts && principalParts.length > 0) {
        const principalPartsSpan = document.createElement("span");
        principalPartsSpan.classList.add("principal-parts");
        principalPartsSpan.textContent = principalParts.join(", ");
        principalPartsContainer.append(principalPartsSpan);

        // Only create and append if deponent
        if (morphologicalSubtype === GRAMMAR_KEYS.DEPONENT) {
            const subtypeSpan = document.createElement("span");
            subtypeSpan.classList.add("principal-parts-subtype");
            subtypeSpan.textContent = ` (${GRAMMAR_ABBREV_LABEL.DEPONENT})`;
            principalPartsContainer.append(subtypeSpan);
        }
    }
}
