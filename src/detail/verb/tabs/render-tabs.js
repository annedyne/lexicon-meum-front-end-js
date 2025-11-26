import { getActiveTabVoice, setActiveTabVoice, getActiveTabGender, setActiveTabGender } from "@detail-core";
import { TAB_KEY, TAB_LABEL } from "./tab-keys.js";

export function renderTabs(conjugations, onChange) {

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
        tabElement.dataset.tabType = 'voice';
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
        tabElement.dataset.tabType = 'gender';
        tabElement.dataset.tabId = tab;
        genderRow.append(tabElement);
    }

    tabsWrapper.append(voiceRow);
    tabsWrapper.append(genderRow);
    wireTabs(tabsWrapper, conjugations, onChange);
    container.append(tabsWrapper);
    onChange(getActiveTabVoice(), getActiveTabGender())
}

function wireTabs( tabsContainerElement, conjugations, onChange) {

    tabsContainerElement.addEventListener("click", (event) => {
        const tabElement = event.target.closest(".tab-item");
        if (!tabElement) {
            return;
        }

        const tabId = tabElement.dataset.tabId;        // individual tab id (active, passive, etc.)
        const tabType = tabElement.dataset.tabType;    // tab-row type (voice, gender)

        if (!tabId || !tabType) {
            return;
        }

        // prevent useless re-renders (check per group)
        if (tabType === "voice" && getActiveTabVoice() === tabId) {
            return;
        }
        if (tabType === "gender" && getActiveTabGender() === tabId) {
            return;
        }

        if(tabType === "voice"){
            setActiveTabVoice(tabId);
            updateTabUI(tabsContainerElement, tabType, tabId);
            onChange?.(tabId, getActiveTabGender());
        } else {
            setActiveTabGender(tabId);
            updateTabUI(tabsContainerElement, tabType, tabId);
            onChange?.(getActiveTabVoice(), tabId);
        }
    });

}
// Only update tabs within the same group (voice, gender, etc.)
function updateTabUI(container, group, activeId) {
    for (const element of container.querySelectorAll(`.tab-item[data-tab-type="${group}"]`)) {
        element.classList.toggle("is-active", element.dataset.tabId === activeId);
    }
}