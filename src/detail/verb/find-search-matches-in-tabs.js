import { matchesInflection } from "@detail-core";
import { TAB_KEY } from "./tabs/tab-keys.js";

/**
 * Reports which verb tabs contain a form matching the search term.
 * Reusable for both auto-selecting the initial tab and (later) flagging every
 * tab that contains the search term in the UI.
 *
 * @param {Object} inflectionTable - verb inflection data (conjugations, participles)
 * @param {string} searchInput - the searched term
 * @returns {{voices: Object, participleGenders: Object}} match map keyed by TAB_KEY
 */
export function findSearchMatchesByTab(inflectionTable, searchInput) {
    const matches = {
        voices: {
            [TAB_KEY.ACTIVE]: false,
            [TAB_KEY.PASSIVE]: false,
            [TAB_KEY.PARTICIPLE]: false,
        },
        participleGenders: {
            [TAB_KEY.MASCULINE]: false,
            [TAB_KEY.FEMININE]: false,
            [TAB_KEY.NEUTER]: false,
        },
    };

    if (!searchInput || !inflectionTable) {
        return matches;
    }

    const conjugations = Array.isArray(inflectionTable.conjugations) ? inflectionTable.conjugations : [];
    matches.voices[TAB_KEY.ACTIVE] = conjugationVoiceMatches(conjugations, TAB_KEY.ACTIVE, searchInput);
    matches.voices[TAB_KEY.PASSIVE] = conjugationVoiceMatches(conjugations, TAB_KEY.PASSIVE, searchInput);

    const participles = Array.isArray(inflectionTable.participles) ? inflectionTable.participles : [];
    for (const participle of participles) {
        if (!participleMatches(participle, searchInput)) {
            continue;
        }
        matches.voices[TAB_KEY.PARTICIPLE] = true;
        const genderKey = toGenderKey(participle.gender);
        if (genderKey) {
            matches.participleGenders[genderKey] = true;
        }
    }

    return matches;
}

// True if any tense form of the given voice matches the search term.
function conjugationVoiceMatches(conjugations, voice, searchInput) {
    return conjugations
        .filter((entry) => entry?.voice === voice)
        .some((entry) => formsContainMatch(entry?.tenses, searchInput));
}

// True if any tense's forms array contains a matching form.
function formsContainMatch(tenses, searchInput) {
    if (!Array.isArray(tenses)) {
        return false;
    }
    return tenses.some(
        (tense) =>
            Array.isArray(tense?.forms) &&
            tense.forms.some((form) => matchesInflection(form, searchInput))
    );
}

// True if any singular/plural declension value of the participle matches.
function participleMatches(participle, searchInput) {
    const tenses = Array.isArray(participle?.tenses) ? participle.tenses : [];
    return tenses.some((tense) => declensionValuesContainMatch(tense?.declensions, searchInput));
}

// Scans both SINGULAR and PLURAL declension values for a match.
function declensionValuesContainMatch(declensions, searchInput) {
    if (!declensions) {
        return false;
    }
    const values = [
        ...Object.values(declensions.SINGULAR ?? {}),
        ...Object.values(declensions.PLURAL ?? {}),
    ];
    return values.some((form) => matchesInflection(form, searchInput));
}

// Maps a raw gender string to a TAB_KEY gender constant, or undefined.
function toGenderKey(gender) {
    if (typeof gender !== "string") {
        return;
    }
    const upper = gender.trim().toUpperCase();
    return [TAB_KEY.MASCULINE, TAB_KEY.FEMININE, TAB_KEY.NEUTER].includes(upper) ? upper : undefined;
}
