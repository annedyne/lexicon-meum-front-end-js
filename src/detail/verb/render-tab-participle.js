
/**
 * @typedef {Object} ParticipleCase
 * @property {string} caseName - The case name (e.g., "nominative", "genitive")
 * @property {string} singular - The singular inflection for this case
 * @property {string} plural - The plural inflection for this case
 */

/**
 * @typedef {Object} ParticipleTense
 * @property {string} tenseName - The tense name (e.g., "present", "perfect")
 * @property {ParticipleCase[]} cases - Array of cases with their inflections
 */

/**
 * @typedef {Object} ParticipleData
 * @property {string} voice - Should be "participle"
 * @property {ParticipleTense[]} tenses - Array of participle tenses
 */

import {createDeclensionTable} from "@detail/render-declension-table.js";

/**
 * Renders participle data using the CSS Grid system
 * @param {ParticipleData[]} participles - Array of participle data
 * @param {string} gender - The gender filter (MASCULINE, FEMININE, NEUTER)
 */

export function renderTabParticiple(participles, gender) {
    console.log(`Rendering participles for gender: ${gender}`);

    // Replace existing content
    const container = document.querySelector("#inflections-container");

    const existingTable = container.querySelector("#conjugation-table");
    if (existingTable) {
        existingTable.remove();
    }

    if (!participles || !Array.isArray(participles)) {
        console.log("No participle data found");
    }

    // Extract participles from the data structure
    const participleTenses = participles.find(
        d => d.gender && d.gender.toLowerCase() === gender.toLowerCase())?.tenses ?? [];

    if (!participleTenses || !Array.isArray(participleTenses) || participleTenses.length === 0) {
        console.log(`No participle data found for gender: ${gender}`);
        return;
    }

    // Create table container for the participle table
    const tableContainer = document.createElement("div");
    tableContainer.id = "conjugation-table";
    tableContainer.classList.add("participle-grid-container");

    // Create a table for each participle tense (e.g., Perfect Passive, Future Active, etc.)
    for (const participleTense of participleTenses) {
        if (!participleTense || !participleTense.declensions) {
            continue;
        }
        const declensions = participleTense.declensions;
        const declensionTableContainer = document.createElement("table");
        declensionTableContainer.classList.add("participle-table");
        createDeclensionTable(declensions, declensionTableContainer);

        const thead = declensionTableContainer.querySelector("thead");
        adjustDeclensionTableHeader(thead, participleTense);

        tableContainer.append(declensionTableContainer);
    }
    container.append(tableContainer);
}

function adjustDeclensionTableHeader(thead, participleTense) {

    const th = document.createElement("th");
    th.colSpan = 3;
    th.classList.add("tense-header");
    th.textContent = participleTense.defaultName ?? participleTense.altName ?? "";
    th.colSpan = 3;
    thead.replaceChildren(th)
}
