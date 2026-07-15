import {describe, it, expect} from 'vitest';
import {findSearchMatchesByTab} from '@detail/verb/find-search-matches-in-tabs.js';
import {TAB_KEY} from '@detail/verb/tabs/tab-keys.js';

// Minimal verb inflection table covering active, passive, and participle forms.
const inflectionTable = {
    conjugations: [
        {voice: TAB_KEY.ACTIVE, mood: 'INDICATIVE', tenses: [{defaultName: 'present', forms: ['amo', 'amas', 'amat']}]},
        {
            voice: TAB_KEY.PASSIVE,
            mood: 'INDICATIVE',
            tenses: [{defaultName: 'present', forms: ['amor', 'amaris', 'amatur']}]
        },
    ],
    participles: [
        {
            voice: 'participle',
            gender: 'FEMININE',
            tenses: [{declensions: {SINGULAR: {NOMINATIVE: 'amata'}, PLURAL: {NOMINATIVE: 'amatae'}}}]
        },
        {
            voice: 'participle',
            gender: 'NEUTER',
            tenses: [{declensions: {SINGULAR: {NOMINATIVE: 'amatum'}, PLURAL: {NOMINATIVE: 'amata'}}}]
        },
    ],
};

describe('findSearchMatchesByTab', () => {
    it('flags ACTIVE when the term is an active form', () => {
        const matches = findSearchMatchesByTab(inflectionTable, 'amat');
        expect(matches.voices[TAB_KEY.ACTIVE]).toBe(true);
        expect(matches.voices[TAB_KEY.PASSIVE]).toBe(false);
        expect(matches.voices[TAB_KEY.PARTICIPLE]).toBe(false);
    });

    it('flags PASSIVE when the term is a passive form', () => {
        const matches = findSearchMatchesByTab(inflectionTable, 'amatur');
        expect(matches.voices[TAB_KEY.PASSIVE]).toBe(true);
        expect(matches.voices[TAB_KEY.ACTIVE]).toBe(false);
    });

    it('flags PARTICIPLE and the matching gender for a participle form', () => {
        const matches = findSearchMatchesByTab(inflectionTable, 'amatae');
        expect(matches.voices[TAB_KEY.PARTICIPLE]).toBe(true);
        expect(matches.participleGenders[TAB_KEY.FEMININE]).toBe(true);
        expect(matches.participleGenders[TAB_KEY.NEUTER]).toBe(false);
    });

    it('reports every tab that contains the term', () => {
        // "amata" appears in both the feminine and neuter participles
        const matches = findSearchMatchesByTab(inflectionTable, 'amata');
        expect(matches.voices[TAB_KEY.PARTICIPLE]).toBe(true);
        expect(matches.participleGenders[TAB_KEY.FEMININE]).toBe(true);
        expect(matches.participleGenders[TAB_KEY.NEUTER]).toBe(true);
    });

    it('returns all-false when there is no search input', () => {
        const matches = findSearchMatchesByTab(inflectionTable);
        expect(matches.voices[TAB_KEY.ACTIVE]).toBe(false);
        expect(matches.voices[TAB_KEY.PASSIVE]).toBe(false);
        expect(matches.voices[TAB_KEY.PARTICIPLE]).toBe(false);
    });

    it('returns all-false when nothing matches', () => {
        const matches = findSearchMatchesByTab(inflectionTable, 'zzz');
        expect(matches.voices[TAB_KEY.ACTIVE]).toBe(false);
        expect(matches.voices[TAB_KEY.PARTICIPLE]).toBe(false);
    });
});
