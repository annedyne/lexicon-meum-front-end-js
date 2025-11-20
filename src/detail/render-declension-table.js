import { getSearchInput } from "./search-context.js";
import { capitalize, matchesInflection } from "./render-utilities.js"


export function renderDeclensionTable(declensions) {
    const searchInput = getSearchInput();

    // Replace existing content
    const container = document.querySelector("#inflections-container");
    container.replaceChildren();

    //only render this table if this is declension data
    if (!declensions?.SINGULAR || !declensions?.PLURAL) {
      return;
    }

    const tableData = declensions;
    const cases = Object.keys(tableData.SINGULAR); // Assume both singular and plural have same cases

    const table = document.createElement("table");
    table.classList.add("latin-table", "declension-table");

    // Create the table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    for (const heading of ["Case", "Singular", "Plural"]) {
        const th = document.createElement("th");
        th.textContent = heading;
        headerRow.append(th);
    }
    thead.append(headerRow);
    table.append(thead);

    // Create table body
    const tbody = document.createElement("tbody");

    for (const c of cases) {
    const row = document.createElement("tr");

        const caseCell = document.createElement("td");
        caseCell.textContent = capitalize(c.toLowerCase());
        row.append(caseCell);

        const singularValue = tableData.SINGULAR[c] || "";
        const singularCell = document.createElement("td");
        
        // Highlight if matches search input
        if (matchesInflection(singularValue, searchInput)) {
            singularCell.classList.add("inflection-match-highlight");
        }
        singularCell.textContent = singularValue;
        row.append(singularCell);

        const pluralValue = tableData.PLURAL[c] || "";
        const pluralCell = document.createElement("td");
        
        // Highlight if matches search input
        if (matchesInflection(pluralValue, searchInput)) {
            pluralCell.classList.add("inflection-match-highlight");
        }
        pluralCell.textContent = pluralValue;
        row.append(pluralCell);

        tbody.append(row);
    }
    table.append(tbody);

    container.append(table);
}