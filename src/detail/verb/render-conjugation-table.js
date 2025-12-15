
import {renderTabs} from "./tabs/render-tabs.js";
import { TABS } from "./tabs/tab-registry.js";

export function renderConjugationTable(inflectionTable) {
    // render tabs first (pass a callback to render the tab contents )
    renderTabs(inflectionTable, (voiceTabId, genderTabId) => {
        renderTabContent(voiceTabId, genderTabId, inflectionTable);
    });
}

/**
 * Renders the conjugations for the specified voice and gender tab.
 * @param voiceTabId
 * @param genderTabId
 * @param inflectionTable
 */
function renderTabContent(voiceTabId, genderTabId, inflectionTable) {
    // get voice tab from registry
    const voiceTab = TABS[voiceTabId];

    if (!voiceTab) {
        console.warn(`No tab found for id: ${voiceTabId}`);
        return;
    }

    // Get the appropriate data based on the tab's dataSource
    const dataSource = voiceTab.dataSource || 'conjugations'; // default to conjugations for backward compatibility
    const tabData = inflectionTable[dataSource] || [];

    voiceTab.render(tabData, genderTabId);
}


