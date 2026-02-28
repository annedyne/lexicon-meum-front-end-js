// Minimum number of characters before triggering autocomplete
// noinspection SpellCheckingInspection

export const QUERY_CHAR_MIN = 1;
export const AUTOCOMPLETE_DEBOUNCE_MS = 100;

// ------- LEXICAL TERMS ------ //
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

export const GRAMMAR_KEYS = Object.freeze({
    DEPONENT: "DEPONENT",
});

export const GRAMMAR_ABBREV_LABEL = Object.freeze({
    [GRAMMAR_KEYS.DEPONENT]: "dep",
});


export const ADJECTIVE_DEGREES = Object.freeze({
    POSITIVE: "Positive",
    COMPARATIVE: "Comparative",
    SUPERLATIVE: "Superlative",
});


// ------- APPLICATION  ------ //

export const STATUS_TOAST_DURATION = 3000;
export const StatusMessageType = Object.freeze({
    INFO: "info",
    ERROR: "error",
    SUCCESS: "success",
});

// ------- CSS CLASS NAMES  ------ //
export const CSS_CLASSES = Object.freeze({
    // Headers
    DEGREE_HEADER: "degree-header",
    CASE_ROW_HEADER: "case-row-header",
    LEMMA: "lemma",

    // Layout containers
    TABLE_GRID_CONTAINER: "table-grid-container",

    // Tables
    INFLECTION_TABLE: "inflection-table",
    DECLENSION_TABLE: "declension-table",
    AGREEMENT_TABLE: "agreement-table",
    PARTICIPLE_TABLE: "participle-table",

    // Text styling
    GENDER: "gender",
    PART_OF_SPEECH: "part-of-speech",
    PRINCIPAL_PARTS: "principal-parts",
    PRINCIPAL_PARTS_SUBTYPE: "principal-parts-subtype",
    INFLECTION_TYPE: "inflection-type",

    // Definitions
    DEFINITIONS_LABEL: "definitions-label",
    DEFINITIONS_LIST: "definitions-list",
    DEFINITIONS_HIDDEN: "definitions-hidden",
    DEFINITIONS_TOGGLE: "definitions-toggle",
    DEFINITION_SUBHEADER: "definition-subheader",

    // Search and highlighting
    SEARCH_MATCH: "search-match",
    CASE_SPAN: "case-span",
    SUGGESTION_HIGHLIGHT: "suggestion-highlight",

    // Tabs
    TAB_ITEM: "tab-item",
    TAB_SPACER: "tab-spacer",
    IS_ACTIVE: "is-active",
    IS_DISABLED: "is-disabled",
});
