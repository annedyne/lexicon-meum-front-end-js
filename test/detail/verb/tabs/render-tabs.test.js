// noinspection XHTMLIncompatabilitiesJS,InnerHTMLJS

import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
    renderTabs,
    createTabElement,
    createVoiceTabRow,
    createGenderTabRow,
    createTabsWrapper
} from '@detail/verb/tabs/render-tabs.js';

import { TAB_KEY, TAB_LABEL } from '@detail/verb/tabs/tab-keys.js';

// Mock the detail-core functions
vi.mock('@detail-core', () => ({
    getActiveTabVoice: vi.fn(() => TAB_KEY.ACTIVE),
    setActiveTabVoice: vi.fn(),
    getActiveTabGender: vi.fn(() => TAB_KEY.MASCULINE),
    setActiveTabGender: vi.fn(),
    getMorphologicalSubtype: vi.fn(() => 'REGULAR')
}));

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

describe('createTabElement', () => {
    it('should create tab element with correct basic attributes', () => {
        const tabElement = createTabElement(TAB_KEY.ACTIVE, 'voice', false, false);

        expect(tabElement.tagName).toBe('DIV');
        expect(tabElement.className).toBe('tab-item');
        expect(tabElement.textContent).toBe(TAB_LABEL[TAB_KEY.ACTIVE]);
        expect(tabElement.dataset.tabGroup).toBe('voice');
        expect(tabElement.dataset.tabId).toBe(TAB_KEY.ACTIVE);
    });

    it('should create active tab with is-active class', () => {
        const tabElement = createTabElement(TAB_KEY.PASSIVE, 'voice', true, false);

        expect(tabElement.classList.contains('is-active')).toBe(true);
        expect(tabElement.classList.contains('is-disabled')).toBe(false);
    });

    it('should create disabled tab with proper attributes', () => {
        const tabElement = createTabElement(TAB_KEY.PASSIVE, 'voice', false, true);

        expect(tabElement.classList.contains('is-disabled')).toBe(true);
        expect(tabElement.getAttribute('aria-disabled')).toBe('true');
        expect(tabElement.getAttribute('title')).toBe('Not available for deponent verbs');
    });

    it('should not be active if disabled, even when isActive is true', () => {
        const tabElement = createTabElement(TAB_KEY.PASSIVE, 'voice', true, true);

        expect(tabElement.classList.contains('is-active')).toBe(false);
        expect(tabElement.classList.contains('is-disabled')).toBe(true);
    });
});

describe('createVoiceTabRow', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should create voice tab row with correct structure', () => {
        const voiceTabRow = createVoiceTabRow();

        expect(voiceTabRow.className).toBe('tab-row voice-tabs');
        expect(voiceTabRow.children).toHaveLength(3);
    });

    it('should create all voice tabs with correct tab IDs', () => {
        const voiceTabRow = createVoiceTabRow();
        const tabIds = [...voiceTabRow.children].map(tab => tab.dataset.tabId);

        expect(tabIds).toEqual([TAB_KEY.ACTIVE, TAB_KEY.PASSIVE, TAB_KEY.PARTICIPLE]);
    });

    it('should mark active tab as active when not disabled', async () => {
        const {getActiveTabVoice} = await import('@detail-core');
        getActiveTabVoice.mockReturnValue(TAB_KEY.PARTICIPLE);

        const voiceTabRow = createVoiceTabRow();
        const participleTab = voiceTabRow.querySelector('[data-tab-id="participle"]');

        expect(participleTab.classList.contains('is-active')).toBe(true);
    });

    it('should disable passive tab for deponent verbs', async () => {
        const { getMorphologicalSubtype } = await import('@detail-core');
        const { GRAMMAR_KEYS } = await import('@utilities');

        getMorphologicalSubtype.mockReturnValue(GRAMMAR_KEYS.DEPONENT);

        const voiceTabRow = createVoiceTabRow();
        const passiveTab = voiceTabRow.querySelector('[data-tab-id="PASSIVE"]');

        expect(passiveTab.classList.contains('is-disabled')).toBe(true);
        expect(passiveTab.getAttribute('aria-disabled')).toBe('true');
    });
});

describe('createGenderTabRow', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should create gender tab row with correct structure', () => {
        const genderTabRow = createGenderTabRow();

        expect(genderTabRow.className).toBe('tab-row gender-tabs');
        expect(genderTabRow.children).toHaveLength(3);
    });

    it('should create all gender tabs with correct tab IDs', () => {
        const genderTabRow = createGenderTabRow();
        const tabIds = [...genderTabRow.children].map(tab => tab.dataset.tabId);

        expect(tabIds).toEqual([TAB_KEY.MASCULINE, TAB_KEY.FEMININE, TAB_KEY.NEUTER]);
    });

    it('should mark active gender tab as active', async () => {
        const { getActiveTabGender } = await import('@detail-core');
        getActiveTabGender.mockReturnValue(TAB_KEY.FEMININE);

        const genderTabRow = createGenderTabRow();
        const feminineTab = genderTabRow.querySelector('[data-tab-id="FEMININE"]');

        expect(feminineTab.classList.contains('is-active')).toBe(true);
    });

    it('should set all tabs to voice group', () => {
        const genderTabRow = createGenderTabRow();
        const allTabs = genderTabRow.querySelectorAll('.tab-item');

        for (const tab of allTabs) {
            expect(tab.dataset.tabGroup).toBe('gender');
        }
    });
});

describe('createTabsWrapper', () => {
    it('should create wrapper with correct structure', () => {
        const wrapper = createTabsWrapper();

        expect(wrapper.className).toBe('conjugation-tabs-wrapper');
        expect(wrapper.id).toBe('conjugation-tabs');
        expect(wrapper.children).toHaveLength(2);
    });

    it('should contain voice and gender tab rows', () => {
        const wrapper = createTabsWrapper();

        const voiceRow = wrapper.querySelector('.voice-tabs');
        const genderRow = wrapper.querySelector('.gender-tabs');

        expect(voiceRow).toBeTruthy();
        expect(genderRow).toBeTruthy();
    });

    it('should have voice tabs as first child and gender tabs as second', () => {
        const wrapper = createTabsWrapper();

        expect(wrapper.children[0].classList.contains('voice-tabs')).toBe(true);
        expect(wrapper.children[1].classList.contains('gender-tabs')).toBe(true);
    });
});