import {
    getActiveTabVoice,
    setActiveTabVoice,
    getActiveTabGender,
    setActiveTabGender,
    getMorphologicalSubtype
} from "@detail-core";
import { TAB_KEY, TAB_LABEL } from "./tab-keys.js";
import {GRAMMAR_KEYS} from "@utilities";

/**
 * Renders tabs for the specified inflection table and attaches interaction logic.
 *
 * @param {Object} inflectionTable - The table containing inflection data to be displayed in tabs.
 * @param {Function} onChange - Callback function invoked when a tab changes. Receives the active tab voice and gender as arguments.
 * @return {void} This function does not return a value.
 */
export function renderTabs(inflectionTable, onChange) {
    const container = document.querySelector("#inflections-container");
    container.replaceChildren();

    const tabsWrapper = createTabsWrapper();

    wireTabs(tabsWrapper, inflectionTable, onChange);
    container.append(tabsWrapper);
    onChange(getActiveTabVoice(), getActiveTabGender());
}

/**
 * Creates the complete tabs wrapper with voice and gender tab rows
 * @returns {HTMLElement} The tabs wrapper element
 */
export function createTabsWrapper() {
    const tabsWrapper = document.createElement("div");
    tabsWrapper.className = "conjugation-tabs-wrapper";
    tabsWrapper.id = "conjugation-tabs";

    const voiceTabRow = createVoiceTabRow();
    const genderTabRow = createGenderTabRow();

    tabsWrapper.append(voiceTabRow);
    tabsWrapper.append(genderTabRow);

    return tabsWrapper;
}

/**
 * Creates the voice tab row with all voice tabs
 * @returns {HTMLElement} The voice tab row element
 */
export function createVoiceTabRow() {
    const voiceTabRow = document.createElement("div");
    voiceTabRow.className = "tab-row voice-tabs";

    const voiceTabIds = [TAB_KEY.ACTIVE, TAB_KEY.PASSIVE, TAB_KEY.PARTICIPLE];
    const morphologicalSubtype = getMorphologicalSubtype();
    const isDeponent = morphologicalSubtype === GRAMMAR_KEYS.DEPONENT;

    for (const tabId of voiceTabIds) {
        const isPassiveTab = tabId === TAB_KEY.PASSIVE;
        const isDisabled = isDeponent && isPassiveTab;
        const isActive = !isDisabled && getActiveTabVoice() === tabId;

        const tabElement = createTabElement(tabId, 'voice', isActive, isDisabled);
        voiceTabRow.append(tabElement);
    }

    return voiceTabRow;
}

/**
 * Creates the gender tab row with all gender tabs
 * @returns {HTMLElement} The gender tab row element
 */
export function createGenderTabRow() {
    const genderTabRow = document.createElement("div");
    genderTabRow.className = "tab-row gender-tabs";

    const genderTabIds = [TAB_KEY.MASCULINE, TAB_KEY.FEMININE, TAB_KEY.NEUTER];

    for (const tabId of genderTabIds) {
        const isActive = getActiveTabGender() === tabId;
        const tabElement = createTabElement(tabId, 'gender', isActive, false);
        genderTabRow.append(tabElement);
    }

    return genderTabRow;
}

/**
 * Creates a single tab element with appropriate styling and attributes
 * @param {string} tabId - The tab identifier
 * @param {string} tabGroup - The tab group (voice or gender)
 * @param {boolean} isActive - Whether this tab should be active
 * @param {boolean} isDisabled - Whether this tab should be disabled
 * @returns {HTMLElement} The created tab element
 */
export function createTabElement(tabId, tabGroup, isActive, isDisabled) {
    const tabElement = document.createElement("div");

    // Add base class
    tabElement.classList.add('tab-item');

    // Add conditional classes
    if (isActive && !isDisabled) {
        tabElement.classList.add('is-active');
    }

    if (isDisabled) {
        tabElement.classList.add('is-disabled');
        tabElement.setAttribute('aria-disabled', 'true');
        tabElement.setAttribute('title', 'Not available for deponent verbs');
    }

    tabElement.textContent = TAB_LABEL[tabId];
    tabElement.dataset.tabGroup = tabGroup;
    tabElement.dataset.tabId = tabId;

    return tabElement;
}

export function wireTabs( tabsContainerElement, inflectionTable, onChange) {

    tabsContainerElement.addEventListener("click", (event) => {
        const tabElement = event.target.closest(".tab-item");
        if (!tabElement) {
            return;
        }

        // Check if tab is disabled
        if (tabElement.classList.contains('is-disabled')) {
            return;
        }

        const tabId = tabElement.dataset.tabId;        // individual tab id (active, passive, etc.)
        const tabGroup = tabElement.dataset.tabGroup;    // tab-row type (voice, gender)

        if (!tabId || !tabGroup) {
            return;
        }

        // prevent useless re-renders (check per group)
        if (tabGroup === "voice" && getActiveTabVoice() === tabId) {
            return;
        }
        if (tabGroup === "gender" && getActiveTabGender() === tabId) {
            return;
        }

        if(tabGroup === "voice"){
            setActiveTabVoice(tabId);
            updateTabUI(tabsContainerElement, tabGroup, tabId);
            onChange?.(tabId, getActiveTabGender());
        } else {
            setActiveTabGender(tabId);
            updateTabUI(tabsContainerElement, tabGroup, tabId);
            onChange?.(getActiveTabVoice(), tabId);
        }
    });

}
// Update tabs within the same row (voice row, gender row, etc.)
export function updateTabUI(container, tabGroup, activeId) {
    for (const element of container.querySelectorAll(`.tab-item[data-tab-group="${tabGroup}"]`)) {
        const shouldBeActive = element.dataset.tabId === activeId && !element.classList.contains('is-disabled');
        element.classList.toggle("is-active", shouldBeActive);
    }
}
