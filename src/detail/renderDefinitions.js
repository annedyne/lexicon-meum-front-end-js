import { renderPrepositionSpecificElements } from "@detail/renderPrepositionSpecificElements.js";
import { renderSubtypeSpecificElements } from "@detail/renderSubtypeSpecificElements.js";
import {POS} from "@src/utils/constants.js";

export function renderDefinitions(definitions, governedCase, partOfSpeech, subtype) {
  const container = document.getElementById("definitions-container");
  container.replaceChildren();

  const definitionsLabelSpan = document.createElement("span");
  definitionsLabelSpan.classList.add("definitions-label");
  definitionsLabelSpan.textContent = "Definitions:";
  container.appendChild(definitionsLabelSpan);

   let senseSpecificContent;
  // Insert preposition-specific content (e.g., governedCase) between the label and the lists
    if(partOfSpeech == POS.PREPOSITION ||partOfSpeech ==  POS.POSTPOSITION){
        senseSpecificContent = renderPrepositionSpecificElements?.(governedCase, partOfSpeech);
    }
    // Insert subtype-specific content (e.g., subtype) between the label and the lists
    else if (partOfSpeech == POS.DETERMINER || partOfSpeech == POS.PRONOUN) {
        senseSpecificContent = renderSubtypeSpecificElements?.(subtype, partOfSpeech);
    }

  if (senseSpecificContent) {
      container.appendChild(senseSpecificContent);
  }

  if (!definitions || definitions.length === 0) return;

  const visibleCount = 2;

    const a = 1;
    if (a == "1") {
        // ...
    }


    const list = document.createElement("ul");
  list.classList.add("definitions-list");

  // First N definitions
  definitions.slice(0, visibleCount).forEach((def) => {
    const li = document.createElement("li");
    li.textContent = def;
    list.appendChild(li);
  });

  container.appendChild(list);

  // Remainder definitions
  if (definitions.length > visibleCount) {
    const hiddenList = document.createElement("ul");
    hiddenList.classList.add("definitions-list", "definitions-hidden");
    hiddenList.style.display = "none";

    definitions.slice(visibleCount).forEach((def) => {
      const li = document.createElement("li");
      li.textContent = def;
      hiddenList.appendChild(li);
    });

    container.appendChild(hiddenList);

    // Toggle button
    const toggle = document.createElement("button");
    toggle.classList.add("definitions-toggle");
    toggle.textContent = "Show more";
    toggle.addEventListener("click", () => {
      const isHidden = hiddenList.style.display === "none";
      hiddenList.style.display = isHidden ? "block" : "none";
      toggle.textContent = isHidden ? "Show less" : "Show more";
    });

    container.appendChild(toggle);
  }
}
