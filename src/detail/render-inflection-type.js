import {POS} from "@utilities/constants.js";

export function renderInflectionType(inflectionClass, partOfSpeech) {
  let container = document.querySelector("#inflection-type-container");

  container.replaceChildren();

  if (inflectionClass) {
    let span = document.createElement("span");
    span.classList.add("inflection-type");

    span.textContent = `${inflectionClass}`;
    container.append(span);
  }

  const posRaw = typeof partOfSpeech === "string" ? partOfSpeech.trim() : "";
  const posLower = posRaw.toLowerCase();

  // Set of POS types that have inflection info (such as an inflection table)
  // above which it makes sense to add the POS info

  // noinspection LocalVariableNamingConventionJS
    const POS_POSITION_IN_INFLECTION = new Set([ POS.ADJECTIVE, POS.NOUN, POS.VERB]);

  if (posRaw && POS_POSITION_IN_INFLECTION.has(posRaw)) {
    const partOfSpeechSpan = document.createElement("span");
    partOfSpeechSpan.classList.add("part-of-speech");
    partOfSpeechSpan.textContent = ` (${posLower})`;
    container.append(partOfSpeechSpan);
  }
}
