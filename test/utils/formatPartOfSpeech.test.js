import { describe, it, expect } from "vitest";

import {
    isPartOfSpeech,
    abbrevPartOfSpeech,
    parsePartOfSpeech,
    formatPOSForDefinitions,
} from "@src/utils/formatPartOfSpeech.js";

import { POS, POS_ABBREV_LABEL } from "@src/utils/constants.js";

describe("formatPartOfSpeech utilities", () => {
    describe("isPartOfSpeech", () => {
        it("returns true for all known POS values", () => {
            for (const value of Object.values(POS)) {
                expect(isPartOfSpeech(value)).toBe(true);
            }
        });

        it("is case-sensitive and returns false for lower-cased values", () => {
            expect(isPartOfSpeech("noun")).toBe(false);
            expect(isPartOfSpeech("verb")).toBe(false);
        });

        it("returns false for unknown values", () => {
            expect(isPartOfSpeech("UNKNOWN")).toBe(false);
            expect(isPartOfSpeech("")).toBe(false);
            expect(isPartOfSpeech(null)).toBe(false);
            expect(isPartOfSpeech(undefined)).toBe(false);
        });
    });

    describe("abbrevPartOfSpeech", () => {
        it("returns the expected abbreviation for each known POS", () => {
            // Ensure mapping covers all known entries
            for (const posKey of Object.values(POS)) {
                const abbrev = abbrevPartOfSpeech(posKey);
                expect(abbrev).toBe(POS_ABBREV_LABEL[posKey]);
            }
        });

        it("falls back to lower-casing the provided key when unknown", () => {
            expect(abbrevPartOfSpeech("UNKNOWN")).toBe("unknown");
            expect(abbrevPartOfSpeech("MiXeDCase")).toBe("mixedcase");
        });

        it("does not auto-normalize cases for known keys if the key casing doesn't match", () => {
            // Because the map uses upper-case keys
            expect(abbrevPartOfSpeech("noun")).toBe("noun");
            expect(abbrevPartOfSpeech("verb")).toBe("verb");
        });
    });

    describe("parsePartOfSpeech", () => {
        it("normalizes and parses known POS strings regardless of case and surrounding whitespace", () => {
            expect(parsePartOfSpeech("noun")).toBe(POS.NOUN);
            expect(parsePartOfSpeech(" VERB ")).toBe(POS.VERB);
            expect(parsePartOfSpeech("Adjective")).toBe(POS.ADJECTIVE);
            expect(parsePartOfSpeech("adverb")).toBe(POS.ADVERB);
            expect(parsePartOfSpeech("preposition")).toBe(POS.PREPOSITION);
        });

        it("returns null for null/undefined", () => {
            expect(parsePartOfSpeech(null)).toBeNull();
            expect(parsePartOfSpeech(undefined)).toBeNull();
        });

        it("returns null for unknown inputs or non-string values that don't match", () => {
            expect(parsePartOfSpeech("unknown")).toBeNull();
            expect(parsePartOfSpeech(42)).toBeNull();
            expect(parsePartOfSpeech({})).toBeNull();
            expect(parsePartOfSpeech("")).toBeNull();
            expect(parsePartOfSpeech("   ")).toBeNull();
        });
    });

    describe("formatPOSForDefinitions", () => {
        it("capitalizes the input string as expected", () => {
            expect(formatPOSForDefinitions("VERB")).toBe("Verb");
            expect(formatPOSForDefinitions("adjective")).toBe("Adjective");
            expect(formatPOSForDefinitions("AdVeRb")).toBe("Adverb");
        });

        it("returns an empty string for falsy inputs", () => {
            expect(formatPOSForDefinitions("")).toBe("");
            expect(formatPOSForDefinitions(null)).toBe("");
            expect(formatPOSForDefinitions(undefined)).toBe("");
        });
    });
});