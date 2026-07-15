# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server (uses .env.development)
npm run build        # production build -> dist/
npm run lint         # ESLint
npm run format       # Prettier (write)
npm run format:check # Prettier (check only)
npm test             # run all tests (vitest)
npm test -- --watch  # watch mode
npx vitest run path/to/file.test.js  # single test file
```

Tests default to jsdom environment (set in `vite.config.js`). Override per-file with `/* @vitest-environment jsdom */`.

## Architecture

Vanilla JS, no framework. Vite build. ESM modules throughout.

### Entrypoint

`src/main.js` owns the DOM event listeners (input, keydown, click-outside) and renders the autocomplete dropdown. It
imports from the three feature modules below via path aliases.

### Feature modules

**`src/search/`** — autocomplete pipeline, left-to-right:

1. `validate.js` — checks minimum query length; normalizes query (trim + lowercase)
2. `handle-word-lookup.js` — calls the injected `fetchSuggestions` fn, returns `{status data|message}`
3. `transform-word-suggestion-data.js` — normalizes raw API array
4. `prepare-suggestion-items.js` — applies highlight logic for display

**`src/api/`** — thin fetch wrappers for both backend endpoints. Base URL comes from
`import.meta.env.VITE_API_BASE_URL`.

**`src/detail/`** — renders the word detail panel after a suggestion is clicked:

- `handle-load-word-detail.js` — fetches data then calls `renderWordDetail`
- `render-word-detail.js` — common fields first (lemma, definitions, POS label, inflection class), then switches on
  `partOfSpeech` to route to a POS-specific renderer
- `detail-context.js` — module-level singleton holding active tab state, search input, and morphological subtype;
  cleared/set on each load
- `verb/` — tab system for Active / Passive / Participle conjugation views; `inflection-tab-controller.js` orchestrates
  rendering via `tab-registry.js`

**`src/utilities/`** — shared constants (`POS`, `CSS_CLASSES`, `StatusMessageType`, etc.), error helpers, string utils.

### Path aliases (vite.config.js)

| Alias          | Path                    |
|----------------|-------------------------|
| `@src`         | `src/`                  |
| `@api`         | `src/api/`              |
| `@search`      | `src/search/`           |
| `@detail`      | `src/detail/`           |
| `@detail-core` | `src/detail/_internal/` |
| `@utilities`   | `src/utilities/`        |

### Module boundary rules (ESLint)

- Cross-directory imports **must go through `index.js`** barrel files — direct internal file imports are warned.
- Within a directory, use **relative paths**, not the alias — the alias is for external consumers only.
- All filenames must be **kebab-case**.

### Required DOM IDs

`index.html` must provide these IDs (verified by `test/app/dom-contract.test.js`):
`#word-lookup-input`, `#suffix-search`, `#word-suggestions`, `#lemma-container`, `#definitions-container`,
`#principal-parts-container`, `#inflection-type-container`, `#inflections-container`, `#toast`

### Backend dependency

Spring Boot backend (separate repo: `github.com/annedyne/lexiconmeum`). Default dev URL: `http://localhost:8085/api/v1`.
Endpoints consumed:

- `GET /lexemes/autocomplete/prefix?prefix=<string>`
- `GET /lexemes/autocomplete/suffix?suffix=<string>`
- `GET /lexemes/{id}/detail`