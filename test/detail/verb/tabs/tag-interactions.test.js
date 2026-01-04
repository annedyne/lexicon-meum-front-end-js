// noinspection XHTMLIncompatabilitiesJS,InnerHTMLJS

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderTabs } from '@detail/verb/tabs/render-tabs.js';
import { getActiveTabVoice, getActiveTabGender } from '@detail/detail-context.js';
import { TAB_KEY } from '@detail/verb/tabs/tab-keys.js';

describe('Tab Interactions', () => {
    let mockContainer;
    let mockOnChange;

    beforeEach(() => {
        document.body.innerHTML = '<div id="inflections-container"></div>';
        mockContainer = document.querySelector('#inflections-container');
        mockOnChange = vi.fn();

        renderTabs({}, mockOnChange);
        mockOnChange.mockClear(); // Clear initial call
    });

    it('should change voice tab on click', () => {
        const passiveTab = mockContainer.querySelector('[data-tab-id="PASSIVE"]');
        passiveTab.click();

        expect(getActiveTabVoice()).toBe(TAB_KEY.PASSIVE);
        expect(mockOnChange).toHaveBeenCalledWith(TAB_KEY.PASSIVE, TAB_KEY.MASCULINE);
    });

    it('should change gender tab on click', () => {
        const feminineTab = mockContainer.querySelector('[data-tab-id="FEMININE"]');
        feminineTab.click();

        expect(getActiveTabGender()).toBe(TAB_KEY.FEMININE);
        expect(mockOnChange).toHaveBeenCalledWith((TAB_KEY.PASSIVE), TAB_KEY.FEMININE);
    });

    it('should update UI classes when tab changes', () => {
        const activeTab = mockContainer.querySelector('[data-tab-id="ACTIVE"]');
        const passiveTab = mockContainer.querySelector('[data-tab-id="PASSIVE"]');

        expect(passiveTab.classList.contains('is-active')).toBe(true);
        expect(activeTab.classList.contains('is-active')).toBe(false);

        activeTab.click();

        expect(passiveTab.classList.contains('is-active')).toBe(false);
        expect(activeTab.classList.contains('is-active')).toBe(true);
    });

    it('should not trigger onChange for same tab click', () => {
        const activeTab = mockContainer.querySelector('[data-tab-id="ACTIVE"]');
        activeTab.click();

        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should ignore clicks on non-tab elements', () => {
        const tabRow = mockContainer.querySelector('.voice-tabs');
        tabRow.click(); // Click on container, not tab

        expect(mockOnChange).not.toHaveBeenCalled();
    });
});