export function renderTabPassive(conjugations, gender) {

    console.log(`gender is ${gender}`);
    const container = document.querySelector("#inflections-container");

    // Clear any previously existing table container (e.g.,)
    const existingTable = container.querySelector("#conjugation-table");
    if (existingTable) {
        existingTable.remove();
    }

    if (!Array.isArray(conjugations) || conjugations.length === 0) {
        console.log("No passive conjugations found");
    }
}