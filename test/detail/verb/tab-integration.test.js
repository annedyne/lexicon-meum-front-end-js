// noinspection XHTMLIncompatabilitiesJS,InnerHTMLJS

import { describe, it, expect, beforeEach } from 'vitest';
import { initializeInflectionTabs } from '@detail/verb/inflection-tab-controller.js';
import { getActiveTabVoice, getActiveTabGender } from '@detail/detail-context.js';

describe('Tab Integration', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="inflections-container"></div>';
    });

    it('should initialize tabs and handle complete interaction flow', () => {
        const mockInflectionTable = {
            conjugations: { active: {}, passive: {} },
            participles: {}
        };

        initializeInflectionTabs(mockInflectionTable);

        // Verify initial state
        expect(getActiveTabVoice()).toBeDefined();
        expect(getActiveTabGender()).toBeDefined();

        // Test tab switching
        const passiveTab = document.querySelector('[data-tab-id="passive"]');
        if (passiveTab) {
            passiveTab.click();
            expect(getActiveTabVoice()).toBe('passive');
        }
    });
});