import "./styles/index.css";
import {QUERY_CHAR_MIN, AUTOCOMPLETE_DEBOUNCE_MS, STATUS_TOAST_DURATION, StatusMessageType} from "@utilities/constants"
import {fetchWordSuggestions} from "@api";
import {handleWordLookup} from  "@search";
import {prepareSuggestionItems} from "@search";
import {validateSearchQueryLength} from "@search";
import {transformWordSuggestionData} from  "@search";
import {handleLoadWordDetail} from "@detail";
import {Router} from "@services/router.js"

// INITIALIZE ROUTER
Router.init();

const isSuffixSearch = document.querySelector("#suffix-search");
const wordLookupInput = document.querySelector("#word-lookup-input");
const wordSuggestionsBox = document.querySelector("#word-suggestions");
wordSuggestionsBox.style.display = "none";

// LOAD THEME FROM HTML
document.documentElement.dataset.theme = "bronze";

// Debouncing and race condition state
let debounceTimer;
let currentRequestId = 0;

// CLEAR AUTOCOMPLETE ON PAGE LOAD
function hideSuggestions() {
    wordSuggestionsBox.style.display = "none";
    wordSuggestionsBox.replaceChildren();
    // Reset any inline size overrides so next open starts clean
    wordSuggestionsBox.style.height = "";
    wordSuggestionsBox.style.maxHeight = "";
    wordSuggestionsBox.style.overflowY = "";
    // Reflect collapsed state for a11y
    wordLookupInput.setAttribute("aria-expanded", "false");
}

/**
 * SEARCH INPUT EVENT HANDLER
 *
 * Clears any previous suggestions and, if the input has at least the minimum
 * number of characters (`queryCharMin`), fetches autocomplete suggestions
 * from the backend and displays them in a dropdown.
 *
 * If the fetch fails, logs the error and updates the status bar.
 */
wordLookupInput.addEventListener("input", async () => {
    const searchWord = wordLookupInput.value;
    const query = validateSearchQueryLength(searchWord, QUERY_CHAR_MIN);

    // Clear any pending debounce
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }

    if (!query) {
        hideSuggestions();
        return;
    }
    debounceTimer = setTimeout(async () => {
        // race condition tracking
        const requestId = ++currentRequestId;

        // Clear while loading
        wordSuggestionsBox.replaceChildren();

        const result = await handleWordLookup(query, fetchWordSuggestions, isSuffixSearch.checked);

        // Ignore stale responses
        if (requestId !== currentRequestId) {
            return;
        }

        if (result.status === "success") {
            // Hide if success but empty suggestions
            if (!result.data || result.data.length === 0) {
                hideSuggestions();
                return;
            }
            buildWordSuggestionBox(result.data, searchWord);
            wordLookupInput.setAttribute("aria-expanded", "true");
        } else {
            hideSuggestions();
            setStatus(result.message);
        }
    }, AUTOCOMPLETE_DEBOUNCE_MS);
});

/**
 * ESCAPE KEY HANDLER
 *
 * Hides the word suggestions dropdown when the escape key is pressed.
 */
wordLookupInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        hideSuggestions();
    }
});

/**
 * Hides the word suggestions dropdown when the user clicks outside the input field.
 * Ensures the suggestion box disappears when focus moves away from the search input.
 */
document.addEventListener("click", (event) => {
    if (!wordLookupInput.contains(event.target) && event.target !== wordLookupInput) {
        hideSuggestions();
    }
});

/**
 * Builds the word suggestions dropdown based on the provided data.
 * @param rawSuggestions
 * @param searchInput
 */
function buildWordSuggestionBox(rawSuggestions, searchInput) {
    const suggestionItems = transformWordSuggestionData(rawSuggestions);
    const preparedItems = prepareSuggestionItems(suggestionItems, searchInput);

    renderWordSuggestionBox(
        preparedItems,
        wordSuggestionsBox,
        handleLoadWordDetail,
    );
}

/**
 * Renders the autocomplete suggestions as a drop-down.
 * @param preparedItems
 * @param wordSuggestionsBox
 * @param handleLoadWordDetail
 */
export function renderWordSuggestionBox(
    preparedItems,
    wordSuggestionsBox,
    handleLoadWordDetail,
) {
    if (!preparedItems || preparedItems.length === 0) {
        hideSuggestions();
        return;
    }

    wordSuggestionsBox.style.display = "block";

   // Build the drop-down list
    for (const {word, lexemeId, display, highlight, showInflection} of preparedItems) {
        const item = document.createElement("div");
        if (highlight) {
            item.classList.add("suggestion-highlight");
        }

        // Show inflection prefix if needed
        item.textContent = showInflection ? `${word}: ${display}` : display;

        // Add 'load detail on click' to each suggestion item.
        item.addEventListener("click", async () => {
            hideSuggestions();
            try {
                await handleLoadWordDetail(word, lexemeId);
            } catch (error) {
                const message = error && typeof error === "object" && "message" in error
                    ? error.message : "There was a problem loading details.";
                setStatus(message);
            }
        });

        wordSuggestionsBox.append(item);
    }

    // After rendering items, snap the dropdown height to full rows
    // so the last item is never cut off mid-row.
    requestAnimationFrame(() => {
        const children = [...wordSuggestionsBox.children];
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

function showToast(message, type = StatusMessageType.ERROR, duration = STATUS_TOAST_DURATION) {
    const toast = document.querySelector("#toast");
    // Set the text of the toast
    toast.textContent = message;
    // Apply the appropriate type class (info, success, or error)
    toast.className = `toast show ${type}`;

    // Automatically hide the toast after the specified duration
    setTimeout(() => {
        toast.className = "toast"; // Reset it to hidden state
    }, duration);
}
