import { renderPrepositionElements } from "./render-preposition-elements.js";
import { renderSubtypeSpecificElements } from "./render-subtype-specific-elements.js";
import {POS} from "@utils/constants.js";

export function renderDefinitions(definitions, governedCase, partOfSpeech, subtype) {
  const container = document.querySelector("#definitions-container");
  container.replaceChildren();

  const definitionsLabelSpan = document.createElement("span");
  definitionsLabelSpan.classList.add("definitions-label");
  definitionsLabelSpan.textContent = "Definitions:";
  container.append(definitionsLabelSpan);

   let senseSpecificContent;
  // Insert preposition-specific content (e.g., governedCase) between the label and the lists
    if(partOfSpeech === POS.PREPOSITION || partOfSpeech ===  POS.POSTPOSITION){
        senseSpecificContent = renderPrepositionElements?.(governedCase, partOfSpeech);
    }
    // Insert subtype-specific content (e.g., subtype) between the label and the lists
    else if (partOfSpeech === POS.DETERMINER || partOfSpeech === POS.PRONOUN) {
        senseSpecificContent = renderSubtypeSpecificElements?.(subtype, partOfSpeech);
    }

  if (senseSpecificContent) {
      container.append(senseSpecificContent);
  }

  if (!definitions || definitions.length === 0) {
      return;
  }

  const visibleCount = 2;

  const list = document.createElement("ul");
  list.classList.add("definitions-list");

  // First N definitions
  for (const definition of definitions.slice(0, visibleCount)) {
    const li = document.createElement("li");
    li.textContent = definition;
    list.append(li);
  }

  container.append(list);

  // Remainder definitions
  if (definitions.length > visibleCount) {
    const hiddenList = document.createElement("ul");
    hiddenList.classList.add("definitions-list", "definitions-hidden");
    hiddenList.style.display = "none";

    for (const definition of definitions.slice(visibleCount)) {
      const li = document.createElement("li");
      li.textContent = definition;
      hiddenList.append(li);
    }

    container.append(hiddenList);

    // Toggle button
    const toggle = document.createElement("button");
    toggle.classList.add("definitions-toggle");
    toggle.textContent = "Show more";
    toggle.addEventListener("click", () => {
      const isHidden = hiddenList.style.display === "none";
      hiddenList.style.display = isHidden ? "block" : "none";
      toggle.textContent = isHidden ? "Show less" : "Show more";
    });

    container.append(toggle);
  }
}
