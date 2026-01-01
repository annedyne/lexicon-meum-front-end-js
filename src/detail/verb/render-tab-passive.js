export function renderTabPassive(conjugations, gender) {

    console.log(`gender is ${gender}`);
    const container = document.querySelector("#inflections-container");
    container.querySelector("#tab-spacer")?.remove();
    const comingSoon = document.createElement("div");
    comingSoon.append("Passive conjugations are not yet available for this gender.");
    comingSoon.classList.add("coming-soon");
    comingSoon.id = "coming-soon";

    container.append(comingSoon);

    if (!Array.isArray(conjugations) || conjugations.length === 0) {
        console.log("No passive conjugations found");
    }
}