/* @vitest-environment jsdom */
import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const requiredIds = [
    "word-lookup-input",
    "suffix-search",
    "word-suggestions",
    "lemma-container",
    "definitions-container",
    "principal-parts-container",
    "inflection-type-container",
    "inflections-container",
    "toast",
];

describe("index.html provides required elements for main.js", () => {
    beforeAll(() => {
        //
        const file = resolve(process.cwd(), "index.html");
        const html = readFileSync(file, "utf8");
        const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const bodyInner = match ? match[1] : "";
        document.body.innerHTML = bodyInner;
    });

    it("contains all required DOM nodes", () => {
        for (const id of requiredIds) {
            const el = document.getElementById(id);
            expect(el, `Missing #${id} in index.html`).toBeTruthy();
        }
    });

    it("main.js initializes safely with the real DOM", async () => {
        // Import after DOM is populated so the module sees expected nodes.
        await import("../../src/main.js");

        // A couple of smoke checks that main.js ran and touched the DOM as expected
        expect(document.getElementById("word-suggestions").style.display).toBe("none");
        expect(document.documentElement.getAttribute("data-theme")).toBe("bronze");
    });
});