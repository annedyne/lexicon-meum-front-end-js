/* @vitest-environment jsdom */
import {describe, it, expect, beforeAll, afterEach, vi} from "vitest";
import {readFileSync} from "node:fs";
import path from "node:path";
import {CSS_CLASSES} from "@utilities";

vi.mock("@search", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        handleWordLookup: vi.fn(),
    };
});

vi.mock("@detail", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        handleLoadWordDetail: vi.fn(),
    };
});

const rawSuggestions = [
    {word: "alpha", lexemeId: 101, partOfSpeech: "NOUN", suggestionParent: "alpha"},
    {word: "beta", lexemeId: 102, partOfSpeech: "NOUN", suggestionParent: "beta"},
];

describe("wordLookupInput event listener", () => {
    let handleWordLookup;
    let handleLoadWordDetail;
    let input;
    let suggestionsBox;

    beforeAll(async () => {
        // jsdom does not implement scrollIntoView.
        Element.prototype.scrollIntoView = vi.fn();

        const html = readFileSync(path.resolve(process.cwd(), "index.html"), "utf8");
        const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        document.body.innerHTML = match ? match[1] : "";
        await import("../../src/main.js");
        ({handleWordLookup} = await import("@search"));
        ({handleLoadWordDetail} = await import("@detail"));
        input = document.querySelector("#word-lookup-input");
        suggestionsBox = document.querySelector("#word-suggestions");
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    it("passes lowercased query to handleWordLookup", async () => {
        vi.useFakeTimers();

        handleWordLookup.mockResolvedValue({status: "success", data: []});
        input.value = "AMOR";
        input.dispatchEvent(new Event("input"));

        await vi.advanceTimersByTimeAsync(200);

        expect(handleWordLookup).toHaveBeenCalledWith("amor", expect.any(Function), false);
    });

    // Types a query and lets the debounced suggestion list render.
    async function renderSuggestions() {
        vi.useFakeTimers();
        handleWordLookup.mockResolvedValue({status: "success", data: rawSuggestions});
        input.value = "a";
        input.dispatchEvent(new Event("input"));
        await vi.advanceTimersByTimeAsync(200);
    }

    it("activates the top suggestion on Enter with no arrow presses", async () => {
        await renderSuggestions();

        input.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));

        expect(handleLoadWordDetail).toHaveBeenCalledWith("alpha", 101);
    });

    it("moves the selection down with ArrowDown and activates it on Enter", async () => {
        await renderSuggestions();

        input.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowDown"}));
        input.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));

        expect(handleLoadWordDetail).toHaveBeenCalledWith("beta", 102);
    });

    it("keeps the selection on the first item when ArrowUp is pressed at the top", async () => {
        await renderSuggestions();

        input.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowUp"}));

        expect(suggestionsBox.children[0].classList.contains(CSS_CLASSES.SUGGESTION_SELECTED)).toBe(true);
    });

    it("keeps the selection on the last item when ArrowDown is pressed at the bottom", async () => {
        await renderSuggestions();

        input.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowDown"}));
        input.dispatchEvent(new KeyboardEvent("keydown", {key: "ArrowDown"}));

        const lastIndex = suggestionsBox.children.length - 1;
        expect(suggestionsBox.children[lastIndex].classList.contains(CSS_CLASSES.SUGGESTION_SELECTED)).toBe(true);
    });

    it("does nothing on Enter when no suggestions are shown", async () => {
        vi.useFakeTimers();
        handleWordLookup.mockResolvedValue({status: "success", data: []});
        input.value = "a";
        input.dispatchEvent(new Event("input"));
        await vi.advanceTimersByTimeAsync(200);

        input.dispatchEvent(new KeyboardEvent("keydown", {key: "Enter"}));

        expect(handleLoadWordDetail).not.toHaveBeenCalled();
    });
});