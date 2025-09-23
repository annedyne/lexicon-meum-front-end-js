import {abbrevPartOfSpeech} from "@src/utils/formatPartOfSpeech.js";

export function transformWordSuggestionData(wordSuggestionData) {
  return wordSuggestionData
    .map((suggestionDatum) => {
      const {
        word, lexemeId, partOfSpeech, } = suggestionDatum;
      let suggestion;

      if (word && partOfSpeech && lexemeId) {
        suggestion = `${word} (${abbrevPartOfSpeech(partOfSpeech)})`;
        return { word, lexemeId, suggestion };
      } else {
        return null;
      }
    })
    .filter(Boolean); // Remove null values from the array
}


