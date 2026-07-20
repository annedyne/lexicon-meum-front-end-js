// Reusable manual check: looks up a real word's data from the live backend,
// then drives the app's actual search-and-render flow and screenshots the
// resulting detail view at phone/iPad/desktop widths.
//
// Backend responses are fetched here in Node (not subject to browser CORS)
// and replayed into the page via route interception, so this works even
// when the local backend's CORS config blocks the dev server's origin.
//
// Usage: node test/manual/screenshot-word-detail.js <word> [partOfSpeech] [appUrl]
// Example: node test/manual/screenshot-word-detail.js bonus ADJECTIVE

import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "screenshots");
const word = process.argv[2];
const partOfSpeech = process.argv[3];
const appUrl = process.argv[4] ?? "http://localhost:5173/";
const apiBaseUrl = process.env.VITE_API_BASE_URL ?? "http://localhost:8085/api/v1";

if (!word) {
    console.error("Usage: node test/manual/screenshot-word-detail.js <word> [partOfSpeech] [appUrl]");
    process.exit(1);
}

const suggestionsRes = await fetch(`${apiBaseUrl}/lexemes/autocomplete/prefix?prefix=${encodeURIComponent(word)}`);
const suggestions = await suggestionsRes.json();
const match = suggestions.find(s => s.word === word && (!partOfSpeech || s.partOfSpeech === partOfSpeech));

if (!match) {
    console.error(`No suggestion found for "${word}"${partOfSpeech ? ` (${partOfSpeech})` : ""}`);
    process.exit(1);
}

const detailRes = await fetch(`${apiBaseUrl}/lexemes/${match.lexemeId}/detail`);
const detail = await detailRes.json();

const viewports = {
    phone: { width: 390, height: 844 },
    ipad: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 800 },
};

const browser = await chromium.launch();
const page = await browser.newPage();

await page.route(url => url.pathname.includes("/autocomplete/prefix"), route =>
    route.fulfill({ json: [match] }));
await page.route(url => url.pathname.includes(`/lexemes/${match.lexemeId}/detail`), route =>
    route.fulfill({ json: detail }));

await page.goto(appUrl);
await page.fill("#word-lookup-input", word);
await page.waitForSelector("#word-suggestions div");
await page.click("#word-suggestions div");
await page.waitForSelector("#inflections-container table");

for (const [name, viewport] of Object.entries(viewports)) {
    await page.setViewportSize(viewport);
    const outputPath = path.join(outputDir, `${word}-${name}.png`);
    await page.screenshot({ path: outputPath, fullPage: true });
    console.log(`Saved ${outputPath}`);
}

await browser.close();
