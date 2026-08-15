const state = {
    selectedSuggestionIndex: 0,
};

export const setSelectedSuggestionIndex = (index) => {
    state.selectedSuggestionIndex = index;
};

export const getSelectedSuggestionIndex = () => {
    return state.selectedSuggestionIndex;
};

export const resetSelectedSuggestionIndex = () => {
    state.selectedSuggestionIndex = 0;
};
