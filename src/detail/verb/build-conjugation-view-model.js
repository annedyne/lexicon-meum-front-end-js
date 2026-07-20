/**
 * @typedef {Object} Tense
 * @property {string} defaultName - The default name of the tense
 * @property {string[]} [forms] - Gender-agnostic conjugated forms
 * @property {Object.<string, string[]>} [formsByGender] - Gender-specific forms keyed by lowercase gender
 */

/**
 * @typedef {Object} ResolvedTense
 * @property {string} header - Display header ("<mood> <tense name>")
 * @property {string[]} forms - Forms to display for the active gender
 */

/**
 * @typedef {Object} MoodViewModel
 * @property {string} mood - The mood (e.g., Indicative, Subjunctive)
 * @property {ResolvedTense[]} tenses - Resolved tenses for this mood
 */

/**
 * Resolves the forms to display for a tense given the active gender.
 * A tense is either gender-agnostic (`forms`, shown for every gender) or
 * gender-specific (`formsByGender`, only the active gender's forms are shown).
 *
 * @param {Tense} [tense] - The tense to resolve forms for
 * @param {string} gender - Active gender tab key (e.g. TAB_KEY.MASCULINE)
 * @return {string[]} The forms to display, or an empty array when none apply
 */
export function resolveForms(tense, gender) {
    if (Array.isArray(tense?.forms)) {
        return tense.forms;
    }
    const genderKey = String(gender).toLowerCase();
    return tense?.formsByGender?.[genderKey] ?? [];
}

/**
 * Builds a DOM-free view-model for a voice's conjugations: filters to the given
 * voice and resolves each tense's forms for the active gender. Downstream render
 * code consumes the uniform `{ header, forms }` shape without any knowledge of
 * the `forms`/`formsByGender` split or the voice filter.
 *
 * @param {Object[]} conjugations - Mood sections from the detail response
 * @param {string} gender - Active gender tab key
 * @param {string} voice - Voice tab key to filter by (e.g. TAB_KEY.ACTIVE)
 * @return {MoodViewModel[]} Mood view-models, each with resolved tenses
 */
export function buildConjugationViewModel(conjugations, gender, voice) {
    if (!Array.isArray(conjugations)) {
        return [];
    }

    return conjugations
        .filter((section) => section?.voice === voice)
        .map((section) => {
            const mood = section?.mood ?? "";
            const tenses = Array.isArray(section?.tenses) ? section.tenses : [];
            return {
                mood,
                tenses: tenses.map((tense) => ({
                    header: `${mood} ${tense?.defaultName ?? ""}`,
                    forms: resolveForms(tense, gender),
                })),
            };
        });
}