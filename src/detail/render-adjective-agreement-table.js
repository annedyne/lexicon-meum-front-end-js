import {matchesInflection} from "./render-utilities.js";
import {getSearchInput} from "./search-context.js";

const GENDER_ABBR = { MASCULINE: "m", FEMININE: "f", NEUTER: "n" };

// define  canonical sort order:
const GENDER_ORDER = ["MASCULINE", "FEMININE", "NEUTER"];

/**
 * @typedef {Object} Agreement
 * @property {Object.<string, Object.<string, string>>} inflections
 * @property {string[]} genders
 */
export function renderAdjectiveAgreementTable(agreements) {
    const container = document.querySelector("#inflections-container");
    container.replaceChildren();

    if (!Array.isArray(agreements) || agreements.length === 0) {
        return;
    }

    // --- sort agreements by the lowest-index gender they contain ---
    const sortedAgreements =  [...agreements].toSorted((a, b) => {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const minIndex = (array) =>
            Math.min(...array.map((g) => GENDER_ORDER.indexOf(g)));
        return minIndex(a.genders) - minIndex(b.genders);
    });

    const numbers = Object.keys(sortedAgreements[0].inflections);
    const cases = Object.keys(sortedAgreements[0].inflections[numbers[0]]);

    const table = document.createElement("table");
    table.classList.add("latin-table", "agreement-table");
    container.append(table);

    const thead = document.createElement("thead");
    thead.append(getHeaderRow(numbers[0], sortedAgreements));
    table.append(thead);

    const tbody = document.createElement("tbody");
    tbody.append(addCaseRows(sortedAgreements, cases, numbers[0]));
    tbody.append(
        createSectionHeaderRow(numbers[1], sortedAgreements.length + 1, "section-header"),
    );
    tbody.append(addCaseRows(sortedAgreements, cases, numbers[1]));
    table.append(tbody);
}

function getHeaderRow(numberLabel, agreements) {
  const tr = document.createElement("tr");
  const th = document.createElement("th");
  th.textContent = numberLabel;
  tr.append(th);

  for (const { genders } of agreements) {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.textContent = formatGenderLabel(genders);
    tr.append(cell);
  }

  return tr;
}

function formatGenderLabel(genders) {
  const sorted = [...genders].toSorted(
    (a, b) => GENDER_ORDER.indexOf(a) - GENDER_ORDER.indexOf(b),
  );
  const abbreviations = sorted.map((g) => GENDER_ABBR[g] || g.charAt(0).toLowerCase());
  return abbreviations.join(" & ");
}

function addCaseRows(agreements, cases, numberLabel) {
    const searchInput = getSearchInput();

  const frag = document.createDocumentFragment();

  for (const gramCase of cases) {
    const row = document.createElement("tr");
    const caseTh = document.createElement("th");
    caseTh.scope = "row";
    caseTh.textContent = abbrevCase(gramCase);
    row.append(caseTh);

    for (const { inflections } of agreements) {
      const td = document.createElement("td");

      const inflection = inflections[numberLabel]?.[gramCase] ?? "";
      td.textContent = inflection;
      if(matchesInflection(inflection, searchInput)){
          td.classList.add("inflection-match-highlight");
      }
      row.append(td);
    }

    frag.append(row);
  }

  return frag;
}

function abbrevCase(name) {
  const p = name.slice(0, 3);
  return p.charAt(0) + p.slice(1).toLowerCase() + ".";
}

function createSectionHeaderRow(label, colspan, cls) {
  const row = document.createElement("tr");
  const cell = document.createElement("th");
  cell.scope = "col";
  cell.colSpan = colspan;
  cell.textContent = label;
  cell.classList.add(cls);
  row.append(cell);
  return row;
}
