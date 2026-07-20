# Show appropriate form of congugation for currently active gender tab.

## UI

When a verb detail is loaded, and ACTIVE or PASSIVE tab is ACTIVE and user clicks on a gender tab, only the forms
appropriate
for the active gender tab should be displayed. Some forms are gender agnostic and should always be displayed. Some forms
are gender specific (Ex: compound tense forms that include a participle form)

The conjugations part of the detail response object for verbs now includes the gendered conjugation forms. (see
@docs/planning/newConjugationResponseStrucure.json)

Now if a given tense includes a gendered form, instead of a 'forms' key to a forms array, the response object will
contain a formsByGender key form pointing to three arrays keyed by masculine, feminine, and neuter. If a given tense
does not include a gender-specific form, the response object structure has not changed, and contains only a 'forms' key
pointing to a list of forms.

The relevant rendering code ( @src/detail/verb/render-conjugation-shared.js ) will need to be updated to handle this new
structure, i.e. If the key is forms, those forms should be displayed regardless of the active gender tab. If '
formsByGender', only the forms associated with the active tab gender must be displayed.

Implementation should follow best practices for readable, maintainable, testable javascript. Create a succinct
implementation plan including any relevant design decisions. I don't need every detail (I'll see that in the code) I
just want a description of the approach.

## Approach

### Key observation

Re-rendering on gender-tab click is already handled: the tab controller re-routes content with the new gender, and
the active gender already flows into `renderConjugationByVoice`. The only gap is that the shared renderer reads
`tense.forms` directly and ignores gender. So the change is localized to form resolution — no new tab wiring.

### `src/detail/verb/render-conjugation-shared.js`

- Add a small pure helper that resolves a tense to the forms array to display, given the active gender:
    - Tense has `forms` -> return it (gender-agnostic; shown for every gender).
    - Tense has `formsByGender` -> return the array for the active gender.
- Thread the active gender down to where forms are resolved (row-count calc and per-row cell builder) so both use the
  resolver instead of reading `.forms` directly. Downstream row/cell code then stays gender-unaware.

### Gender key normalization

- Active tab gender is an uppercase `TAB_KEY` (e.g. `MASCULINE`); `formsByGender` keys are lowercase. Normalize at
  lookup so the resolver maps between them in one place.

### Testability

- Keep the resolver a standalone pure function (tense + gender -> forms array) so it is unit-testable with no DOM.

### Missing gender key

- Not expected to occur, but if a `formsByGender` tense omits the active gender's key, render an empty/padded column
  (matching current odd-count behavior).
