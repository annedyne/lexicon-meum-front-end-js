import { QUERY_CHAR_MIN } from './constants.js';
import {DECLENSION_DETAIL_URI, CONJUGATION_DETAIL_URI, SEARCH_URI, PREFIX_URI, SUFFIX_URI } from './api.js';

import {renderDeclensionTable} from "./renderDeclensionTable.js"
import {renderConjugationTable} from "./renderConjugationTable.js"
import {renderPrincipalParts} from "./renderPrincipalParts.js";
import {renderDefinitions} from "./renderDefinitions.js";


const isSuffixSearch = document.getElementById("suffix-search")
const statusBar = document.getElementById("status-bar")
const wordLookupInput = document.getElementById("word-lookup-input");
const wordSuggestionsBox = document.getElementById("word-suggestions");
wordSuggestionsBox.style.display = "none";

/**
 * Handles user input in the word search field.
 *
 * Clears any previous suggestions and, if the input has at least the minimum
 * number of characters (`queryCharMin`), fetches autocomplete suggestions
 * from the backend and displays them in a dropdown.
 *
 * If the fetch fails, logs the error and updates the status bar.
 */
wordLookupInput.addEventListener("input", async () => {
    const query = wordLookupInput.value.trim();
    wordSuggestionsBox.innerHTML = "";

    // wait for at least 2 letters before fetching suggestions
    if (query.length < QUERY_CHAR_MIN) return;

    try {
        let words = await fetchWordSuggestions(query);
        console.log(words);
        if (Array.isArray(words) && words.length > 0) {
            buildWordSuggestionBox(words);
        }
    } catch (err) {
        let message = "Error fetching suggestions: ";
        console.error(message, err);
        setStatus(message + query);
    }
});

/**
 * Hides the word suggestions dropdown when the user clicks outside the input field.
 * Ensures the suggestion box disappears when focus moves away from the search input.
 */
document.addEventListener("click", (e) => {
    if (!wordLookupInput.contains(e.target) && e.target !== wordLookupInput) {
        wordSuggestionsBox.style.display = "none";
    }
});

/**
 * Fetches auto-complete suggestions for word search input
 * @param query
 * @returns {Promise<any>}
 */
async function fetchWordSuggestions(query){
    const subAPI = isSuffixSearch.checked ? SUFFIX_URI : PREFIX_URI
    const uri = SEARCH_URI + subAPI + encodeURIComponent(query);
    const res = await fetch( uri);
    return await res.json();
}

/**
 * Displays a dropdown of word suggestions below the search input.
 *
 * Given a list of word suggestion objects (each containing `word`, `lexemeId`,
 * and `grammaticalPosition`), this function renders them as clickable items
 * in the suggestion box. Selecting a suggestion clears the dropdown and
 * triggers the display of the corresponding word's detailed table.
 *
 * @param {Array<Object>} words - List of suggestion objects with `word`, `lexemeId`, and `grammaticalPosition` fields.
 */
function buildWordSuggestionBox(words){
    wordSuggestionsBox.style.display = "block"
    words.forEach(wordObj => {

        const { word, lexemeId, grammaticalPosition } = wordObj;
        const item = document.createElement("div");

        console.log("lemma: " + word);
        item.textContent = word;
        item.addEventListener("click", () => {
            wordSuggestionsBox.innerHTML = ""; // hide suggestions
            buildWordDetailTable(word, lexemeId, grammaticalPosition);
        });
        wordSuggestionsBox.appendChild(item);
    });
}


/**
 * Fetches and displays the full inflection table for a selected word.
 *
 * Routes the request based on the word’s grammatical position (e.g., NOUN, VERB)
 * to the appropriate data-fetching and rendering logic:
 *
 * If the position is unrecognized, no action is taken (or can be handled in the future).
 *
 * Errors encountered during data retrieval are logged and displayed in the UI status element.
 *
 * @param {string} lemma - The base form of the word (used for logging/status).
 * @param {string} lexemeId - Unique identifier used to fetch detailed word data.
 * @param {string} grammaticalPosition - Part of speech (e.g., "NOUN", "VERB", etc.) used to determine routing logic.
 */
async function buildWordDetailTable(lemma, lexemeId, grammaticalPosition ){
    try {
        if(grammaticalPosition === "NOUN"){
            console.log(lemma);
            let wordDetailData = await fetchWordDetailData(lexemeId);

            if (wordDetailData) {

                const { principalParts, definitions } = wordDetailData;

                renderPrincipalParts(principalParts, definitions);
                renderDefinitions(definitions);
                renderDeclensionTable(wordDetailData);
            }
        }
        else if(grammaticalPosition === "VERB"){
            let wordDetailData = await fetchConjugationDetailData(lexemeId);
            if (wordDetailData) {
                const {  principalParts, definitions } = wordDetailData;
                renderPrincipalParts(principalParts);
                renderDefinitions(definitions);
                renderConjugationTable(wordDetailData, "ACTIVE");
            }

        }

    } catch (err) {
        let message = "Error fetching suggestions: ";
        console.error(message, err);
        setStatus(message + lemma);
    }
}


/**
* Fetches detailed declension data for a noun from the backend API.
*
* Constructs the appropriate URI using the provided word's lexeme ID,
* sends a GET request, parses the JSON response, and returns it.
*
* @param {string} word - The word or lexeme ID used to build the declension detail request URI.
* @returns {Promise<Object>} - The parsed JSON data representing the word's declension details.
*/
async function fetchWordDetailData(word) {

    const uri = DECLENSION_DETAIL_URI + encodeURIComponent(word);
    const res = await fetch(uri);
    let jsn = await res.json();
    console.log(jsn);
    return jsn;
}

/**
 * Fetches detailed conjugation data for a verb from the backend API.
 *
 * Constructs the appropriate URI using the provided word's lexeme ID,
 * sends a GET request, parses the JSON response, and returns it.
 *
 * @param {string} word - The word or lexeme ID used to build the conjugation detail request URI.
 * @returns {Promise<Object>} - The parsed JSON data representing the word's conjugation details.
 */
async function fetchConjugationDetailData(word) {

    const uri = CONJUGATION_DETAIL_URI + encodeURIComponent(word);
    const res = await fetch(uri);
    let jsn = await res.json();
    console.log(jsn);
    return jsn;
}

/**
 * Updates the status bar in the UI with the provided message.
 *
 * Intended for communicating errors or status updates to the user,
 * typically during asynchronous operations like fetching word data.
 *
 * @param {string} message - The text message to display in the status bar.
 */
function setStatus(message){
    statusBar.textContent = message;
}



