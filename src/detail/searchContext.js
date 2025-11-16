/**
 * Stores the current search input to enable highlighting
 * matching inflections in detail views.
 */
let currentSearchInput = null;

/**
 * Sets the search input that triggered the current detail view.
 * @param {string|null} searchInput - The original search query
 */
export function setSearchInput(searchInput) {
    currentSearchInput = searchInput;
}

/**
 * Gets the current search input.
 * @returns {string|null} The original search query or null
 */
export function getSearchInput() {
    return currentSearchInput;
}

/**
 * Clears the search input context.
 */
export function clearSearchInput() {
    currentSearchInput = null;
}