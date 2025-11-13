import {abbrevPartOfSpeech} from "@src/utils/formatPartOfSpeech.js";

export function transformWordSuggestionData(wordSuggestionData) {
    return wordSuggestionData
        .map((suggestionDatum) => {
            const {word, lexemeId, partOfSpeech, suggestionParent} = suggestionDatum;
            let suggestion;

            if (word && partOfSpeech && lexemeId && suggestionParent) {
                suggestion = `${suggestionParent} (${abbrevPartOfSpeech(partOfSpeech)})`;
                return {word, lexemeId, suggestion, suggestionParent};
            } else {
                return null;
            }
        })
        .filter(Boolean); // Remove null values from the array
}


