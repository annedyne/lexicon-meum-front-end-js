
/**
 * Deduplicates suggestion items by lexemeId and enriches them with highlighting metadata.
 *
 * @param {Array<{word: string, lexemeId: string, suggestion: string, suggestionParent: string}>} suggestionItems
 * @param {string} searchInput - The current search input value
 * @returns {Array<{word: string, lexemeId: string, suggestion: string, suggestionParent: string, highlight: boolean, showInflection: boolean}>}
 */
export function prepareSuggestionItems(suggestionItems, searchInput) {
    // Roll individual inflections up to a single canonical parent.
    // Make sure not to exclude an exact match to searchWord.
    const seen = new Set();
    const deduped = suggestionItems.filter(item => {
        if (seen.has(item.lexemeId) && item.word !== searchInput) {
            return false;
        } else {
            seen.add(item.lexemeId);
            return true;
        }
    });

    deduped.sort((a, b) => a.suggestion.localeCompare(b.suggestion));

    // Enrich with highlighting metadata
    const enriched =  deduped.map(item => {
        const inputMatchesParent =
            item.suggestionParent.localeCompare(searchInput, undefined, { sensitivity: "base" }) === 0;
        const inputMatchesWord =
            item.word.localeCompare(searchInput, undefined, {sensitivity: "base"}) === 0;

        return {
            ...item,
            highlight: inputMatchesParent || inputMatchesWord,
            showInflection: !inputMatchesParent && inputMatchesWord
        };
    });

    // Sort highlighted items to the top
    enriched.sort((a, b) => {
        if (a.highlight && !b.highlight) { return -1;}
        if (!a.highlight && b.highlight) { return 1; }
        return 0;
    });

    return enriched;
}