export function renderDefinitions(definitions) {
    const container = document.getElementById("definitions-container");
    container.innerHTML = "";

    const definitionsLabelSpan = document.createElement("span");
    definitionsLabelSpan.classList.add("definitions-label");
    definitionsLabelSpan.textContent = "Definitions:";
    container.appendChild(definitionsLabelSpan);

    if (!definitions || definitions.length === 0) return;

    const visibleCount = 2;

    const list = document.createElement("ul");
    list.classList.add("definitions-list");

    // First N definitions
    definitions.slice(0, visibleCount).forEach(def => {
        const li = document.createElement("li");
        li.textContent = def;
        list.appendChild(li);
    });

    container.appendChild(list);

    // Remainder definitions
    if (definitions.length > visibleCount) {
        const hiddenList = document.createElement("ul");
        hiddenList.classList.add("definitions-list", "definitions-hidden");
        hiddenList.style.display = "none";

        definitions.slice(visibleCount).forEach(def => {
            const li = document.createElement("li");
            li.textContent = def;
            hiddenList.appendChild(li);
        });

        container.appendChild(hiddenList);

        // Toggle button
        const toggle = document.createElement("button");
        toggle.classList.add("definitions-toggle");
        toggle.textContent = "Show more";
        toggle.addEventListener("click", () => {
            const isHidden = hiddenList.style.display === "none";
            hiddenList.style.display = isHidden ? "block" : "none";
            toggle.textContent = isHidden ? "Show less" : "Show more";
        });

        container.appendChild(toggle);
    }
}
