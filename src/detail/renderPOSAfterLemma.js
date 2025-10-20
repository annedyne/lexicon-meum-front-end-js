import {abbrevPartOfSpeech} from "@src/utils/formatPartOfSpeech.js";
import {POS} from "@src/utils/constants.js";

export function renderPOSAfterLemma(partOfSpeech){

        const positionsToRender = [POS.ADVERB, POS.PREPOSITION, POS.POSTPOSITION, POS.CONJUNCTION];

    if (!positionsToRender.includes(partOfSpeech)) {
        return; 
    }

    const container = document.getElementById("lemma-container");
    if (!container) return;

    //  remove only prior adverb marker(s) not the whole lemma-header
    container.querySelectorAll(".part-of-speech").forEach(n => n.remove());

    const partOfSpeechSpan = document.createElement("span");
    partOfSpeechSpan.classList.add("part-of-speech");
    partOfSpeechSpan.textContent = `  (${abbrevPartOfSpeech(partOfSpeech)})`;

    container.appendChild(partOfSpeechSpan);
}
