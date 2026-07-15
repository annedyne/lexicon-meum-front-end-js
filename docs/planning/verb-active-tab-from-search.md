# Plan: default verb tab to the tab containing the search match

## Goal

When a verb detail loads, the initially active conjugation tab should be the one
that contains the highlighted search term, instead of always defaulting to
`TAB_KEY.ACTIVE` + `TAB_KEY.MASCULINE`.

Search term source: `getSearchInput()` from `src/detail/detail-context.js`.
Match rule: reuse `matchesInflection` (diacritic-insensitive, lowercase, exact)
from `src/detail/utilities.js` — the same predicate used to highlight cells.

## Current behavior

- `detail-context.js` initializes `state.activeTab = {voice: ACTIVE, gender: MASCULINE}`.
- This state is a module singleton and is never reset between word loads.
- `render-word-detail.js` (VERB case) calls `initializeInflectionTabs(inflectionTable)`.
- `initializeInflectionTabs` -> `renderTabs`, which reads `getActiveTabVoice()` /
  `getActiveTabGender()` to mark the active tab and fires `onChange(voice, gender)`
  to render that tab's content.

So setting the active-tab state *before* `renderTabs` runs is enough — both the
tab highlight and the rendered content follow from it.

## Where the search term can live (data shapes, from the renderers)

- Voice tabs ACTIVE / PASSIVE -> `inflectionTable.conjugations` (array)
    - each: `{voice, mood, tenses: [{defaultName, forms: [string, ...]}]}`
    - conjugation forms do NOT vary by gender, so gender tab is irrelevant here.
- PARTICIPLE tab -> `inflectionTable.participles` (array)
    - each: `{voice: "participle", gender, tenses: [{declensions: {SINGULAR: {case: form}, PLURAL: {case: form}}}]}`
    - a participle match also pins the gender tab to that entry's `gender`.

## Design

Two separate functions: a **matcher** that reports which tabs contain the search
term, and a **resolver** that picks the one tab to auto-select. The matcher is
the reusable piece — a later feature will use its output to add a CSS class to
*every* tab that contains the term, not just the selected one.

### 1. Matcher (standalone, reusable)

`src/detail/verb/find-search-matches-in-tabs.js`

```
findSearchMatchesByTab(inflectionTable, searchInput) -> {
  voices:           { ACTIVE: bool, PASSIVE: bool, PARTICIPLE: bool },
  participleGenders:{ MASCULINE: bool, FEMININE: bool, NEUTER: bool },
}
```

Behavior:

- All-false result if no `searchInput` / no `inflectionTable`.
- Uses `matchesInflection(form, searchInput)` (same predicate as cell highlight).
- `voices.ACTIVE/PASSIVE`: true if any `conjugations` entry of that voice has a
  matching `tenses[].forms[]` value.
- `voices.PARTICIPLE`: true if any participle entry has a match.
- `participleGenders[g]`: true if the participle entry with that `gender` has a
  matching SINGULAR/PLURAL declension value.
- Deponents simply have no passive data, so `voices.PASSIVE` stays false — no
  special case needed.

Keep it small: one helper to test a `forms` array, one to walk participle
declension values.

This map is exactly what the future "highlight tabs containing the search" CSS
feature needs: iterate voice tabs against `voices`, gender tabs against
`participleGenders`, toggle a class.

### 2. Resolver (selection only)

`src/detail/verb/resolve-initial-tab.js`

```
resolveInitialTab(matches) -> { voice, gender }
```

- Input is the matcher's output (so the two stay independent).
- Priority Active -> Passive -> Participle; first true `voices.*` wins.
- ACTIVE/PASSIVE win -> `gender: MASCULINE` (conjugations have no gender dimension).
- PARTICIPLE wins -> `gender` = first true entry in `participleGenders`
  (M -> F -> N), defaulting to MASCULINE.
- Nothing matches -> default `{ ACTIVE, MASCULINE }`.

### 3. Apply the resolved tab before rendering

In `initializeInflectionTabs` (`inflection-tab-controller.js`), before `renderTabs`:

```
const matches = findSearchMatchesByTab(inflectionTableData, getSearchInput());
const { voice, gender } = resolveInitialTab(matches);
setActiveTabVoice(voice);
setActiveTabGender(gender);
```

Imports come from `@detail-core` (context) — consistent with `render-tabs.js`.
Holding `matches` here also leaves it available to pass into `renderTabs` later
for the tab-highlight feature.

Putting this in the controller (not `render-word-detail.js`) keeps the change
inside the verb tab subsystem and leaves the renderer's switch untouched.

Side benefit: setting the active tab on every load also fixes the existing
stale-state issue where a tab clicked on a previous word carried over.

## Edge cases

- **Deponent verbs**: never have passive forms, so PASSIVE never matches and the
  disabled passive tab is never auto-selected. No extra guard required.
- **Match in multiple tabs**: resolved by Active -> Passive -> Participle priority.
- **Conjugation gender**: stays MASCULINE for active/passive matches.

## Tests

`test/detail/verb/find-search-matches-in-tabs.test.js`:

- match in active forms -> `voices.ACTIVE` true, others false
- match in passive forms -> `voices.PASSIVE` true
- match in a feminine participle -> `voices.PARTICIPLE` + `participleGenders.FEMININE`
- term in both active and a participle -> both voices true (proves it reports all)
- no search input / no match -> all false

`test/detail/verb/resolve-initial-tab.test.js`:

- active match -> `{ACTIVE, MASCULINE}`
- passive match (no active) -> `{PASSIVE, MASCULINE}`
- participle feminine match -> `{PARTICIPLE, FEMININE}`
- active + participle -> ACTIVE wins (priority)
- all false -> default `{ACTIVE, MASCULINE}`

## Files touched

- add: `src/detail/verb/find-search-matches-in-tabs.js`
- add: `src/detail/verb/resolve-initial-tab.js`
- edit: `src/detail/verb/inflection-tab-controller.js` (match + resolve + set tab state)
- add: `test/detail/verb/find-search-matches-in-tabs.test.js`
- add: `test/detail/verb/resolve-initial-tab.test.js`
- maybe edit: `src/detail/verb/index.js` (export if tests import via barrel)
