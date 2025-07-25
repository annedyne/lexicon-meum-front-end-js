const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const DECLENSION_DETAIL_URI = `${API_BASE_URL}/lexemes/declension?lexemeId=`;
export const CONJUGATION_DETAIL_URI = `${API_BASE_URL}/lexemes/conjugation?lexemeId=`;

export const SEARCH_URI = `${API_BASE_URL}/lexemes/autocomplete/`;
export const PREFIX_URI = "prefix?prefix=";
export const SUFFIX_URI = "suffix?suffix=";
