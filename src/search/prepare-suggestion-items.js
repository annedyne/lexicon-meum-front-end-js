/**
 * Processes and prepares suggestion items by sorting, enriching with metadata,
 * and highlighting relevant matches based on the search input.
 *
 * @param {Array<Object>} suggestionItems - An array of suggestion item objects to process.
 * @param {string} searchInput - The search input string to match against suggestion items.
 * @return {Array<Object>} - A new array of suggestion items enriched with highlighting metadata
 * and sorted for display priority.
 */
export function prepareSuggestionItems(suggestionItems, searchInput) {
    const rolledUp = rollUpMatchesToLexemes(suggestionItems, searchInput);

    rolledUp.sort((a, b) => a.display.localeCompare(b.display));

    // Enrich with highlighting metadata
    const enriched =  rolledUp.map(item => {
        const inputMatchesParent =
            item.suggestionParent.localeCompare(searchInput, undefined, { sensitivity: "base" }) === 0;
        const inputMatchesWord =
            item.word.localeCompare(searchInput, undefined, {sensitivity: "base"}) === 0;

        // Highlight if input matches parent or word
        const highlight = inputMatchesParent || inputMatchesWord;

        // If input matches the inflection but not the parent, show the inflection.
        const showInflection = !inputMatchesParent && inputMatchesWord;

        // For non-highlighted items, replace arbitrary 'word' with suggestionParent
        // to ensure canonical form is used for inflection table highlighting.
        const normalizedWord = highlight ? item.word : item.suggestionParent;

        return {
            ...item,
            word: normalizedWord,
            highlight,
            showInflection
        };
    });

    // Sort highlighted items to the top.
    enriched.sort((a, b) => {
        if (a.highlight && !b.highlight) { return -1;}
        if (!a.highlight && b.highlight) { return 1; }
        return 0;
    });

    return enriched;
}

/**
 * Aggregates matches by lexeme IDs from the provided suggestion items while ensuring
 * no duplicates are added, unless an exact match with the search input exists.
 *
 * @param {Array} suggestionItems - The list of suggestion items to filter, each containing lexemeId and word.
 * @param {string} searchInput - The search string used to ensure exact matches are preserved.
 * @return {Array} Filtered array of suggestion items, rolled up by unique lexeme IDs.
 */
function rollUpMatchesToLexemes(suggestionItems, searchInput) {

    const seen = new Set();
    return suggestionItems.filter(item => {
        // Make sure not to exclude an exact match to searchInput.
        if (seen.has(item.lexemeId) && item.word !== searchInput) {
            return false;
        } else {
            seen.add(item.lexemeId);
            return true;
        }
    });
}