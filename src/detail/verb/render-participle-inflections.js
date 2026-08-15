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

import { renderDeclensionRow } from "@detail/render-declension-table.js";
import { formatCaseNameForTableRowHeader, getSearchInput, highlightMatch, matchesInflection } from "@detail-core";
import { CSS_CLASSES } from "@utilities";

const GERUND = "gerund";
const SUPINE = "supine";

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
        console.log("No participle data provided - participles parameter is undefined or null");
        tabSupport?.addEmptyContentMessage("No participle data available for this word.", "bordered-message");
        return;
    }

    const participleTenses = participles?.find((d) => d.gender?.toLowerCase() === gender.toLowerCase())?.tenses;

    if (!Array.isArray(participleTenses) || participleTenses.length === 0) {
        console.log(`No participle data found for gender: ${gender}`);
        const genderLabel = gender.toLowerCase();
        tabSupport?.addEmptyContentMessage(
            `No ${genderLabel} participle forms available for this word.`,
            "bordered-message",
        );
        return;
    }

    // Create table container for the participle table
    const table = document.createElement("table");
    table.id = "conjugation-table"; // For tab-operations to reference
    table.classList.add(CSS_CLASSES.INFLECTION_TABLE, CSS_CLASSES.PARTICIPLE_TABLE);

    table.append(buildTableColumnHeaderRow());
    for (const participleTense of participleTenses) {
        if (participleTense?.declensions && !isVerbalNoun(participleTense)) {
            const declensions = participleTense.declensions;
            const cases = Object.keys(declensions.SINGULAR);

            const declensionSectionContainer = document.createElement("tbody");
            declensionSectionContainer.classList.add("participle-table", "declension-table");

            // Empty case column header - Duplicates header in thead of the table
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

    const verbalNounSection = buildVerbalNounSection(participleTenses);
    if (verbalNounSection) {
        table.append(verbalNounSection);
    }

    container.append(table);
}

function getTenseName(participleTense) {
    return participleTense?.defaultName ?? participleTense?.altName ?? "";
}

function isVerbalNoun(participleTense) {
    const name = getTenseName(participleTense).toLowerCase();
    return name === GERUND || name === SUPINE;
}

/**
 * Builds the verbal noun section: gerund forms in the left column, supine forms in the right.
 * Only the SINGULAR set is used, since gerund and supine use one form for both numbers.
 * @param {ParticipleTense[]} participleTenses - all tenses for the current gender
 * @returns {HTMLTableSectionElement|undefined} the section, or undefined when neither verbal noun is present
 */
function buildVerbalNounSection(participleTenses) {
    const gerund = participleTenses.find((tense) => getTenseName(tense).toLowerCase() === GERUND);
    const supine = participleTenses.find((tense) => getTenseName(tense).toLowerCase() === SUPINE);

    const gerundForms = gerund?.declensions?.SINGULAR;
    const supineForms = supine?.declensions?.SINGULAR;
    if (!gerundForms && !supineForms) {
        return;
    }

    const section = document.createElement("tbody");
    section.classList.add("participle-table", "declension-table");

    // Empty case column header, matching the participle tense sections above
    const emptyCaseHeader = document.createElement("th");
    emptyCaseHeader.textContent = "Case";
    emptyCaseHeader.scope = "col";
    emptyCaseHeader.classList.add("case-col-header");
    section.append(emptyCaseHeader);

    section.append(buildVerbalNounHeader(gerund, "Gerund"));
    section.append(buildVerbalNounHeader(supine, "Supine"));

    for (const caseName of collectCaseNames(gerundForms, supineForms)) {
        section.append(buildVerbalNounRow(caseName, gerundForms, supineForms));
    }
    return section;
}

// Single-column header for one verbal noun, or an empty placeholder when that form is missing
function buildVerbalNounHeader(participleTense, fallbackName) {
    const th = document.createElement("th");
    th.classList.add("tense-header");
    th.textContent = participleTense ? getTenseName(participleTense) || fallbackName : "";
    return th;
}

// Cases present in either form, gerund order first
function collectCaseNames(gerundForms, supineForms) {
    return [...new Set([...Object.keys(gerundForms ?? {}), ...Object.keys(supineForms ?? {})])];
}

function buildVerbalNounRow(caseName, gerundForms, supineForms) {
    const row = document.createElement("tr");

    const caseCell = document.createElement("th");
    caseCell.scope = "row";
    caseCell.classList.add(CSS_CLASSES.CASE_ROW_HEADER);
    caseCell.textContent = formatCaseNameForTableRowHeader(caseName);
    row.append(caseCell);

    row.append(buildVerbalNounCell(gerundForms?.[caseName]));
    row.append(buildVerbalNounCell(supineForms?.[caseName]));
    return row;
}

function buildVerbalNounCell(value) {
    const cell = document.createElement("td");
    const form = value || "";

    if (matchesInflection(form, getSearchInput())) {
        cell.append(highlightMatch(form));
    } else {
        cell.textContent = form;
    }
    return cell;
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
