export function matchesInflection(inflection, searchInput) {
    // Return false if either value is falsy (undefined, null, empty string)
    if (!inflection || !searchInput) {
        return false;
    }

    // Normalize by removing macrons and converting to lowercase
    return normalizeDiacritics(inflection) === normalizeDiacritics(searchInput);
}

export function normalizeDiacritics(toBeNormalized){
    return toBeNormalized.toLowerCase().normalize("NFD").replaceAll(/[\u0300-\u036F]/g, "");
}

// Helper to capitalize strings
export function capitalize(toBeCapitalized) {
    return toBeCapitalized.charAt(0).toUpperCase() + toBeCapitalized.slice(1);
}