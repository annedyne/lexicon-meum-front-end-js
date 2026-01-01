import { getSearchInput } from "./detail-context";
import {formatCaseNameForTableRowHeader, highlightMatch, matchesInflection} from "./utilities.js"

export function renderDeclensionTable(declensions) {

    // Replace existing content
    const container = document.querySelector("#inflections-container");
    container.replaceChildren();
    
    // Create a wrapper div similar to conjugation tables
    const tableWrapper = document.createElement("div");
    tableWrapper.classList.add("table-grid-container");

    const tableElement = document.createElement("table");
    tableElement.classList.add("inflection-table", "declension-table");
    createDeclensionTable(declensions, tableElement);
    
    tableWrapper.append(tableElement);
    container.append(tableWrapper);
}

export function createDeclensionTable(declensions, tableElement) {

    //only render this table if this is declension data
    if (!declensions?.SINGULAR || !declensions?.PLURAL) {
      return;
    }

    const tableData = declensions;
    const cases = Object.keys(tableData.SINGULAR); // Assume both singular and plural have same cases

    tableElement.classList.add("declension-table");
    // Create the table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const caseColHeader = document.createElement("th");

    caseColHeader.textContent = "Case";
    caseColHeader.scope = "col";
    headerRow.append(caseColHeader);

    for (const heading of ["Singular", "Plural"]) {
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

/**
 * Renders a single declension row for a table, including the case name, singular value, and plural value.
 *
 * @param {string} caseName - The grammatical case name to display in the row header.
 * @param {Object} tableData - The data object containing declension values for singular and plural forms.
 * @param {Object.<string, string>} tableData.SINGULAR - An object mapping grammatical case names to their singular values.
 * @param {Object.<string, string>} tableData.PLURAL - An object mapping grammatical case names to their plural values.
 * @return {HTMLTableRowElement} The constructed HTML table row element representing the declension row.
 */
export function renderDeclensionRow(caseName, tableData ) {
    const row = document.createElement("tr");

    const caseCell = document.createElement("th");
    caseCell.scope = "row";
    caseCell.classList.add("case-row-header");
    caseCell.textContent = formatCaseNameForTableRowHeader(caseName);
    row.append(caseCell);

    const singularValue = tableData.SINGULAR[caseName] || "";
    const singularCell = document.createElement("td");

    const searchInput = getSearchInput();

    // Highlight if matches search input
    if (matchesInflection(singularValue, searchInput)) {
        singularCell.append(highlightMatch(singularValue));
    } else {
        singularCell.textContent = singularValue;
    }
    row.append(singularCell);

    const pluralValue = tableData.PLURAL[caseName] || "";
    const pluralCell = document.createElement("td");

    // Highlight if matches search input
    if (matchesInflection(pluralValue, searchInput)) {
        pluralCell.classList.add("search-match");
    }
    pluralCell.textContent = pluralValue;
    row.append(pluralCell);
    return row;
}



