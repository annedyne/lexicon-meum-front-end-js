import { getActiveTabVoice, setActiveTabVoice, getActiveTabGender, setActiveTabGender } from "@detail-core";
import { TAB_KEY, TAB_LABEL } from "./tab-keys.js";

export function renderTabs(inflectionTable, onChange) {

    const container = document.querySelector("#inflections-container");
    container.replaceChildren();

    const tabsWrapper = document.createElement("div");
    tabsWrapper.className = "conjugation-tabs-wrapper";

    // Top row - Voice tabs
    const voiceRow = document.createElement("div");
    voiceRow.className = "tab-row voice-tabs";

    const voiceTabs = [TAB_KEY.ACTIVE, TAB_KEY.PASSIVE, TAB_KEY.PARTICIPLE];

    for (const tab of voiceTabs) {

        const tabElement = document.createElement("div");
        // set tab to active style if it matches the active tab state
        tabElement.className = `tab-item ${getActiveTabVoice() === tab ? 'is-active' : ''}`;
        tabElement.textContent = TAB_LABEL[tab];
        tabElement.dataset.tabGroup = 'voice';
        tabElement.dataset.tabId = tab;
        voiceRow.append(tabElement);
    }

    // Bottom row - Gender tabs
    const genderRow = document.createElement("div");
    genderRow.className = "tab-row gender-tabs";

    const genderTabs = [TAB_KEY.MASCULINE, TAB_KEY.FEMININE, TAB_KEY.NEUTER];

    for (const tab of genderTabs) {
        const tabElement = document.createElement("div");
        // set tab to active style if it matches the active tab state
        tabElement.className = `tab-item ${ getActiveTabGender() === tab ? 'is-active' : ''}`;
        tabElement.textContent = TAB_LABEL[tab];
        tabElement.dataset.tabGroup = 'gender';
        tabElement.dataset.tabId = tab;
        genderRow.append(tabElement);
    }

    tabsWrapper.append(voiceRow);
    tabsWrapper.append(genderRow);
    wireTabs(tabsWrapper, inflectionTable, onChange);
    container.append(tabsWrapper);
    onChange(getActiveTabVoice(), getActiveTabGender())
}

function wireTabs( tabsContainerElement, inflectionTable, onChange) {

    tabsContainerElement.addEventListener("click", (event) => {
        const tabElement = event.target.closest(".tab-item");
        if (!tabElement) {
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
function updateTabUI(container, tabGroup, activeId) {
    for (const element of container.querySelectorAll(`.tab-item[data-tab-group="${tabGroup}"]`)) {
        element.classList.toggle("is-active", element.dataset.tabId === activeId);
    }
}