import {getSearchInput} from "@detail/detail-context.js";
import {highlightMatch, matchesInflection} from "@detail/utilities.js";
import {CSS_CLASSES} from "@utilities";
import {buildConjugationViewModel} from "./build-conjugation-view-model.js";

/**
 * Renders the conjugation table for a single voice. Data-shape and gender/voice
 * decisions live in the view-model builder; this function only lays the resolved
 * tenses out as a two-column table.
 *
 * @param {Object[]} conjugations - Mood sections from the detail response
 * @param {string} gender - Active gender tab key
 * @param {string} voice - Voice tab key to render (e.g. TAB_KEY.ACTIVE)
 * @param {string} tableClassName - Voice-specific CSS class for the table
 * @return {void}
 */
export function renderConjugationByVoice(conjugations, gender, voice, tableClassName) {
    const container = document.querySelector("#inflections-container");

    const moods = buildConjugationViewModel(conjugations, gender, voice);
    if (moods.length === 0) {
        console.warn("No active conjugations found");
        return;
    }

    const table = document.createElement("table");
    table.classList.add(CSS_CLASSES.INFLECTION_TABLE, tableClassName);
    table.id = "conjugation-table"; // So it can be referenced by other tab operations
    container.append(table);

    const searchInput = getSearchInput();
    for (const mood of moods) {
        table.append(buildMoodTbody(mood, searchInput));
    }
}

/**
 * Builds a tbody for one mood, laying its resolved tenses out in pairs of columns.
 *
 * @param {Object} mood - Mood view-model with resolved tenses
 * @param {string} searchInput - Current search input, for match highlighting
 * @return {HTMLTableSectionElement}
 */
function buildMoodTbody(mood, searchInput) {
    const tbody = document.createElement("tbody");

    // Lay two tenses side by side per header/form-row group; right may be undefined on an odd count.
    for (let index = 0; index < mood.tenses.length; index += 2) {
        const left = mood.tenses[index];
        const right = mood.tenses[index + 1];
        appendHeaderRow(tbody, left, right);
        appendFormRows(tbody, left, right, searchInput);
    }
    return tbody;
}

function appendHeaderRow(tbody, left, right) {
    const headerRow = tbody.insertRow();
    for (const tense of [left, right]) {
        const headerCell = headerRow.insertCell();
        headerCell.className = "tense-header";
        headerCell.textContent = tense?.header ?? "";
    }
}

function appendFormRows(tbody, left, right, searchInput) {
    const leftForms = left?.forms ?? [];
    const rightForms = right?.forms ?? [];
    const maxRows = Math.max(leftForms.length, rightForms.length);

    for (let index = 0; index < maxRows; index++) {
        const formRow = tbody.insertRow();
        appendFormCell(formRow, leftForms[index] ?? "", searchInput); // pad if undefined
        appendFormCell(formRow, rightForms[index] ?? "", searchInput); // pad if no right tense
    }
}

// Renders a single form cell, highlighting it when it matches the search input.
function appendFormCell(formRow, form, searchInput) {
    const cell = formRow.insertCell();
    if (matchesInflection(form, searchInput)) {
        cell.append(highlightMatch(form));
    } else {
        cell.textContent = form;
    }
}