
import {renderTabs} from "./tabs/render-tabs.js";
import { TABS } from "./tabs/tab-registry.js";

export function renderConjugationTable(conjugations) {
    // render tabs first (pass a callback to render the tab contents )
    renderTabs(conjugations, (voiceTabId, genderTabId) => {
        renderConjugationForTab(voiceTabId, genderTabId, conjugations);
    });
}

/**
 * Renders the conjugations for the specified voice and gender tab.
 * @param voiceTabId
 * @param genderTabId
 * @param conjugations
 */
function renderConjugationForTab(voiceTabId, genderTabId, conjugations) {
    // get voice tab from registry
    const tab = TABS[voiceTabId];

    if (!tab) {
        console.warn(`No tab found for id: ${voiceTabId}`);
        return;
    }

    tab.render(conjugations, genderTabId);
}


