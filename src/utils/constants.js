// Minimum number of characters before triggering autocomplete
export const QUERY_CHAR_MIN = 1;

//Parts of Speech
export const POS = Object.freeze({
    NOUN: "NOUN",
    VERB: "VERB",
    ADJECTIVE: "ADJECTIVE",
    ADVERB: "ADVERB",
    PREPOSITION: "PREPOSITION",
    POSTPOSITION: "POSTPOSITION"
});


export const POS_ABBREV_LABEL = Object.freeze({
    [POS.NOUN]: "nom",
    [POS.VERB]: "vrb",
    [POS.ADVERB]: "adv",
    [POS.ADJECTIVE]: "adj",
    [POS.PREPOSITION]: "prep",
        [POS.POSTPOSITION]: "postp",
});

export const POS_KEYS = Object.freeze(Object.keys(POS_ABBREV_LABEL));
export const POS_SET = new Set(POS_KEYS);






export const StatusMessageType = Object.freeze({
  INFO: "info",
  ERROR: "error",
  SUCCESS: "success",
});
