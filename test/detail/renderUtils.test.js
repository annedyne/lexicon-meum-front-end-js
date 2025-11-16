import { describe, it, expect } from 'vitest';
import { matchesInflection, capitalize } from '@detail/renderUtils.js';

describe('matchesInflection', () => {
    it('should return true when inflection matches search input exactly', () => {
        expect(matchesInflection('puella', 'puella')).toBe(true);
    });

    it('should return true when inflection matches search input with different case', () => {
        expect(matchesInflection('Puella', 'puella')).toBe(true);
        expect(matchesInflection('puella', 'PUELLA')).toBe(true);
        expect(matchesInflection('PuElLa', 'pUeLlA')).toBe(true);
    });

    it('should return true when inflection with macrons matches search input without macrons', () => {
        expect(matchesInflection('puellā', 'puella')).toBe(true);
        expect(matchesInflection('amō', 'amo')).toBe(true);
        expect(matchesInflection('dūcō', 'duco')).toBe(true);
    });

    it('should return true when inflection without macrons matches search input with macrons', () => {
        expect(matchesInflection('puella', 'puellā')).toBe(true);
        expect(matchesInflection('amo', 'amō')).toBe(true);
    });

    it('should return true when both have macrons but in different cases', () => {
        expect(matchesInflection('Amō', 'amō')).toBe(true);
        expect(matchesInflection('PUELLĀ', 'puellā')).toBe(true);
    });

    it('should return false when inflection does not match search input', () => {
        expect(matchesInflection('puella', 'puer')).toBe(false);
        expect(matchesInflection('amo', 'amas')).toBe(false);
    });

    it('should return false when inflection is undefined', () => {
        expect(matchesInflection(undefined, 'puella')).toBe(false);
    });

    it('should return false when inflection is null', () => {
        expect(matchesInflection(null, 'puella')).toBe(false);
    });

    it('should return false when inflection is empty string', () => {
        expect(matchesInflection('', 'puella')).toBe(false);
    });

    it('should return false when search input is undefined', () => {
        expect(matchesInflection('puella', undefined)).toBe(false);
    });

    it('should return false when search input is null', () => {
        expect(matchesInflection('puella', null)).toBe(false);
    });

    it('should return false when search input is empty string', () => {
        expect(matchesInflection('puella', '')).toBe(false);
    });

    it('should return false when both inflection and search input are empty', () => {
        expect(matchesInflection('', '')).toBe(false);
    });

    it('should return false when both inflection and search input are null', () => {
        expect(matchesInflection(null, null)).toBe(false);
    });

    it('should handle multiple diacritics', () => {
        expect(matchesInflection('āēīōū', 'aeiou')).toBe(true);
        expect(matchesInflection('ĀĒĪŌŪ', 'aeiou')).toBe(true);
    });
});

describe('capitalize', () => {
    it('should capitalize the first letter of a lowercase string', () => {
        expect(capitalize('hello')).toBe('Hello');
    });

    it('should capitalize the first letter of an uppercase string', () => {
        expect(capitalize('HELLO')).toBe('HELLO');
    });

    it('should keep already capitalized string as is', () => {
        expect(capitalize('Hello')).toBe('Hello');
    });

    it('should capitalize mixed case string', () => {
        expect(capitalize('hELLO')).toBe('HELLO');
    });

    it('should handle single character strings', () => {
        expect(capitalize('a')).toBe('A');
        expect(capitalize('A')).toBe('A');
    });

    it('should handle empty string', () => {
        expect(capitalize('')).toBe('');
    });

    it('should handle strings with spaces', () => {
        expect(capitalize('hello world')).toBe('Hello world');
    });

    it('should only capitalize the first letter, leaving rest unchanged', () => {
        expect(capitalize('hello WORLD')).toBe('Hello WORLD');
    });

    it('should handle strings with special characters', () => {
        expect(capitalize('!hello')).toBe('!hello');
        expect(capitalize('123abc')).toBe('123abc');
    });

    it('should handle strings with macrons', () => {
        expect(capitalize('āmō')).toBe('Āmō');
    });
});