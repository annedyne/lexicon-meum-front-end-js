import {PartOfSpeech} from "./constants.js";

export function formatPOS(posKey) {
    return PartOfSpeech[posKey] ?? posKey.toLowerCase();
}