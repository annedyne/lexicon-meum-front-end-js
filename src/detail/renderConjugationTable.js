import {getSearchInput} from "./searchContext.js";
import { matchesInflection} from "./renderUtils.js";

export function renderConjugationTable(conjugations, voice) {

    const container = document.getElementById("inflections-container");
    container.replaceChildren();

    if (!Array.isArray(conjugations) || conjugations.length === 0) {
        return;
    }

    const activeMoods = conjugations.filter((d) => d?.voice === voice);
    if (!activeMoods.length) {
        // Nothing to render for this voice
        return;
    }

    const table = document.createElement("table");
    table.classList.add("latin-table");
    table.id = "conjugation-table";
    container.appendChild(table);

    // Create header row that spans both columns
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headerCell = document.createElement("th");
    headerCell.colSpan = 2;
    headerCell.className = "header";
    headerCell.textContent = `${voice}`;
    headerRow.appendChild(headerCell);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    activeMoods.forEach(buildRows);

}
function buildRows(data) {
    const searchInput = getSearchInput();
    const mood = data?.mood ?? "";
    const tenses = Array.isArray(data?.tenses) ? data.tenses : [];

    // No tenses to render for this mood; skip safely
    if (tenses.length === 0) return;

    // Table body with tenses in pairs
    const tbody = document.createElement("tbody");

    for (let i = 0; i < tenses.length; i += 2) {
        const left = tenses[i];
        const right = tenses[i + 1]; // can be undefined if odd count

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
        const leftLen = Array.isArray(left?.forms) ? left.forms.length : 0;
        const rightLen = Array.isArray(right?.forms) ? right.forms.length : 0;
        const maxRows = Math.max(leftLen, rightLen);

        // Build one row per form index
        for (let j = 0; j < maxRows; j++) {
            const formRow = tbody.insertRow();
            const leftForm = left?.forms?.[j] ?? "";   // pad if undefined
            const rightForm = right?.forms?.[j] ?? ""; // pad if no right tense

            const leftCell = formRow.insertCell();
            leftCell.innerHTML = leftForm;
            // Highlight if matches search input
            if (matchesInflection(leftForm, searchInput)) {
                leftCell.classList.add("inflection-match-highlight");
            }

            const rightCell = formRow.insertCell();
            rightCell.innerHTML = rightForm;
            // Highlight if matches search input
            if ( matchesInflection(rightForm, searchInput)) {
                rightCell.classList.add("inflection-match-highlight");
            }
        }

    }
    const table = document.getElementById("conjugation-table");
    if (table) {
        table.appendChild(tbody);
    }

}
