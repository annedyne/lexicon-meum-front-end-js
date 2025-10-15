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

function hideSuggestions() {
  wordSuggestionsBox.style.display = "none";
  wordSuggestionsBox.innerHTML = "";
  // Reset any inline size overrides so next open starts clean
  wordSuggestionsBox.style.height = "";
  wordSuggestionsBox.style.maxHeight = "";
  wordSuggestionsBox.style.overflowY = "";
  // Reflect collapsed state for a11y
  wordLookupInput.setAttribute("aria-expanded", "false");
}

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
  if (!query) {
    hideSuggestions();
    return;
  }

  // Clear while loading
  wordSuggestionsBox.innerHTML = "";

  const result = await handleWordLookup(query, fetchWordSuggestions, isSuffixSearch.checked);

  if (result.status === "success") {
    // Hide if success but empty suggestions
    if (!result.data || result.data.length === 0) {
      hideSuggestions();
      return;
    }
    buildWordSuggestionBox(result.data);
    wordLookupInput.setAttribute("aria-expanded", "true");
  } else {
    hideSuggestions();
    setStatus(result.message);
  }
});

wordLookupInput.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hideSuggestions();
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
  if (!suggestionItems || suggestionItems.length === 0) {
    hideSuggestions();
    return;
  }

  wordSuggestionsBox.style.display = "block";
  suggestionItems.forEach(({ word, lexemeId, suggestion }) => {
    const item = document.createElement("div");
    item.textContent = suggestion;

    item.addEventListener("click", async () => {
      hideSuggestions();
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

  // After rendering items, snap the dropdown height to full rows
  // so the last item is never cut off mid-row.
  requestAnimationFrame(() => {
    const children = Array.from(wordSuggestionsBox.children);
    if (children.length === 0) {
      hideSuggestions();
      return;
    }

    // Measure a single row/item height
    const sample = children[0];
    const itemHeight = sample.offsetHeight || 0;

    // If we cannot measure, let the browser handle it
    if (!itemHeight) {
      wordSuggestionsBox.style.height = "auto";
      wordSuggestionsBox.style.maxHeight = "40vh";
      wordSuggestionsBox.style.overflowY = "auto";
      return;
    }

    const totalHeight = itemHeight * children.length;

    // Cap by viewport to avoid a giant dropdown; use 40% of viewport height
    const viewportCap = Math.floor(window.innerHeight * 0.4);

    // Desired height is min(total, cap), but snapped down to a whole number of rows
    const rowsFittable = Math.max(1, Math.floor(Math.min(totalHeight, viewportCap) / itemHeight));
    const snappedHeight = rowsFittable * itemHeight;

    // Apply snapped height and allow scrolling if more items exist
    wordSuggestionsBox.style.height = `${snappedHeight}px`;
    wordSuggestionsBox.style.maxHeight = `${snappedHeight}px`;
    wordSuggestionsBox.style.overflowY = totalHeight > snappedHeight ? "auto" : "hidden";
  });
}

/**
 * Hides the word suggestions dropdown when the user clicks outside the input field.
 * Ensures the suggestion box disappears when focus moves away from the search input.
 */
document.addEventListener("click", (e) => {
  if (!wordLookupInput.contains(e.target) && e.target !== wordLookupInput) {
    hideSuggestions();
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
