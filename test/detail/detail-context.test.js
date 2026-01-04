import { describe, it, expect } from 'vitest';
import {
    setActiveTabVoice,
    getActiveTabVoice,
    setActiveTabGender,
    getActiveTabGender
} from '@detail/detail-context.js';
import { TAB_KEY } from '@detail/verb/tabs/tab-keys.js';

describe('Tab State Management', () => {
    describe('Voice Tab State', () => {
        it('should default to ACTIVE voice', () => {
            // Test initial state
            expect(getActiveTabVoice()).toBe(TAB_KEY.ACTIVE);
        });

        it('should set and get passive tab voice', () => {
            setActiveTabVoice(TAB_KEY.PASSIVE);
            expect(getActiveTabVoice()).toBe(TAB_KEY.PASSIVE);
        });
    });

    describe('Gender Tab State', () => {
        it('should default to MASCULINE gender', () => {
            expect(getActiveTabGender()).toBe(TAB_KEY.MASCULINE);
        });

        it('should set and get active tab gender', () => {
            setActiveTabGender(TAB_KEY.FEMININE);
            expect(getActiveTabGender()).toBe(TAB_KEY.FEMININE);
        });

    });
});