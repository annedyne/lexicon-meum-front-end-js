import {abbrevPartOfSpeech} from "@utils/format-part-of-speech.js";
import {POS} from "@src/utils/constants.js";

export function renderPOSAfterLemma(partOfSpeech){

        const positionsToRender = [POS.ADVERB, POS.PREPOSITION, POS.POSTPOSITION, POS.CONJUNCTION];

    if (!positionsToRender.includes(partOfSpeech)) {
        return; 
    }

    const container = document.querySelector("#lemma-container");
    if (!container) {
        return;
    }

    //  remove only prior adverb marker(s) not the whole lemma-header
    for (const n of container.querySelectorAll(".part-of-speech")) {
        n.remove();
    }

    const partOfSpeechSpan = document.createElement("span");
    partOfSpeechSpan.classList.add("part-of-speech");
    partOfSpeechSpan.textContent = `  (${abbrevPartOfSpeech(partOfSpeech)})`;

    container.append(partOfSpeechSpan);
}
