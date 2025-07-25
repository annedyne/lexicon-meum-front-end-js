const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getLexemeDetailUri = (lexemeId) => `${API_BASE_URL}/lexemes/${lexemeId}/detail`;

export const SEARCH_URI = `${API_BASE_URL}/lexemes/autocomplete/`;
export const PREFIX_URI = "prefix?prefix=";
export const SUFFIX_URI = "suffix?suffix=";