import {formatPOSForDefinitions, parsePartOfSpeech} from "@src/utils/formatPartOfSpeech.js";
import {POS} from "@src/utils/constants.js";

export function renderPrepositionSpecificElements(governedCase, partOfSpeech){
    const pos = parsePartOfSpeech(partOfSpeech)
    if ((pos !== POS.PREPOSITION && pos !== POS.POSTPOSITION) || governedCase == null) {
        return;
    }
    const formattedCase = governedCase
    const governedCaseSpan = document.createElement("span");
    governedCaseSpan.classList.add("definition-subheader");
    governedCaseSpan.textContent = `${formatPOSForDefinitions(partOfSpeech)} with ${governedCase.toLowerCase()}:`;

    return governedCaseSpan;
}