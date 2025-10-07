export function renderInflectionType(inflectionClass, partOfSpeech) {
  let container = document.getElementById("inflection-type-container");

  container.replaceChildren();

  if (inflectionClass) {
    let span = document.createElement("span");
    span.classList.add("inflection-type");

    span.textContent = `${inflectionClass}`;
    container.appendChild(span);
  }

  const posRaw = typeof partOfSpeech === "string" ? partOfSpeech.trim() : "";
  const posLower = posRaw.toLowerCase();

  // Set of POS types that have inflection info (such as an inflection table)
  // above which it makes sense to add the POS info
  const POS_POSITION_IN_INFLECTION = new Set(["noun", "verb", "adjective"]);

  if (posLower && POS_POSITION_IN_INFLECTION.has(posLower)) {
    const partOfSpeechSpan = document.createElement("span");
    partOfSpeechSpan.classList.add("part-of-speech");
    partOfSpeechSpan.textContent = ` (${posLower})`;
    container.appendChild(partOfSpeechSpan);
  }
}
