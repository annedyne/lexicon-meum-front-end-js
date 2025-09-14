import {formatPOS} from "@src/utils/formatPartOfSpeech.js";

export function renderAdverbSpecificContent(partOfSpeech){
    if (partOfSpeech !== "ADVERB") { 
        return; 
    }

    const container = document.getElementById("lemma-container");
    if (!container) return;

    //  remove only prior adverb marker(s) not the whole lemma-header
    container.querySelectorAll(".grammatical-position").forEach(n => n.remove());

    const positionSpan = document.createElement("span");
    positionSpan.classList.add("grammatical-position");
    positionSpan.textContent = `  (${formatPOS(partOfSpeech)})`;

    container.appendChild(positionSpan);
}
