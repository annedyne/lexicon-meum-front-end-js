import "./styles/index.css";
import { QUERY_CHAR_MIN } from "./utils/constants.js";
import { StatusMessageType } from "./utils/constants.js";
import { fetchWordSuggestions } from "./api/apiClient.js";
import { handleWordLookup } from "./search/handleWordLookup.js";
import { validateSearchQueryLength } from "./search/validate.js";
import { transformWordSuggestionData } from "./search/transformWordSuggestionData.js";
import { handleLoadWordDetail } from "./detail/handleLoadWordDetail.js";

const isSuffixSearch = document.getElementById("suffix-search");
const wordLookupInput = document.getElementById("word-lookup-input");
const wordSuggestionsBox = document.getElementById("word-suggestions");
wordSuggestionsBox.style.display = "none";
document.documentElement.setAttribute("data-theme", "bronze");

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
  const query = validateSearchQueryLength(wordLookupInput.value, QUERY_CHAR_MIN);
  if (!query) return;

  wordSuggestionsBox.innerHTML = "";

  const result = await handleWordLookup(query, fetchWordSuggestions, isSuffixSearch.checked);

  if (result.status === "success") {
    buildWordSuggestionBox(result.data);
  } else {
    setStatus(result.message);
  }
});

/**
 * Builds and displays a word suggestion box based on a list of words.
 *
 * @param {string[]} words - The list of words to generate suggestions from.
 * @return {void} This function does not return a value.
 */
function buildWordSuggestionBox(rawSuggestions) {
  const suggestionItems = transformWordSuggestionData(rawSuggestions);
  renderWordSuggestionBox(
    suggestionItems,
    wordSuggestionsBox,
    handleLoadWordDetail,
  );
}

/**
 * Renders a suggestion box containing word suggestions and adds a selection handler to each.
 *
 * @param {Array<{word: string, lexemeId: string, suggestion: string}>} suggestionItems
 *        An array of suggestion objects, each containing the word, lexeme ID, and the suggestion text.
 * @param {HTMLElement} wordSuggestionsBox
 *        The DOM element representing the container where the suggestions will be rendered.
 * @param {Function} handleLoadWordDetail
 *        A callback function to execute when a suggestion is selected. Receives the word and lexeme ID as arguments.
 * @return {void}
 *        Does not return a value; operates directly on the provided DOM elements.
 */
export function renderWordSuggestionBox(
  suggestionItems,
  wordSuggestionsBox,
  handleLoadWordDetail,
) {
  wordSuggestionsBox.style.display = "block";
  suggestionItems.forEach(({ word, lexemeId, suggestion }) => {
    const item = document.createElement("div");
    item.textContent = suggestion;

    item.addEventListener("click", async () => {
    wordSuggestionsBox.innerHTML = "";
    try {
        await handleLoadWordDetail(word, lexemeId);
      } catch (e) {
        const message = e && typeof e === "object" && "message" in e
            ? e.message : "There was a problem loading details.";
        setStatus(message);
        }
    });

    wordSuggestionsBox.appendChild(item);
  });
    }

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
 * Updates the status display in the UI with the provided message.
 *
 * Intended for communicating errors or status updates to the user,
 * typically during asynchronous operations like fetching word data.
 *
 * @param {string} message - The text message to display in the status display component.
 */
function setStatus(message) {
  if (message) {
    showToast(message);
  }
}

function showToast(message, type = StatusMessageType.ERROR, duration = 3000) {
  const toast = document.getElementById("toast");
  // Set the text of the toast
  toast.textContent = message;
  // Apply the appropriate type class (info, success, or error)
  toast.className = `toast show ${type}`;

  // Automatically hide the toast after the specified duration
  setTimeout(() => {
    toast.className = "toast"; // Reset it to hidden state
  }, duration);
}
