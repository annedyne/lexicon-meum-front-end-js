import { describe, it, expect } from 'vitest';
import { buildConjugationViewModel, resolveForms } from '@detail/verb/build-conjugation-view-model.js';
import { TAB_KEY } from '@detail/verb/tabs/tab-keys.js';

// amare: active present (agnostic) + active perfect (agnostic), passive perfect (gendered).
const conjugations = [
    {
        voice: TAB_KEY.ACTIVE,
        mood: 'Indicative',
        tenses: [{ defaultName: 'Present', forms: ['amo', 'amas'] }]
    },
    {
        voice: TAB_KEY.PASSIVE,
        mood: 'Indicative',
        tenses: [
            { defaultName: 'Present', forms: ['amor', 'amāris'] },
            {
                defaultName: 'Perfect',
                formsByGender: {
                    masculine: ['amātus sum'],
                    feminine: ['amāta sum'],
                    neuter: ['amātum sum']
                }
            }
        ]
    }
];

// sequi (deponent): passive form, active meaning, so its forms sit under the ACTIVE voice.
const deponentConjugations = [
    {
        voice: TAB_KEY.ACTIVE,
        mood: 'Indicative',
        tenses: [
            { defaultName: 'Present', forms: ['sequor', 'sequeris'] },
            {
                defaultName: 'Perfect',
                formsByGender: {
                    masculine: ['secūtus sum'],
                    feminine: ['secūta sum'],
                    neuter: ['secūtum sum']
                }
            }
        ]
    }
];

describe('resolveForms', () => {
    it('returns gender-agnostic forms regardless of gender', () => {
        const tense = { forms: ['amo', 'amas'] };
        expect(resolveForms(tense, TAB_KEY.FEMININE)).toEqual(['amo', 'amas']);
    });

    it('returns the active gender forms for a gender-specific tense', () => {
        const tense = { formsByGender: { masculine: ['m'], feminine: ['f'], neuter: ['n'] } };
        expect(resolveForms(tense, TAB_KEY.FEMININE)).toEqual(['f']);
    });

    it('pads with an empty array when the active gender key is missing', () => {
        const tense = { formsByGender: { masculine: ['m'] } };
        expect(resolveForms(tense, TAB_KEY.NEUTER)).toEqual([]);
    });
});

describe('buildConjugationViewModel', () => {
    it('filters to the requested voice', () => {
        const model = buildConjugationViewModel(conjugations, TAB_KEY.MASCULINE, TAB_KEY.ACTIVE);
        expect(model).toHaveLength(1);
        expect(model[0].mood).toBe('Indicative');
        expect(model[0].tenses[0].header).toBe('Indicative Present');
    });

    it('resolves gender-agnostic and gender-specific forms for the active gender', () => {
        const model = buildConjugationViewModel(conjugations, TAB_KEY.FEMININE, TAB_KEY.PASSIVE);
        const [present, perfect] = model[0].tenses;
        expect(present.forms).toEqual(['amor', 'amāris']); // agnostic, unaffected by gender
        expect(perfect.forms).toEqual(['amāta sum']); // feminine only
    });

    it('returns an empty array for a voice with no mood sections', () => {
        expect(buildConjugationViewModel(conjugations, TAB_KEY.MASCULINE, 'nonexistent')).toEqual([]);
    });

    it('returns an empty array when conjugations is not an array', () => {
        expect(buildConjugationViewModel(undefined, TAB_KEY.MASCULINE, TAB_KEY.ACTIVE)).toEqual([]);
    });
});

describe('buildConjugationViewModel deponent verb', () => {
    it('places deponent forms under the active voice', () => {
        const model = buildConjugationViewModel(deponentConjugations, TAB_KEY.MASCULINE, TAB_KEY.ACTIVE);
        expect(model).toHaveLength(1);
        expect(model[0].tenses[0].forms).toEqual(['sequor', 'sequeris']);
    });

    it('resolves gender-specific perfect forms for the active gender', () => {
        const model = buildConjugationViewModel(deponentConjugations, TAB_KEY.FEMININE, TAB_KEY.ACTIVE);
        const [, perfect] = model[0].tenses;
        expect(perfect.forms).toEqual(['secūta sum']);
    });

    it('has no forms under the passive voice', () => {
        expect(buildConjugationViewModel(deponentConjugations, TAB_KEY.MASCULINE, TAB_KEY.PASSIVE)).toEqual([]);
    });
});