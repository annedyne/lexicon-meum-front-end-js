import { renderPrepositionElements } from "./render-preposition-elements.js";
import { renderSubtypeSpecificElements } from "./render-subtype-specific-elements.js";
import { CSS_CLASSES, DEFINITIONS_TOGGLE_LABEL, POS } from "@utilities/constants.js";

export function renderDefinitions(definitions, governedCase, partOfSpeech, subtype, shortDefinition) {
    const container = document.querySelector("#definitions-container");
    container.replaceChildren();

    const definitionsLabelSpan = document.createElement("span");
    definitionsLabelSpan.classList.add(CSS_CLASSES.DEFINITIONS_LABEL);
    definitionsLabelSpan.textContent = "Definitions:";
    container.append(definitionsLabelSpan);

    let senseSpecificContent;
    // Insert preposition-specific content (e.g., governedCase) between the label and the lists
    if (partOfSpeech === POS.PREPOSITION || partOfSpeech === POS.POSTPOSITION) {
        senseSpecificContent = renderPrepositionElements?.(governedCase, partOfSpeech);
    }
    // Insert subtype-specific content (e.g., subtype) between the label and the lists
    else if (partOfSpeech === POS.DETERMINER || partOfSpeech === POS.PRONOUN) {
        senseSpecificContent = renderSubtypeSpecificElements?.(subtype, partOfSpeech);
    }

    if (senseSpecificContent) {
        container.append(senseSpecificContent);
    }

    if (shortDefinition) {
        const shortDefinitionSpan = document.createElement("span");
        shortDefinitionSpan.classList.add(CSS_CLASSES.DEFINITIONS_SHORT);
        shortDefinitionSpan.append(buildTextWithContextNotes(shortDefinition));
        container.append(shortDefinitionSpan);
    }

    if (!definitions || definitions.length === 0) {
        return;
    }

    if (isOnlyDefinitionSameAsShort(definitions, shortDefinition)) {
        return;
    }

    const hiddenList = buildDefinitionsList(definitions);
    hiddenList.classList.add(CSS_CLASSES.DEFINITIONS_HIDDEN);
    hiddenList.style.display = "none";
    container.append(hiddenList);

    // Toggle button: swaps the short definition for the full definitions tree, since the
    // tree already repeats the short definition as its first entry
    const toggle = document.createElement("button");
    toggle.classList.add(CSS_CLASSES.DEFINITIONS_TOGGLE);
    toggle.textContent = DEFINITIONS_TOGGLE_LABEL.SHOW;
    toggle.addEventListener("click", () => {
        const isHidden = hiddenList.style.display === "none";
        hiddenList.style.display = isHidden ? "block" : "none";
        toggle.textContent = isHidden ? DEFINITIONS_TOGGLE_LABEL.HIDE : DEFINITIONS_TOGGLE_LABEL.SHOW;

        const shortDefinitionSpan = container.querySelector(`.${CSS_CLASSES.DEFINITIONS_SHORT}`);
        if (shortDefinitionSpan) {
            shortDefinitionSpan.style.display = isHidden ? "none" : "";
        }
    });

    container.append(toggle);
}

// True if expanding would just repeat the shortDefinition already shown, so no toggle is needed
export function isOnlyDefinitionSameAsShort(definitions, shortDefinition) {
    return (
        definitions.length === 1 &&
        !(definitions[0].children && definitions[0].children.length > 0) &&
        definitions[0].text === shortDefinition
    );
}

// Recursively builds a numbered list from definition nodes ({ text, children? }).
// A level is only numbered when it has more than one node.
function buildDefinitionsList(nodes) {
    const list = document.createElement("ol");
    list.classList.add(CSS_CLASSES.DEFINITIONS_LIST);
    if (nodes.length <= 1) {
        list.classList.add(CSS_CLASSES.DEFINITIONS_UNNUMBERED);
    }

    for (const node of nodes) {
        const li = document.createElement("li");
        li.append(buildTextWithContextNotes(node.text));

        if (node.children && node.children.length > 0) {
            li.append(buildDefinitionsList(node.children));
        }

        list.append(li);
    }

    return list;
}

// Builds text content with parenthetical context notes (e.g. "(transitive)") wrapped in
// their own span, so they can be styled as notation distinct from the definition itself.
function buildTextWithContextNotes(text) {
    const fragment = document.createDocumentFragment();
    const contextNotePattern = /\([^()]*\)/g;
    let lastIndex = 0;
    let match;

    while ((match = contextNotePattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            fragment.append(document.createTextNode(text.slice(lastIndex, match.index)));
        }

        const contextSpan = document.createElement("span");
        contextSpan.classList.add(CSS_CLASSES.DEFINITION_CONTEXT);
        contextSpan.textContent = match[0];
        fragment.append(contextSpan);

        lastIndex = contextNotePattern.lastIndex;
    }

    if (lastIndex < text.length) {
        fragment.append(document.createTextNode(text.slice(lastIndex)));
    }

    return fragment;
}
