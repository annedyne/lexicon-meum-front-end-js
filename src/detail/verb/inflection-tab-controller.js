
import {renderTabs} from "./tabs/render-tabs.js";
import { TABS } from "./tabs/tab-registry.js";

/**
 * Initializes the inflection tabs by setting up the necessary render and route mechanisms.
 *
 * @param {Object} inflectionTableData - The data or configuration object used to set up the tabs and their content routing.
 * @return {void} This method does not return a value.
 */
export function initializeInflectionTabs(inflectionTableData) {
    // render tabs first (pass a callback to render the tab contents )
    renderTabs(inflectionTableData, (voiceTabId, genderTabId) => {
        routeTabContent(voiceTabId, genderTabId, inflectionTableData);
    });
}

/**
 * Routes appropriate inflection data to appropriate renderer for the active voice and gender tab.
 * @param voiceTabId
 * @param genderTabId
 * @param inflectionTable
 */
function routeTabContent(voiceTabId, genderTabId, inflectionTable) {
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


