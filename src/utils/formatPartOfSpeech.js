import {POS, POS_ABBREV_LABEL, POS_SET} from "@src/utils/constants.js";

export function isPartOfSpeech(value) {
    return POS_SET.has(value);
}

export function abbrevPartOfSpeech(posKey) {
    return POS_ABBREV_LABEL[posKey] ?? posKey.toLowerCase();
}

export function parsePartOfSpeech(input) {
    if (input == null) return null;
    const key = String(input).trim().toUpperCase();
    return POS[key] ?? null;
}

export function formatPOSForDefinitions(input) {
   return capitalize(input);
}

function capitalize(str = "") {
    if (!str) return "";
    str = str.toLowerCase();
    return str[0].toUpperCase() + str.slice(1);
}
