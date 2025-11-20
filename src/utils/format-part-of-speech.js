import {POS, POS_ABBREV_LABEL, POS_SET} from "./constants.js";

export function isPartOfSpeech(value) {
    return POS_SET.has(value);
}

export function abbrevPartOfSpeech(posKey) {
    return POS_ABBREV_LABEL[posKey] ?? posKey.toLowerCase();
}

export function parsePartOfSpeech(input) {
    if (input === undefined) {
        return;
    }
    const key = String(input).trim().toUpperCase();
    return POS[key] ?? undefined;
}

export function formatPOSForDefinitions(input) {
   return capitalize(input);
}

function capitalize(toBeCapitalized = "") {
    if (!toBeCapitalized) {
        return "";
    }
    const lowerCase = toBeCapitalized.toLowerCase();
    return lowerCase[0].toUpperCase() + lowerCase.slice(1);
}
