import {describe, it, expect, beforeEach} from 'vitest';
import {renderConjugationByVoice} from '@detail/verb/render-conjugation-shared.js';
import {TAB_KEY} from '@detail/verb/tabs/tab-keys.js';

// Passive voice of a standard verb (amare): gender-agnostic present, gender-specific perfect.
const passiveConjugations = [
    {
        voice: TAB_KEY.PASSIVE,
        mood: 'Indicative',
        tenses: [
            {
                defaultName: 'Present',
                forms: ['amor', 'amāris', 'amātur']
            },
            {
                defaultName: 'Perfect',
                formsByGender: {
                    masculine: ['amātus sum', 'amātus es'],
                    feminine: ['amāta sum', 'amāta es'],
                    neuter: ['amātum sum', 'amātum es']
                }
            }
        ]
    }
];

// Deponent verb (sequi): passive form, active meaning, so displayed under the ACTIVE voice; gender-specific perfect.
const deponentConjugations = [
    {
        voice: TAB_KEY.ACTIVE,
        mood: 'Indicative',
        tenses: [
            {
                defaultName: 'Present',
                forms: ['sequor', 'sequeris', 'sequitur']
            },
            {
                defaultName: 'Perfect',
                formsByGender: {
                    masculine: ['secūtus sum', 'secūtus es'],
                    feminine: ['secūta sum', 'secūta es'],
                    neuter: ['secūtum sum', 'secūtum es']
                }
            }
        ]
    }
];

function renderedCells() {
    return [...document.querySelectorAll('#conjugation-table td')].map((c) => c.textContent);
}

describe('renderConjugationByVoice gendered forms', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="inflections-container"></div>';
    });

    it('renders gender-agnostic forms regardless of active gender', () => {
        renderConjugationByVoice(passiveConjugations, TAB_KEY.FEMININE, TAB_KEY.PASSIVE, 'passive-conjugation-table');
        const cells = renderedCells();
        expect(cells).toContain('amor');
        expect(cells).toContain('amāris');
        expect(cells).toContain('amātur');
    });

    it('renders only the active gender forms for gender-specific tenses', () => {
        renderConjugationByVoice(passiveConjugations, TAB_KEY.FEMININE, TAB_KEY.PASSIVE, 'passive-conjugation-table');
        const cells = renderedCells();
        expect(cells).toContain('amāta sum');
        expect(cells).toContain('amāta es');
        expect(cells).not.toContain('amātus sum');
        expect(cells).not.toContain('amātum sum');
    });

    it('switches gender-specific forms when active gender changes', () => {
        renderConjugationByVoice(passiveConjugations, TAB_KEY.NEUTER, TAB_KEY.PASSIVE, 'passive-conjugation-table');
        const cells = renderedCells();
        expect(cells).toContain('amātum sum');
        expect(cells).not.toContain('amāta sum');
    });

    it('renders gendered perfect forms for a deponent verb under the active voice', () => {
        renderConjugationByVoice(deponentConjugations, TAB_KEY.FEMININE, TAB_KEY.ACTIVE, 'active-conjugation-table');
        const cells = renderedCells();
        // Gender-agnostic present always shown
        expect(cells).toContain('sequor');
        expect(cells).toContain('sequitur');
        // Only the active gender's perfect forms shown
        expect(cells).toContain('secūta sum');
        expect(cells).not.toContain('secūtus sum');
        expect(cells).not.toContain('secūtum sum');
    });
});