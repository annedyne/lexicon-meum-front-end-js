import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

// Get `__dirname` in ESM (since it's not available natively)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      "@detail": path.resolve(__dirname, "./src/detail"),
      "@search": path.resolve(__dirname, "./src/search"),
      "@api": path.resolve(__dirname, "./src/api"),
      // Add more aliases as needed
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
  },
});
