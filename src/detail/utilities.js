import {capitalize} from "@utilities";

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

export function formatCaseNameForTableRowHeader(caseName) {
    const capitalized = capitalize(caseName.toLowerCase());
    return capitalized.slice(0, 3) + '.';
}