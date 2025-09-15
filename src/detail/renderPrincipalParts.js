export function renderPrincipalParts(principalParts) {

  const principalPartsContainer = document.getElementById(
    "principal-parts-container",
  );
  principalPartsContainer.innerHTML = ""; // Clear once at the top

  if (principalParts && principalParts.length > 0) {
    const span = document.createElement("span");
    span.classList.add("principal-parts");

    // Join parts with commas (no trailing comma)
    span.textContent = principalParts.join(", ");
    principalPartsContainer.appendChild(span);
  }
}
