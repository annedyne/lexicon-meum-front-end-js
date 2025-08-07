export function renderInflectionType(inflectionClass){
    let container = document.getElementById("inflection-type-container");
    container.innerHTML = "";
    let span = document.createElement("span");
    span.classList.add("inflection-type");

    span.textContent = `(${inflectionClass})`;
    container.appendChild(span);

}