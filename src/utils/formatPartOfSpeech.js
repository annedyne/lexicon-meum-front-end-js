import {PartOfSpeech} from "@src/utils/constants.js";

export function formatPOS(posKey) {
    return PartOfSpeech[posKey] ?? posKey.toLowerCase();
}