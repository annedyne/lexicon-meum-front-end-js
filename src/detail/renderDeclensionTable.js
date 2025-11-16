import { getSearchInput } from "./searchContext.js";
import { capitalize, matchesInflection } from "./renderUtils.js"


export function renderDeclensionTable(declensions) {
    const searchInput = getSearchInput();

    // Replace existing content
    const container = document.getElementById("inflections-container");
    container.replaceChildren();

    //only render this table if this is declension data
    if (!declensions?.SINGULAR || !declensions?.PLURAL) {
      return;
    }

    const tableData = declensions;
    const cases = Object.keys(tableData.SINGULAR); // Assume both singular and plural have same cases

    const table = document.createElement("table");
    table.classList.add("latin-table");
    table.classList.add("declension-table");

    // Create the table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Case", "Singular", "Plural"].forEach((heading) => {
        const th = document.createElement("th");
        th.textContent = heading;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement("tbody");

    cases.forEach((c) => {
    const row = document.createElement("tr");

        const caseCell = document.createElement("td");
        caseCell.textContent = capitalize(c.toLowerCase());
        row.appendChild(caseCell);

        const singularValue = tableData.SINGULAR[c] || "";
        const singularCell = document.createElement("td");
        
        // Highlight if matches search input
        if (matchesInflection(singularValue, searchInput)) {
            singularCell.classList.add("inflection-match-highlight");
        }
        singularCell.textContent = singularValue;
        row.appendChild(singularCell);

        const pluralValue = tableData.PLURAL[c] || "";
        const pluralCell = document.createElement("td");
        
        // Highlight if matches search input
        if (matchesInflection(pluralValue, searchInput)) {
            pluralCell.classList.add("inflection-match-highlight");
        }
        pluralCell.textContent = pluralValue;
        row.appendChild(pluralCell);

        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    container.appendChild(table);
}