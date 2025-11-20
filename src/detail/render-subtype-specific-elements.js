import {formatPOSForDefinitions} from "@utils/format-part-of-speech.js";

export function renderSubtypeSpecificElements(subtype, partOfSpeech){

    if ( subtype === undefined) {
        return;
    }
    const subtypeSpan = document.createElement("span");
    subtypeSpan.classList.add("definition-subheader");
    subtypeSpan.textContent = ` ${formatPOSForDefinitions(subtype)} ${formatPOSForDefinitions(partOfSpeech)}:`;

    return subtypeSpan;
}