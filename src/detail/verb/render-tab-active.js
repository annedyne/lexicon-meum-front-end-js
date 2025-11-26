import {getSearchInput} from "@detail/detail-context.js";
import { matchesInflection} from "@detail/detail-utilities.js";
import { TAB_KEY } from "./tabs/tab-keys.js";

/**
 * @typedef {Object} Tense
 * @property {string} defaultName - The default name of the tense
 * @property {string[]} forms - Array of conjugated forms
 */

/**
 * @typedef {Object} Conjugation
 * @property {string} voice - The voice (e.g., ACTIVE, PASSIVE)
 * @property {string} mood - The mood (e.g., INDICATIVE, SUBJUNCTIVE)
 * @property {Tense[]} tenses - Array of tenses for this mood
 */
export function renderActiveConjugation(conjugations, gender) {
    console.log(`gender is ${gender}`);
    const container = document.querySelector("#inflections-container");
    
    // Only clear if table doesn't exist (when called from tabs, table is already cleared)
    const existingTable = container.querySelector("#conjugation-table");
    if (existingTable) {
        existingTable.remove();
    }

    if (!Array.isArray(conjugations) || conjugations.length === 0) {
        return;
    }

    const activeMoods = conjugations.filter((d) => d?.voice === TAB_KEY.ACTIVE);
    if (activeMoods.length === 0) {
        // Nothing to render for this voice
        return;
    }

    const table = document.createElement("table");
    table.classList.add("latin-table");
    table.id = "conjugation-table";
    container.append(table);

    // Create header row that spans both columns
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headerCell = document.createElement("th");
    headerCell.colSpan = 2;
    headerCell.className = "header";
    headerCell.textContent = `${TAB_KEY.ACTIVE.toLowerCase()}`;
    headerRow.append(headerCell);
    thead.append(headerRow);
    table.append(thead);

    for (const data of activeMoods) {
        buildRows(data);
    }

}

/**
 * @param {Conjugation} data - Conjugation data containing mood and tenses
 */
function buildRows(data) {
    const searchInput = getSearchInput();
    const mood = data?.mood ?? "";
    const tenses = Array.isArray(data?.tenses) ? data.tenses : [];

    // No tenses to render for this mood; skip safely
    if (tenses.length === 0) {
        return;
    }

    // Table body with tenses in pairs
    const tbody = document.createElement("tbody");

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

        // Compute max form count
        const leftLength = Array.isArray(left?.forms) ? left.forms.length : 0;
        const rightLength = Array.isArray(right?.forms) ? right.forms.length : 0;
        const maxRows = Math.max(leftLength, rightLength);

        // Build one row per form index
        for (let index = 0; index < maxRows; index++) {
            const formRow = tbody.insertRow();
            const leftForm = left?.forms?.[index] ?? "";   // pad if undefined
            const rightForm = right?.forms?.[index] ?? ""; // pad if no right tense

            const leftCell = formRow.insertCell();
            leftCell.textContent = leftForm;
            // Highlight if matches search input
            if (matchesInflection(leftForm, searchInput)) {
                leftCell.classList.add("inflection-match-highlight");
            }

            const rightCell = formRow.insertCell();
            rightCell.textContent = rightForm;
            // Highlight if matches search input
            if ( matchesInflection(rightForm, searchInput)) {
                rightCell.classList.add("inflection-match-highlight");
            }
        }

    }
    const table = document.querySelector("#conjugation-table");
    if (table) {
        table.append(tbody);
    }

}
