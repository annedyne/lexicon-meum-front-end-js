// noinspection XHTMLIncompatabilitiesJS,InnerHTMLJS

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderTabs } from '@detail/verb/tabs/render-tabs.js';
import { TAB_KEY } from '@detail/verb/tabs/tab-keys.js';

describe('renderTabs', () => {
    let mockContainer;
    let mockInflectionTable;
    let mockOnChange;

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = '<div id="inflections-container"></div>';
        mockContainer = document.querySelector('#inflections-container');

        mockInflectionTable = { conjugations: {}, participles: {} };
        mockOnChange = vi.fn();
    });

    it('should create tab structure with correct classes', () => {
        renderTabs(mockInflectionTable, mockOnChange);

        const wrapper = mockContainer.querySelector('.conjugation-tabs-wrapper');
        expect(wrapper).toBeTruthy();
        expect(wrapper.id).toBe('conjugation-tabs');
    });

    it('should create voice tabs with correct attributes', () => {
        renderTabs(mockInflectionTable, mockOnChange);

        const voiceTabRow = mockContainer.querySelector('.voice-tabs');
        const voiceTabs = voiceTabRow.querySelectorAll('.tab-item');

        expect(voiceTabs).toHaveLength(3);

        const activeTab = voiceTabRow.querySelector('[data-tab-id="ACTIVE"]');
        expect(activeTab.dataset.tabGroup).toBe('voice');
        expect(activeTab.classList.contains('is-active')).toBe(true);
    });

    it('should create gender tabs with correct attributes', () => {
        renderTabs(mockInflectionTable, mockOnChange);

        const genderTabRow = mockContainer.querySelector('.gender-tabs');
        const genderTabs = genderTabRow.querySelectorAll('.tab-item');

        expect(genderTabs).toHaveLength(3);

        const masculineTab = genderTabRow.querySelector('[data-tab-id="MASCULINE"]');
        expect(masculineTab.dataset.tabGroup).toBe('gender');
        expect(masculineTab.classList.contains('is-active')).toBe(true);
    });

    it('should call onChange with initial state', () => {
        renderTabs(mockInflectionTable, mockOnChange);

        expect(mockOnChange).toHaveBeenCalledWith(TAB_KEY.ACTIVE, TAB_KEY.MASCULINE);
    });
});