import {abbrevPartOfSpeech} from "@src/utils/formatPartOfSpeech.js";

export function transformWordSuggestionData(wordSuggestionData) {
    return wordSuggestionData
        .map((suggestionDatum) => {
            const {word, lexemeId, partOfSpeech, suggestionParent} = suggestionDatum;
            let display;

            if (word && partOfSpeech && lexemeId && suggestionParent) {
                display  = `${suggestionParent} (${abbrevPartOfSpeech(partOfSpeech)})`;
                return {word, lexemeId, display, suggestionParent};
            } else {
                return null;
            }
        })
        .filter(Boolean); // Remove null values from the array
}


