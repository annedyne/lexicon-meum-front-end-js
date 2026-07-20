// Reusable manual check: screenshots the app at phone/iPad/desktop widths.
// Usage: node test/manual/screenshot-viewports.js [url]
// Requires the dev server to already be running (npm run dev).

import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "screenshots");
const url = process.argv[2] ?? "http://localhost:5173/";

const viewports = {
    phone: { width: 390, height: 844 },
    ipad: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 800 },
};

const browser = await chromium.launch();

for (const [name, viewport] of Object.entries(viewports)) {
    const page = await browser.newPage({ viewport });
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    const outputPath = path.join(outputDir, `${name}.png`);
    await page.screenshot({ path: outputPath, fullPage: true });
    console.log(`Saved ${outputPath}`);
    await page.close();
}

await browser.close();
