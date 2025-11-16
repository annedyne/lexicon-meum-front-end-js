const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getLexemeDetailUri = (lexemeId) =>
  `${API_BASE_URL}/lexemes/${lexemeId}/detail`;

export const SEARCH_URI = `${API_BASE_URL}/lexemes/autocomplete/`;
export const PREFIX_URI = "prefix?prefix=";
export const SUFFIX_URI = "suffix?suffix=";

/**
 * Fetches word details from the backend API.
 *
 * Constructs the appropriate URI using the provided word's lexeme ID,
 * sends a GET request, parses the JSON response, and returns it.
 *
 * @param  {string} selectedForm - The word form selected for search
 * @param  {string} lexemeId lexeme ID used to build the declension detail request URI.
 * @returns {Promise<any>} The parsed JSON data representing the word's declension details.
 */
export async function fetchWordDetailData(selectedForm, lexemeId) {
  try {
    const uri = getLexemeDetailUri(lexemeId);
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`HTTP Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    const loggingPrefix = `Failed to fetch data for ${selectedForm}`;
    logFetchError(loggingPrefix, error);
    error.message = `Failed to fetch ${selectedForm} details: ${error.message}`;
    throw error;
  }
}

/**
 * Fetches auto-complete suggestions for word search input
 * @param query
 * @returns {Promise<any>}
 */
export async function fetchWordSuggestions(query, isSuffixSearch) {
  const subAPI = isSuffixSearch ? SUFFIX_URI : PREFIX_URI;
  const uri = SEARCH_URI + subAPI + encodeURIComponent(query);
  try {
    const res = await fetch(uri);
    if (!res.ok) {
      throw new Error(`HTTP Status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    logFetchError(`suggestion: ${query}`, error);
    throw error;
  }
}

function logFetchError(query, error) {
  const errorMessage = `Failed to fetch data${query ? ` for ${query}` : ""}`;
  console.error(errorMessage, error);
}
