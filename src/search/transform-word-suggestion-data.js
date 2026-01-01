import {abbrevPartOfSpeech} from "@utilities/format-part-of-speech.js";

export function transformWordSuggestionData(wordSuggestionData) {
    return wordSuggestionData
        .map((suggestionDatum) => {
            const {word, lexemeId, partOfSpeech, suggestionParent} = suggestionDatum;
            
            // Ensure all required fields are present
            if (![word, partOfSpeech, lexemeId, suggestionParent].every(Boolean)) {
                return;
            }

            const display = `${suggestionParent} (${abbrevPartOfSpeech(partOfSpeech)})`;
            return {word, lexemeId, display, suggestionParent};
        })
        .filter(Boolean); // Remove undefined values from the array
}


