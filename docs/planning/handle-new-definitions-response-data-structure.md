# Handle Updated deatil.definitions structure

Currently, src/detail/render-definitions.js expects and handles a flat list of definitions like this:

```json
{
  "definitions": [
    "great, large, big; (of things) vast, extensive, spacious (of physical size or quantity)",
    "especially:",
    "great, much, abundant, considerable (of measure, weight, quantity)",
    "especially:",
    "synonym of longus, multus",
    "especially:",
    "loud, powerful, strong, mighty (of voice)",
    "great, grand, mighty, noble, lofty, important, of great weight or importance, momentous",
    "advanced in years, of great age, aged (of age, with nātu)",
    "high, dear, of great value, at a high price"
  ]
}
```

But the definitions structure has changed. See the two below examples:

```json
{
  "shortDefinition": "great, large, big; (of things) vast, extensive, spacious (of physical size or quantity)",
  "definitions": [
    {
      "text": "(transitive, or in absolute use) to love"
    },
    {
      "text": "to be fond of, like, admire"
    },
    {
      "text": "(transitive) to be pleased by or with (someone or something) for (a particular reason); to derive pleasure from or for, delight in or for"
    },
    {
      "text": "(reflexive) to be pleased (with oneself), to be content"
    },
    {
      "text": "(poetic or post-Augustan) to do a thing willingly, to like, to be accustomed (to), enjoy an activity [with infinitive]"
    },
    {
      "text": "to be thankful, grateful to, feel obliged for a service"
    },
    {
      "text": "(transitive, or in absolute use) to make love"
    }
  ]
}
```

```json
{
  "shortDefinition": "great, large, big; (of things) vast, extensive, spacious (of physical size or quantity)",
  "definitions": [
    {
      "text": "(literally):",
      "children": [
        {
          "text": "great, large, big; (of things) vast, extensive, spacious (of physical size or quantity)"
        },
        {
          "text": "especially:",
          "children": [
            {
              "text": "great, much, abundant, considerable (of measure, weight, quantity)"
            },
            {
              "text": "(rare, of time) synonym of longus, multus"
            },
            {
              "text": "loud, powerful, strong, mighty (of voice)"
            }
          ]
        }
      ]
    },
    {
      "text": "(figurative):",
      "children": [
        {
          "text": "(in general) great, grand, mighty, noble, lofty, important, of great weight or importance, momentous"
        },
        {
          "text": "(in particular):",
          "children": [
            {
              "text": "advanced in years, of great age, aged (of age, with nātu)"
            },
            {
              "text": "(in specifications of value, in the neutral absolute) high, dear, of great value, at a high price"
            }
          ]
        }
      ]
    }
  ]
}
```

Update render-definition.js to

A) put the 'shortDefinition' above the 'show more...' expandable section right under the Definitions header like so:

```
Definitions:

great, large, big; (of things) vast, extensive, spacious (of physical size or quantity)
show more...
```

When the user clicks on 'show more' the definitions section should appear like so:
(note that the only reason there is a 1. in front of (literally) is because it's one of two as in above json. I just
didn't bother adding it to below example. But it should only be numbered if there are multiple nodes at that level)

```markdown
1. (literally):
    1. great, large, big; (of things) vast, extensive, spacious (of physical size or quantity)
    2. especially:
        1. great, much, abundant, considerable (of measure, weight, quantity)
        2. (rare, of time) synonym of longus, multus
        3. loud, powerful, strong, mighty (of voice)
```

