/**
 * @typedef {Object} ParticipleCase
 * @property {string} caseName - The case name (e.g., "nominative", "genitive")
 * @property {string} singular - The singular inflection for this case
 * @property {string} plural - The plural inflection for this case
 */

/**
 * @typedef {Object} ParticipleTense
 * @property {string} defaultName - The default tense name (e.g., "present participle", "perfect participle")
 * @property {string} altName - The alternative tense name (e.g., "past participle", "future participle")
 * @property {ParticipleCase[]} cases - Array of cases with their inflections
 */

/**
 * @typedef {Object} ParticipleData
 * @property {string} voice - Should be "participle"
 * @property {string} gender - The gender filter (MASCULINE, FEMININE, NEUTER)
 * @property {ParticipleTense[]} tenses - Array of participle tenses
 */

import {renderDeclensionRow} from "@detail/render-declension-table.js";
import {CSS_CLASSES} from "@utilities";

/**
 * Renders participle data using the CSS Grid system
 * @param {ParticipleData[]} participles - Array of participle data
 * @param {string} gender - The gender filter (MASCULINE, FEMININE, NEUTER)
 * @param {TabSupport} tabSupport - utility functions provided by the tab controller for content management
 */
export function renderParticipleInflections(participles, gender, tabSupport) {
    console.log(`Rendering participles for gender: ${gender}`);

    const container = document.querySelector("#inflections-container");

    // Check if participles is undefined or null
    if (!participles) {
        console.log('No participle data provided - participles parameter is undefined or null');
        tabSupport?.addEmptyContentMessage('No participle data available for this word.', 'bordered-message');
        return;
    }

    const participleTenses = participles
        ?.find(d => d.gender?.toLowerCase() === gender.toLowerCase())
        ?.tenses;

    if (!Array.isArray(participleTenses) || participleTenses.length === 0) {
        console.log(`No participle data found for gender: ${gender}`);
        const genderLabel = gender.toLowerCase();
        tabSupport?.addEmptyContentMessage(`No ${genderLabel} participle forms available for this word.`, 'bordered-message');
        return;
    }

    // Create table container for the participle table
    const table = document.createElement("table");
    table.id = "conjugation-table"; // For tab-operations to reference
    table.classList.add(CSS_CLASSES.INFLECTION_TABLE, CSS_CLASSES.PARTICIPLE_TABLE);

    table.append(buildTableColumnHeaderRow());
    for (const participleTense of participleTenses) {
        if (participleTense?.declensions) {

            const declensions = participleTense.declensions;
            const cases = Object.keys(declensions.SINGULAR);

            const declensionSectionContainer = document.createElement("tbody");
            declensionSectionContainer.classList.add("participle-table", "declension-table");

            // Empty case colum header - Duplicates header in thead of the table
            // BUT if I span the tbody's tense-header across the three columns,
            // the width setting for first column is ignored.
            const emptyCaseHeader = document.createElement("th");
            emptyCaseHeader.textContent = "Case";
            emptyCaseHeader.scope = "col";
            emptyCaseHeader.classList.add("case-col-header");
            declensionSectionContainer.append(emptyCaseHeader);

            // Header for each tbody
            const tenseHeader = buildTenseHeader(participleTense);
            declensionSectionContainer.append(tenseHeader);

            for (const caseName of cases) {
                const row = renderDeclensionRow(caseName, declensions);
                declensionSectionContainer.append(row);
            }
            table.append(declensionSectionContainer);
        }
    }
    container.append(table);
}

function buildTableColumnHeaderRow() {
    // Add thead to establish column structure (this is likely what's missing!)
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const caseHeader = document.createElement("th");
    const span = document.createElement("span");
    caseHeader.append(span);
    caseHeader.textContent = "Case";
    caseHeader.scope = "col";
    caseHeader.classList.add("case-col-header");
    headerRow.append(caseHeader);

    const singularHeader = document.createElement("th");
    singularHeader.textContent = "Singular";
    singularHeader.scope = "col";
    headerRow.append(singularHeader);

    const pluralHeader = document.createElement("th");
    pluralHeader.textContent = "Plural";
    pluralHeader.scope = "col";
    headerRow.append(pluralHeader);

    thead.append(headerRow);
    return thead;
}

function buildTenseHeader(participleTense) {

    const th = document.createElement("th");
    th.classList.add("tense-header");
    th.textContent = participleTense.defaultName ?? participleTense.altName ?? "";
    th.colSpan = 2;
    return th;
}
