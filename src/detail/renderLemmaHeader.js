export function renderLemmaHeader(lemma) {
        const container = document.getElementById("lemma-container");
        container.innerHTML = "";

        const lemmaSpan = document.createElement("span");
        lemmaSpan.classList.add("lemma");
        lemmaSpan.textContent = `${lemma}`;

        container.appendChild(lemmaSpan);
}