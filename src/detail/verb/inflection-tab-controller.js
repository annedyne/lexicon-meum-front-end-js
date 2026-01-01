
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
    // Clear all previous tab content before rendering new content
    clearTabContent();
    
    // get voice tab from registry
    const voiceTab = TABS[voiceTabId];

    if (!voiceTab) {
        console.warn(`No tab found for id: ${voiceTabId}`);
        return;
    }

    // Get the appropriate data based on the tab's dataSource
    const dataSource = voiceTab.dataSource || 'conjugations'; // default to conjugations for backward compatibility
    const tabData = inflectionTable[dataSource] || [];

    addTabSpacer();
    voiceTab.render(tabData, genderTabId);
}

function addTabSpacer() {
    const container = document.querySelector("#conjugation-tabs");
    if (!container) {
        return;
    }
    const spacer = document.createElement("div");
    spacer.id = "tab-spacer";
    spacer.classList.add("tab-spacer");
    container.append(spacer);
}

/**
 * Centralized function to clear all tab content elements.
 * This ensures all tab renderers don't need to remember to clear each other's content.
 */
function clearTabContent() {
    const container = document.querySelector("#inflections-container");
    if (!container) {
        return;
    }

    // List all possible content elements that tabs might create
    const elementsToRemove = [
        "#conjugation-table",
        "#tab-spacer",
        "#coming-soon"
        // Add any other selectors for elements that tabs create
    ];
    
    for (const selector of elementsToRemove) {
        const element = container.querySelector(selector);
        if (element) {
            element.remove();
        }
    }
}


