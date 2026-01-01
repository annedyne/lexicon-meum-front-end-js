import {describe, it, expect} from "vitest";
import {capitalize }  from "@utilities";

describe("capitalize", () => {

    it("undefined argument returns empty string", () => {
        expect(capitalize()).toBe("")
    });

    it('Empty string returns empty string', () => {
        expect(capitalize('')).toBe('');
    });

    it('should capitalize the first letter of a lowercase string', () => {
        expect(capitalize('hello')).toBe('Hello');
    });

    it('should capitalize the first letter of an uppercase string', () => {
        expect(capitalize('HELLO')).toBe('Hello');
    });

    it('should keep already capitalized string as is', () => {
        expect(capitalize('Hello')).toBe('Hello');
    });

    it('should capitalize mixed case string', () => {
        expect(capitalize('hELLO')).toBe('Hello');
    });

    it('should handle single character strings', () => {
        expect(capitalize('a')).toBe('A');
        expect(capitalize('A')).toBe('A');
    });

    it('should handle strings with spaces', () => {
        expect(capitalize('hello world')).toBe('Hello World');
    });

    it('should only capitalize the first letter, leaving rest unchanged', () => {
        expect(capitalize('hello WORLD')).toBe('Hello World');
    });

    it('should handle strings with special characters', () => {
        expect(capitalize('!hello')).toBe('!hello');
        expect(capitalize('123abc')).toBe('123abc');
    });

    it('should handle strings with macrons', () => {
        expect(capitalize('āmō')).toBe('Āmō');
    })
});