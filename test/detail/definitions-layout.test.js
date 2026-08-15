// Layout regression test for the expanded definitions list.
// jsdom does not lay out text or render list markers, so this renders the real
// markup with the real stylesheet in headless Chromium and measures positions.

import {describe, it, expect, beforeAll, afterAll} from "vitest";
import {chromium} from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {renderDefinitions} from "@detail/render-definitions.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stylesDirectory = path.join(__dirname, "../../src/styles");

const definitions = [
    {text: "a first sense"},
    {text: "a second sense"},
    {text: "a third sense"},
];

let browser;

beforeAll(async () => {
    browser = await chromium.launch();
});

afterAll(async () => {
    await browser?.close();
});

describe("expanded definitions list alignment", () => {
    it("renders list numbers no further left than the Definitions label", async () => {
        const markup = renderDefinitionsMarkup();
        const css = await loadStyles();

        const page = await browser.newPage();
        await page.setContent(
            `<style>${css}</style><div id="definitions-container">${markup}</div>`
        );

        const {labelLeft, markerLeft} = await page.evaluate(measureAlignment);
        await page.close();

        expect(markerLeft).toBeGreaterThanOrEqual(labelLeft - 1);
    });
});

// Builds the real container markup by running the production renderer under jsdom
function renderDefinitionsMarkup() {
    document.body.innerHTML = `<div id="definitions-container"></div>`;
    renderDefinitions(definitions, undefined, "NOUN", undefined, "a first sense");

    const container = document.querySelector("#definitions-container");
    // The toggle's click handler cannot cross into the browser page, so expand here
    container.querySelector("ol").style.display = "block";

    return container.innerHTML;
}

async function loadStyles() {
    const [palette, base] = await Promise.all([
        fs.readFile(path.join(stylesDirectory, "palette.css"), "utf8"),
        fs.readFile(path.join(stylesDirectory, "base.css"), "utf8"),
    ]);
    return `${palette}\n${base}`;
}

// Runs in the browser: compares the label's left edge to where the list marker starts.
// Markers are not in the DOM, so the marker's left edge is derived from the list item's
// content edge minus the width of the marker text measured in the same font.
function measureAlignment() {
    const label = document.querySelector(".definitions-label");
    const listItem = document.querySelector(".definitions-list > li");

    const textRange = document.createRange();
    textRange.selectNodeContents(listItem);
    const listItemTextLeft = textRange.getBoundingClientRect().left;

    const probe = document.createElement("span");
    probe.style.font = getComputedStyle(listItem).font;
    probe.style.position = "absolute";
    probe.style.whiteSpace = "pre";
    probe.textContent = "1.";
    document.body.append(probe);
    const markerWidth = probe.getBoundingClientRect().width;
    probe.remove();

    return {
        labelLeft: label.getBoundingClientRect().left,
        markerLeft: listItemTextLeft - markerWidth,
    };
}
