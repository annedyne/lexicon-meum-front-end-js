const GENDER_ABBR = { MASCULINE: "m", FEMININE: "f", NEUTER: "n" };
// define your canonical sort order:
const GENDER_ORDER = ["MASCULINE", "FEMININE", "NEUTER"];

export function renderAdjectiveAgreementTable(agreements) {
    if (!agreements?.length) return;

    // --- sort agreements by the lowest-index gender they contain ---
    agreements = agreements.slice().sort((a, b) => {
        const minIndex = arr =>
            Math.min(...arr.map(g => GENDER_ORDER.indexOf(g)));
        return minIndex(a.genders) - minIndex(b.genders);
    });

    const numbers = Object.keys(agreements[0].inflections);
    const cases   = Object.keys(agreements[0].inflections[numbers[0]]);

    const container = document.getElementById("inflections-container");
    container.innerHTML = "";

    const table = document.createElement("table");
    table.classList.add("latin-table", "agreement-table");
    container.appendChild(table);

    const thead = table.appendChild(document.createElement("thead"));
    thead.appendChild(getHeaderRow(numbers[0], agreements));

    const tbody = table.appendChild(document.createElement("tbody"));
    tbody.append(addCaseRows(agreements, cases, numbers[0]));
    tbody.append(
        createSectionHeaderRow(numbers[1], agreements.length + 1, "section-header")
    );
    tbody.append(addCaseRows(agreements, cases, numbers[1]));
}

function getHeaderRow(numberLabel, agreements) {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = numberLabel;
    tr.appendChild(th);

    agreements.forEach(({ genders }) => {
        const cell = document.createElement("th");
        cell.scope = "col";
        cell.textContent = formatGenderLabel(genders);
        tr.appendChild(cell);
    });

    return tr;
}

function formatGenderLabel(genders) {
    const sorted = [...genders].sort(
        (a, b) => GENDER_ORDER.indexOf(a) - GENDER_ORDER.indexOf(b)
    );
    const abbrs = sorted.map(g => GENDER_ABBR[g] || g.charAt(0).toLowerCase());
    return abbrs.join(" & ");
}

function addCaseRows(agreements, cases, numberLabel) {
    const frag = document.createDocumentFragment();

    cases.forEach(gramCase => {
        const row = document.createElement("tr");
        const caseTh = document.createElement("th");
        caseTh.scope = "row";
        caseTh.textContent = abbrevCase(gramCase);
        row.appendChild(caseTh);

        agreements.forEach(({ inflections }) => {
            const td = document.createElement("td");
            td.textContent = inflections[numberLabel][gramCase] ?? "";
            row.appendChild(td);
        });

        frag.appendChild(row);
    });

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
    row.appendChild(cell);
    return row;
}