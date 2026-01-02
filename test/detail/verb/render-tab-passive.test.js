import { describe, it, expect, vi } from 'vitest';
import { renderPassiveConjugation } from '@detail/verb/render-tab-passive.js';

vi.mock('@detail/verb/render-conjugation-shared.js', () => ({
    renderConjugationByVoice: vi.fn()
}));

import { renderConjugationByVoice } from '@detail/verb/render-conjugation-shared.js';
import { TAB_KEY } from '@detail/verb/tabs/tab-keys.js';

describe('renderActiveConjugation', () => {
    it('should call renderConjugationByVoice with correct parameters', () => {
        const mockConjugations = { active: {} };
        const mockGender = TAB_KEY.MASCULINE;

        renderPassiveConjugation(mockConjugations, mockGender);

        expect(renderConjugationByVoice).toHaveBeenCalledWith(
            mockConjugations,
            mockGender,
            TAB_KEY.PASSIVE,
            'passive-conjugation-table'
        );
    });
});