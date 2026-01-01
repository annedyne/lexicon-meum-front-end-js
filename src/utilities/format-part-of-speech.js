import {POS, POS_ABBREV_LABEL, POS_SET} from "./constants.js";
import {capitalize} from "@src/utilities/string.js";

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


