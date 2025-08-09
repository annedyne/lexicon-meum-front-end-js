export function renderInflectionType(inflectionClass, grammaticalPosition) {
    let container = document.getElementById("inflection-type-container");
    container.innerHTML = "";

    const positionSpan = document.createElement("span");
    positionSpan.classList.add("grammatical-position");
    positionSpan.textContent = `${grammaticalPosition}`;

    container.appendChild(positionSpan);

    let span = document.createElement("span");
    span.classList.add("inflection-type");

    span.textContent = `${inflectionClass}`;
    container.appendChild(span);

}