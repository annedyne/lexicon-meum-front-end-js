export function renderLemmaHeader(lemma) {
  const container = document.querySelector("#lemma-container");
  container.textContent = "";

  const lemmaSpan = document.createElement("span");
  lemmaSpan.classList.add("lemma");
  lemmaSpan.textContent = `${lemma}`;

  container.append(lemmaSpan);
}
