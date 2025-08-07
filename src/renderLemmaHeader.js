
export function renderLemmaHeader(lemma){
        const container = document.getElementById("lemma-container");
        container.innerHTML = ""; // Clear once at the top

        const span = document.createElement("span");
        span.classList.add("lemma");
        span.textContent = `${lemma}`;

        container.appendChild(span);

}