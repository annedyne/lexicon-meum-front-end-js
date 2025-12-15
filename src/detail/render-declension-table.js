import { getSearchInput } from "./detail-context";
import { formatCaseNameForTableRowHeader, matchesInflection} from "./utilities.js"

export function renderDeclensionTable(declensions) {

    // Replace existing content
    const container = document.querySelector("#inflections-container");
    container.replaceChildren();
    const tableElement = document.createElement("table");
    createDeclensionTable(declensions, tableElement);
    container.append(tableElement);
}

export function createDeclensionTable(declensions, tableElement) {

    //only render this table if this is declension data
    if (!declensions?.SINGULAR || !declensions?.PLURAL) {
      return;
    }

    const tableData = declensions;
    const cases = Object.keys(tableData.SINGULAR); // Assume both singular and plural have same cases

    tableElement.classList.add("inflection-table", "declension-table");
    // Create the table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    for (const heading of ["Case", "Singular", "Plural"]) {
        const th = document.createElement("th");
        th.textContent = heading;
        headerRow.append(th);
    }
    thead.append(headerRow);
    tableElement.append(thead);

    // Create table body
    const tbody = document.createElement("tbody");

    for (const caseName of cases) {
        const row = renderDeclensionRow(caseName, tableData);

        tbody.append(row);
    }
    tableElement.append(tbody);
}


function renderDeclensionRow(caseName, tableData ) {
    const row = document.createElement("tr");

    const caseCell = document.createElement("td");
    caseCell.textContent = formatCaseNameForTableRowHeader(caseName);
    row.append(caseCell);

    const singularValue = tableData.SINGULAR[caseName] || "";
    const singularCell = document.createElement("td");

    const searchInput = getSearchInput();

    // Highlight if matches search input
    if (matchesInflection(singularValue, searchInput)) {
        singularCell.classList.add("inflection-match-highlight");
    }
    singularCell.textContent = singularValue;
    row.append(singularCell);

    const pluralValue = tableData.PLURAL[caseName] || "";
    const pluralCell = document.createElement("td");

    // Highlight if matches search input
    if (matchesInflection(pluralValue, searchInput)) {
        pluralCell.classList.add("inflection-match-highlight");
    }
    pluralCell.textContent = pluralValue;
    row.append(pluralCell);
    return row;
}

