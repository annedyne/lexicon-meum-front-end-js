export function matchesInflection(inflection, searchInput) {
    // Return false if either value is falsy (undefined, null, empty string)
    if (!inflection || !searchInput) {
        return false;
    }

    // Normalize by removing macrons and converting to lowercase
    const normalize = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return normalize(inflection) === normalize(searchInput);
}

// Helper to capitalize strings
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}