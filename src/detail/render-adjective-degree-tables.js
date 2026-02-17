import {renderAdjectiveAgreementTable} from "./render-adjective-agreement-table.js";
import {CSS_CLASSES, ADJECTIVE_DEGREES} from "@utilities";

export function renderAdjectiveDegreeTables(degreeAgreements) {

    const container = document.querySelector("#inflections-container");
    container.replaceChildren();

    // Render positive degree with header
    appendAndRenderTableComponent(degreeAgreements.positive, ADJECTIVE_DEGREES.POSITIVE, container);
    appendAndRenderTableComponent(degreeAgreements.comparative, ADJECTIVE_DEGREES.COMPARATIVE, container);
    appendAndRenderTableComponent(degreeAgreements.superlative, ADJECTIVE_DEGREES.SUPERLATIVE, container);
}

function appendAndRenderTableComponent(degreeAgreements, degreeType, container) {
    if (degreeAgreements.length > 0) {
        container.append(createTableHeader(degreeType));
        renderAdjectiveAgreementTable(degreeAgreements, false);
    }
}

function createTableHeader(degreeHeaderString) {
    const headerElement = document.createElement("h3");
    headerElement.textContent = degreeHeaderString;
    headerElement.classList.add(CSS_CLASSES.DEGREE_HEADER);
    return headerElement;
}


