# Add Verbal Noun Section to Participles Tab

Add a new function to render-participle-inflections.js called from renderParticipleInflections that will add a new
section right below the list of Participle Tenses in the Participles Tab.
The new section will contain Gerund and Supine inflection sets.

The new section will only differ from the preceding participle tense rows in that instead of a single tense with the
tense header and singular
inflections in the left column and plural in the right, it will contain:

- The tense name header and a set of Gerund inflections in the left tense column.
- The tense name Header a set of Supine inflections in the right tense column.

Below is an example of the json structure for Supine and Gerund. They will be the last two objects in each array of '
participleTenses'. The Gerund structure will be the same. Only use the SINGULAR inflection set, since a single form is
used for both
singluar and plural in gerund and supine.

```json
 {
  "altName": "Supine",
  "declensions": {
    "SINGULAR": {
      "ACCUSATIVE": "amātum",
      "ABLATIVE": "amātū"
    },
    "PLURAL": {
      "ACCUSATIVE": "amātum",
      "ABLATIVE": "amātū"
    }
  },
  "defaultName": "Supine"
}
```