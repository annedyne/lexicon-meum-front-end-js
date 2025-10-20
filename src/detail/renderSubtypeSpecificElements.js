import {formatPOSForDefinitions, parsePartOfSpeech} from "@src/utils/formatPartOfSpeech.js";
import {POS} from "@src/utils/constants.js";

export function renderSubtypeSpecificElements(subtype, partOfSpeech){
    const pos = parsePartOfSpeech(partOfSpeech)
    if ( subtype == null) {
        return;
    }
    const formattedCase = subtype
    const subtypeSpan = document.createElement("span");
    subtypeSpan.classList.add("definition-subheader");
    subtypeSpan.textContent = ` ${formatPOSForDefinitions(subtype)} ${formatPOSForDefinitions(partOfSpeech)}:`;

    return subtypeSpan;
}