import { describe, it, expect, vi } from 'vitest';
import { renderActiveConjugation } from '@detail/verb/render-tab-active.js';

vi.mock('@detail/verb/render-conjugation-shared.js', () => ({
    renderConjugationByVoice: vi.fn()
}));

import { renderConjugationByVoice } from '@detail/verb/render-conjugation-shared.js';
import { TAB_KEY } from '@detail/verb/tabs/tab-keys.js';

describe('renderActiveConjugation', () => {
    it('should call renderConjugationByVoice with correct parameters', () => {
        const mockConjugations = { active: {} };
        const mockGender = TAB_KEY.MASCULINE;

        renderActiveConjugation(mockConjugations, mockGender);

        expect(renderConjugationByVoice).toHaveBeenCalledWith(
            mockConjugations,
            mockGender,
            TAB_KEY.ACTIVE,
            'active-conjugation-table'
        );
    });
});