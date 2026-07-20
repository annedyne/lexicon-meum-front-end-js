import {getSearchInput} from "@detail/detail-context.js";
import {highlightMatch, matchesInflection} from "@detail/utilities.js";
import {CSS_CLASSES} from "@utilities";

/**
 * @typedef {Object} Tense
 * @property {string} defaultName - The default name of the tense
 * @property {string[]} [forms] - Gender-agnostic conjugated forms
 * @property {Object.<string, string[]>} [formsByGender] - Gender-specific forms keyed by lowercase gender
 */

/**
 * Resolves the forms array to display for a tense given the active gender.
 * A tense is either gender-agnostic (`forms`, shown for every gender) or
 * gender-specific (`formsByGender`, only the active gender's forms are shown).
 *
 * @param {Tense} [tense] - The tense to resolve forms for
 * @param {string} gender - Active gender tab key (e.g. TAB_KEY.MASCULINE)
 * @return {string[]} The forms to display, or an empty array when none apply
 */
function resolveForms(tense, gender) {
    if (Array.isArray(tense?.forms)) {
        return tense.forms;
    }
    const genderKey = String(gender).toLowerCase();
    return tense?.formsByGender?.[genderKey] ?? [];
}

/**
 * @typedef {Object} Conjugation
 * @property {string} voice - The voice (e.g., ACTIVE, PASSIVE)
 * @property {string} mood - The mood (e.g., INDICATIVE, SUBJUNCTIVE)
 * @property {Tense[]} tenses - Array of tenses for this mood
 */

export function renderConjugationByVoice(conjugations, gender, voice, tableClassName) {

    const container = document.querySelector("#inflections-container");


    if (!Array.isArray(conjugations) || conjugations.length === 0) {
        console.warn("No active conjugations found");
        return;
    }


    const activeMoods = conjugations.filter((d) => d?.voice === voice);
    if (activeMoods.length === 0) {
        console.warn("No active conjugations found");
        return;
    }

    const table = document.createElement("table");
    table.classList.add(CSS_CLASSES.INFLECTION_TABLE, tableClassName);
    table.id = "conjugation-table"; // So it can be referenced by other tab operations
    container.append(table);

    for (const moodSectionData of activeMoods) {
        buildRows(moodSectionData, gender);
    }
}

/**
 * Builds and appends rows of conjugation tenses and their inflections to a pre-existing table.
 * This method organizes mood-related tense forms into a tabular structure for display.
 *
 * @param {Object} moodSectionData - The data for the current mood section, containing mood details and tenses.
 * @param {string} [moodSectionData.mood] - The name of the mood for which conjugation rows are to be built.
 * @param {Object[]} [moodSectionData.tenses] - An array of tense objects, each containing tense information like names and forms.
 * @param {string} gender - Active gender tab key, used to resolve gender-specific forms.
 * @return {void} This method does not return any value.
 */
function buildRows(moodSectionData, gender) {
    const searchInput = getSearchInput();
    const mood = moodSectionData?.mood ?? "";
    const tenses = Array.isArray(moodSectionData?.tenses) ? moodSectionData.tenses : [];

    // Skip if no tenses to render for this mood;
    if (tenses.length === 0) {
        return;
    }

    // Table body with tenses in pairs
    const tbody = document.createElement("tbody");

    // for each pair of tenses, create a header row and inflection rows
    for (let index = 0; index < tenses.length; index += 2) {
        const left = tenses[index];
        const right = tenses[index + 1]; // can be undefined if odd count

        // Build header row for tense names
        const headerRow = tbody.insertRow();

        const leftHeader = headerRow.insertCell();
        leftHeader.colSpan = 1;
        leftHeader.className = "tense-header";
        leftHeader.textContent = left ? `${mood} ${left.defaultName ?? ""}` : "";

        const rightHeader = headerRow.insertCell();
        rightHeader.colSpan = 1;
        rightHeader.className = "tense-header";
        rightHeader.textContent = right ? `${mood} ${right.defaultName ?? ""}` : "";

        // Resolve the forms to display for the active gender
        const leftForms = resolveForms(left, gender);
        const rightForms = resolveForms(right, gender);

        // Compute max form count
        const maxRows = Math.max(leftForms.length, rightForms.length);

        createInflectionFormRows(maxRows, tbody, leftForms, rightForms, searchInput);
    }
    const table = document.querySelector("#conjugation-table");
    if (table) {
        table.append(tbody);
    }
}

function createInflectionFormRows(maxRows, tbody, leftForms, rightForms, searchInput) {
    // Build one row per form index
    for (let index = 0; index < maxRows; index++) {
        const formRow = tbody.insertRow();
        const leftForm = leftForms[index] ?? "";   // pad if undefined
        const rightForm = rightForms[index] ?? ""; // pad if no right tense
        const leftCell = formRow.insertCell();

        // Highlight if matches search input
        if (matchesInflection(leftForm, searchInput)) {
            leftCell.append(highlightMatch(leftForm));
        } else {
            leftCell.textContent = leftForm;
        }

        const rightCell = formRow.insertCell();
        // Highlight if matches search input
        if (matchesInflection(rightForm, searchInput)) {
            rightCell.append(highlightMatch(rightForm));
        } else {
            rightCell.textContent = rightForm;
        }
    }
}