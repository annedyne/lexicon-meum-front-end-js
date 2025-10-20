// Minimum number of characters before triggering autocomplete
export const QUERY_CHAR_MIN = 1;

//Parts of Speech
export const POS = Object.freeze({
    ADJECTIVE: "ADJECTIVE",
    ADVERB: "ADVERB",
    CONJUNCTION: "CONJUNCTION",
    DETERMINER: "DETERMINER",
    NOUN: "NOUN",
    PREPOSITION: "PREPOSITION",
    POSTPOSITION: "POSTPOSITION",
    PRONOUN: "PRONOUN",
    VERB: "VERB",
});


export const POS_ABBREV_LABEL = Object.freeze({
    [POS.ADVERB]: "adv",
    [POS.ADJECTIVE]: "adj",
    [POS.CONJUNCTION]: "conj",
    [POS.DETERMINER]: "pron adj",
    [POS.NOUN]: "nom",
    [POS.PREPOSITION]: "prep",
    [POS.POSTPOSITION]: "postp",
    [POS.PRONOUN]: "pronom",
    [POS.VERB]: "vrb",
});

export const POS_KEYS = Object.freeze(Object.keys(POS_ABBREV_LABEL));
export const POS_SET = new Set(POS_KEYS);






export const StatusMessageType = Object.freeze({
  INFO: "info",
  ERROR: "error",
  SUCCESS: "success",
});
