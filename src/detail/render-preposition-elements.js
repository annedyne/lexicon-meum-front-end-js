import {formatPOSForDefinitions, parsePartOfSpeech} from "@utils/format-part-of-speech.js";
import {POS} from "@utils/constants.js";

export function renderPrepositionElements(governedCase, partOfSpeech){
    const pos = parsePartOfSpeech(partOfSpeech);
    if ((pos !== POS.PREPOSITION && pos !== POS.POSTPOSITION) || governedCase === undefined) {
        return;
    }

    const governedCaseSpan = document.createElement("span");
    governedCaseSpan.classList.add("definition-subheader");
    governedCaseSpan.textContent = `${formatPOSForDefinitions(partOfSpeech)} with ${governedCase.toLowerCase()}:`;

    return governedCaseSpan;
}