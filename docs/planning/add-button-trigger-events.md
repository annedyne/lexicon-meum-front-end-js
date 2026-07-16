# Add some keyboard bindings

1. I want 'enter' to trigger detail request (handleLoadWordDetail in src/detail/handle-load-word-detail.js ) for the top
   item in the
   current search suggestion list.
2. I want 'up arrow' and 'down arrow to select the previous and next items in the current search suggestion list.

---

## Implementation Plan

### Files to change

1. **`src/search/search-context.js`** (new)
    - New module-level singleton holding the currently selected suggestion index, mirroring the
      `detail-context.js` pattern. Get/set/reset it; default index 0.
    - Export it through the `@search` barrel so `main.js` consumes it like other search functions.

2. **`src/main.js`**
    - On render, reset selection via `search-context` and mark first item selected.
    - On hide, reset selection via `search-context`.
    - Extend keydown handling: arrow keys move the selection (via `search-context`) within list bounds; Enter
      activates the selected item the same way a click does.
    - Add a helper to move the "selected" visual indicator between items and keep it scrolled into view.

3. **`src/utilities/constants.js`**
    - Add a CSS class name for the keyboard-selected state.

4. **`src/styles/base.css`**
    - Style that class so keyboard selection is visually distinct from hover and from the exact-match highlight.

No changes to `handle-load-word-detail.js`, `prepare-suggestion-items.js`, or API layer.

### Testing

- Unit test `search-context.js` directly: default index, set/reset behavior.
- Extend `test/app/input-event-listener.test.js`:
    - Enter with no arrow presses -> `handleLoadWordDetail` called with top item.
    - ArrowDown x N, Enter -> called with item N.
    - ArrowUp at index 0 -> stays at 0.
    - ArrowDown at last index -> stays at last.
    - Selected class on expected child after arrow presses.
    - Enter with no suggestions rendered -> not called.
- `npm test` for regressions.
- Manual check in `npm run dev`: default top-item selection, Enter, arrow up/down incl. edges.