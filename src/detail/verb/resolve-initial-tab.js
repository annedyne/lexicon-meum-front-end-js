import { TAB_KEY } from "./tabs/tab-keys.js";

/**
 * Picks the single tab to auto-select from the matcher output.
 * Priority: Active -> Passive -> Participle; first matching voice wins.
 * Active/Passive forms have no gender dimension, so gender stays MASCULINE.
 *
 * @param {{voices: Object, participleGenders: Object}} matches - findSearchMatchesByTab output
 * @returns {{voice: string, gender: string}} the tab to activate
 */
export function resolveInitialTab(matches) {
    const voices = matches?.voices ?? {};

    if (voices[TAB_KEY.ACTIVE]) {
        return { voice: TAB_KEY.ACTIVE, gender: TAB_KEY.MASCULINE };
    }
    if (voices[TAB_KEY.PASSIVE]) {
        return { voice: TAB_KEY.PASSIVE, gender: TAB_KEY.MASCULINE };
    }
    if (voices[TAB_KEY.PARTICIPLE]) {
        return { voice: TAB_KEY.PARTICIPLE, gender: resolveParticipleGender(matches) };
    }
    return { voice: TAB_KEY.ACTIVE, gender: TAB_KEY.MASCULINE };
}

// First matching participle gender, M -> F -> N, defaulting to MASCULINE.
function resolveParticipleGender(matches) {
    const genders = matches?.participleGenders ?? {};
    for (const gender of [TAB_KEY.MASCULINE, TAB_KEY.FEMININE, TAB_KEY.NEUTER]) {
        if (genders[gender]) {
            return gender;
        }
    }
    return TAB_KEY.MASCULINE;
}
