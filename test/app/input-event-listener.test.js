/* @vitest-environment jsdom */
import {describe, it, expect, beforeAll, afterEach, vi} from "vitest";
import {readFileSync} from "node:fs";
import path from "node:path";

vi.mock("@search", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        handleWordLookup: vi.fn(),
    };
});

describe("wordLookupInput event listener", () => {
    let handleWordLookup;

    beforeAll(async () => {
        const html = readFileSync(path.resolve(process.cwd(), "index.html"), "utf8");
        const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        document.body.innerHTML = match ? match[1] : "";
        await import("../../src/main.js");
        ({handleWordLookup} = await import("@search"));
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    it("passes lowercased query to handleWordLookup", async () => {
        vi.useFakeTimers();

        handleWordLookup.mockResolvedValue({status: "success", data: []});
        const input = document.querySelector("#word-lookup-input");
        input.value = "AMOR";
        input.dispatchEvent(new Event("input"));

        await vi.advanceTimersByTimeAsync(200);

        expect(handleWordLookup).toHaveBeenCalledWith("amor", expect.any(Function), false);
    });
});