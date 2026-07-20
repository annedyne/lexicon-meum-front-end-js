## Requirements

## Don't break existing design

The ipad and desktop versions look good, so make sure any changes don't break them.

## Use Responsive Design Techniques

Adhere to best practices for web ux and ui design

## Usability Notes

- When possible, preserve a view that allows the user to visually compare the different sets of forms.
  Ex: Prefer allowing the outer grammar table to narrow so that three columns of forms are visible at once, rather than
  breaking
  it up into vertical stacks that the user has to scroll down to see. Do not, however do this at the expense of the
  user's eyes. Font-size must be at least what is considered the best-practice minimum for phones.

## Current State

- No `viewport` meta tag exists in `index.html`. This is the root cause of most of the bad phone rendering: without
  it, phones render the page at a virtual desktop width and zoom out, rather than laying out at the true device width.
- No `@media` queries exist anywhere in `src/styles/`. All current responsiveness comes from `clamp()`/`vw` units
  (banner) and `overflow-x: auto` fallback (inflection tables) — a blank slate for phone-specific rules.
- The "three columns of forms" in the usability note refers to the adjective agreement table
  (`render-adjective-agreement-table.js`), which renders up to 3 gender columns (m/f/n) per table via
  `table-layout: fixed`. On a narrow phone this currently just horizontally scrolls rather than adapting.

## Plan

Each phase is independently shippable and testable — Playwright screenshots at phone (~390px), iPad (~768px), and
desktop (~1280px) widths before/after each phase, checking the target fix landed and iPad/desktop stayed unchanged.

### Phase 1 — Viewport foundation
**What it does:** Fixes the root cause of phones rendering the site zoomed-out at desktop width. This alone should
visibly improve almost everything, before any CSS is touched.
- Add a standard responsive viewport meta tag to `index.html`.

### Phase 2 — Header & search layout (`base.css`)
**What it does:** Cleans up the search bar area (input, checkbox, banner) so it doesn't crowd or overflow on a
narrow screen, and makes sure toast notifications aren't clipped at the screen edge.
- Add a narrow-viewport breakpoint for `.grid-container` / `.header-container` / `.input-container` spacing so the
  search input and "search word endings" checkbox don't crowd each other on small screens.
- Let `.input-field`'s fixed 200px width become relative/fluid below the breakpoint so it scales with the viewport
  instead of a hardcoded pixel value.
- Adjust `.toast` positioning/width at narrow widths so it isn't clipped at the screen edge.

### Phase 3 — Grammar tables (`inflection-table.css`)
**What it does:** The core requirement — keeps the 2–3 column declension/agreement tables side-by-side and readable
on a phone instead of forcing horizontal scroll, without shrinking text below the mobile-readable minimum.
- Add a narrow-viewport breakpoint that trims the desktop-only cosmetic padding (e.g. the 4rem right padding on the
  last column, the wider header padding) so the 2–3 column tables keep fitting side-by-side within the phone's
  width, avoiding the horizontal-scroll fallback wherever reasonably possible.
- Re-tune the fixed case-row/col-header widths at that breakpoint so they don't crowd out the form columns.
- Verify table font-size stays at or above the mobile best-practice minimum as padding is trimmed.

### Phase 4 — Conjugation tabs (`inflection-table.css`)
**What it does:** Makes sure the Active/Passive/Participle tab bar stays usable and doesn't wrap awkwardly once the
table it sits above has been narrowed in Phase 3.
- Add a narrow-viewport adjustment to the conjugation tab bar (`.tab-item` padding/font-size).

## Verification

Each phase: launch the dev server, use Playwright (installed as a devDependency) to screenshot the page at phone/
iPad/desktop viewport widths, and visually confirm the phase's fix landed and iPad/desktop are unchanged.