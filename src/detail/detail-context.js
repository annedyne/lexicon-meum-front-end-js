import { TAB_KEY } from "./verb/tabs/tab-keys.js";


const state = {
    lexemeId: undefined,
    searchInput: undefined,
    detailData: undefined,
    activeTab: {voice: TAB_KEY.ACTIVE, gender: TAB_KEY.MASCULINE},
};

export const setActiveTabVoice = (voice) => {
    state.activeTab.voice = voice;
};

export const getActiveTabVoice = () => {
    return state.activeTab.voice;
};

export const setActiveTabGender = (gender) => {
    state.activeTab.gender = gender;
};

export const getActiveTabGender = () => {
    return state.activeTab.gender;
};

export const setSearchInputContext = (searchInput) => {
    state.searchInput = searchInput;
};

export const getSearchInput = () => {
    return state.searchInput;
};

export const clearSearchInput = () => {
    state.searchInput = undefined;
};