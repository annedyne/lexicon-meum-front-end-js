import {describe, it, expect, beforeEach} from "vitest";
import {renderDefinitions, isOnlyDefinitionSameAsShort} from "@detail/render-definitions.js";
import {CSS_CLASSES, DEFINITIONS_TOGGLE_LABEL} from "@utilities/constants.js";

function directChildren(list) {
    return [...list.children].filter((element) => element.tagName === "LI");
}

// A li's own text, excluding any nested list of child definitions
function ownText(li) {
    return [...li.childNodes]
        .filter((node) => node.nodeName !== "OL")
        .map((node) => node.textContent)
        .join("");
}

describe("renderDefinitions", () => {
    beforeEach(() => {
        const container = document.createElement("div");
        container.id = "definitions-container";
        document.body.replaceChildren(container);
    });

    it("renders the shortDefinition above the toggle, and hides the full list until toggled", () => {
        const definitions = [
            {text: "to be fond of, like, admire"},
            {text: "to be thankful, grateful to, feel obliged for a service"},
        ];

        renderDefinitions(definitions, undefined, "VERB", undefined, "to love");

        const container = document.querySelector("#definitions-container");
        const shortDefinition = container.querySelector(`.${CSS_CLASSES.DEFINITIONS_SHORT}`);
        expect(shortDefinition.textContent).toBe("to love");

        const hiddenList = container.querySelector(`.${CSS_CLASSES.DEFINITIONS_LIST}`);
        expect(hiddenList.style.display).toBe("none");

        const toggle = container.querySelector(`.${CSS_CLASSES.DEFINITIONS_TOGGLE}`);
        expect(toggle.textContent).toBe(DEFINITIONS_TOGGLE_LABEL.SHOW);

        toggle.click();
        expect(hiddenList.style.display).toBe("block");
        expect(toggle.textContent).toBe(DEFINITIONS_TOGGLE_LABEL.HIDE);
    });

    it("hides the shortDefinition once the full list is shown, and restores it on collapse", () => {
        const definitions = [{text: "to love"}, {text: "to be fond of"}];

        renderDefinitions(definitions, undefined, "VERB", undefined, "to love");

        const container = document.querySelector("#definitions-container");
        const shortDefinition = container.querySelector(`.${CSS_CLASSES.DEFINITIONS_SHORT}`);
        const toggle = container.querySelector(`.${CSS_CLASSES.DEFINITIONS_TOGGLE}`);

        expect(shortDefinition.style.display).toBe("");

        toggle.click();
        expect(shortDefinition.style.display).toBe("none");

        toggle.click();
        expect(shortDefinition.style.display).toBe("");
    });

    it("numbers a flat list when there are multiple entries at that level", () => {
        const definitions = [
            {text: "to be fond of, like, admire"},
            {text: "to be thankful, grateful to, feel obliged for a service"},
        ];

        renderDefinitions(definitions, undefined, "VERB", undefined, "to love");

        const list = document.querySelector(`#definitions-container .${CSS_CLASSES.DEFINITIONS_LIST}`);
        expect(list.tagName).toBe("OL");
        expect(list.classList.contains(CSS_CLASSES.DEFINITIONS_UNNUMBERED)).toBe(false);
        expect(directChildren(list)).toHaveLength(2);
    });

    it("does not number a level with a single node, at any depth", () => {
        const definitions = [
            {
                text: "(literally):",
                children: [
                    {text: "great, large, big"},
                    {
                        text: "especially:",
                        children: [{text: "great, much, abundant"}],
                    },
                ],
            },
        ];

        renderDefinitions(definitions, undefined, "ADJECTIVE", undefined, "great, large, big");

        const container = document.querySelector("#definitions-container");
        const topList = container.querySelector(`.${CSS_CLASSES.DEFINITIONS_LIST}`);
        expect(topList.classList.contains(CSS_CLASSES.DEFINITIONS_UNNUMBERED)).toBe(true);

        const topLi = directChildren(topList)[0];
        expect(ownText(topLi)).toBe("(literally):");

        const secondLevelList = topLi.querySelector(`.${CSS_CLASSES.DEFINITIONS_LIST}`);
        expect(secondLevelList.classList.contains(CSS_CLASSES.DEFINITIONS_UNNUMBERED)).toBe(false);
        expect(directChildren(secondLevelList)).toHaveLength(2);

        const especiallyLi = directChildren(secondLevelList)
            .find((li) => ownText(li) === "especially:");
        const thirdLevelList = especiallyLi.querySelector(`.${CSS_CLASSES.DEFINITIONS_LIST}`);
        expect(thirdLevelList.classList.contains(CSS_CLASSES.DEFINITIONS_UNNUMBERED)).toBe(true);
    });

    it("wraps parenthetical context notes in their own span", () => {
        const definitions = [{text: "(reflexive) to be pleased (with oneself), to be content"}];

        renderDefinitions(definitions, undefined, "VERB", undefined, "to love");

        const li = document.querySelector(`#definitions-container .${CSS_CLASSES.DEFINITIONS_LIST} li`);
        const contextSpans = li.querySelectorAll(`.${CSS_CLASSES.DEFINITION_CONTEXT}`);

        expect([...contextSpans].map((span) => span.textContent)).toEqual([
            "(reflexive)",
            "(with oneself)",
        ]);
        expect(ownText(li)).toBe("(reflexive) to be pleased (with oneself), to be content");
    });

    it("does not render a toggle or list when there are no definitions", () => {
        renderDefinitions([], undefined, "VERB", undefined, "to love");

        const container = document.querySelector("#definitions-container");
        expect(container.querySelector(`.${CSS_CLASSES.DEFINITIONS_TOGGLE}`)).toBeNull();
        expect(container.querySelector(`.${CSS_CLASSES.DEFINITIONS_LIST}`)).toBeNull();
        expect(container.querySelector(`.${CSS_CLASSES.DEFINITIONS_SHORT}`).textContent).toBe("to love");
    });

    it("clears previously rendered content on re-render", () => {
        renderDefinitions([{text: "to love"}], undefined, "VERB", undefined, "short 1");
        renderDefinitions([{text: "girl"}], undefined, "NOUN", undefined, "short 2");

        const container = document.querySelector("#definitions-container");
        expect(container.querySelectorAll(`.${CSS_CLASSES.DEFINITIONS_SHORT}`)).toHaveLength(1);
        expect(container.querySelector(`.${CSS_CLASSES.DEFINITIONS_SHORT}`).textContent).toBe("short 2");
    });

    it("renders a nested tree with numbering only at levels with multiple nodes (magnus example)", () => {
        const definitions = [
            {
                text: "(literally):",
                children: [
                    {text: "great, large, big; (of things) vast, extensive, spacious (of physical size or quantity)"},
                    {
                        text: "especially:",
                        children: [
                            {text: "great, much, abundant, considerable (of measure, weight, quantity)"},
                            {text: "(rare, of time) synonym of longus, multus"},
                            {text: "loud, powerful, strong, mighty (of voice)"},
                        ],
                    },
                ],
            },
            {
                text: "(figurative):",
                children: [
                    {text: "(in general) great, grand, mighty, noble, lofty, important, of great weight or importance, momentous"},
                    {
                        text: "(in particular):",
                        children: [
                            {text: "advanced in years, of great age, aged (of age, with nātu)"},
                            {text: "(in specifications of value, in the neutral absolute) high, dear, of great value, at a high price"},
                        ],
                    },
                ],
            },
        ];

        renderDefinitions(
            definitions,
            undefined,
            "ADJECTIVE",
            undefined,
            "great, large, big; (of things) vast, extensive, spacious (of physical size or quantity)",
        );

        const container = document.querySelector("#definitions-container");
        const topList = container.querySelector(`.${CSS_CLASSES.DEFINITIONS_LIST}`);

        // Top level has two nodes, so it should be numbered
        expect(topList.classList.contains(CSS_CLASSES.DEFINITIONS_UNNUMBERED)).toBe(false);
        expect(directChildren(topList)).toHaveLength(2);

        const literallyLi = directChildren(topList).find((li) => ownText(li) === "(literally):");
        const literallyChildren = literallyLi.querySelector(`.${CSS_CLASSES.DEFINITIONS_LIST}`);
        expect(directChildren(literallyChildren)).toHaveLength(2);

        const especiallyLi = directChildren(literallyChildren).find((li) => ownText(li) === "especially:");
        const especiallyChildren = especiallyLi.querySelector(`.${CSS_CLASSES.DEFINITIONS_LIST}`);
        expect(especiallyChildren.classList.contains(CSS_CLASSES.DEFINITIONS_UNNUMBERED)).toBe(false);
        expect(directChildren(especiallyChildren)).toHaveLength(3);
    });

    it("hides the toggle when the sole definition matches the shortDefinition (raeda example)", () => {
        const definitions = [{text: "A carriage (four-wheeled), coach"}];

        renderDefinitions(definitions, undefined, "NOUN", undefined, "A carriage (four-wheeled), coach");

        const container = document.querySelector("#definitions-container");
        expect(container.querySelector(`.${CSS_CLASSES.DEFINITIONS_TOGGLE}`)).toBeNull();
        expect(container.querySelector(`.${CSS_CLASSES.DEFINITIONS_LIST}`)).toBeNull();
        expect(container.querySelector(`.${CSS_CLASSES.DEFINITIONS_SHORT}`).textContent).toBe(
            "A carriage (four-wheeled), coach",
        );
    });

    it("shows the toggle when the sole definition differs from the shortDefinition (bogus spice example)", () => {
        const definitions = [{text: "(hapax legomenon) a bogus spice"}];

        renderDefinitions(definitions, undefined, "NOUN", undefined, "a bogus spice");

        const container = document.querySelector("#definitions-container");
        const toggle = container.querySelector(`.${CSS_CLASSES.DEFINITIONS_TOGGLE}`);
        const hiddenList = container.querySelector(`.${CSS_CLASSES.DEFINITIONS_LIST}`);

        expect(toggle).not.toBeNull();
        expect(hiddenList.style.display).toBe("none");
        expect(ownText(directChildren(hiddenList)[0])).toBe("(hapax legomenon) a bogus spice");
    });
});

describe("isOnlyDefinitionSameAsShort", () => {
    it("is true when there is one definition with no children and its text matches shortDefinition (raeda example)", () => {
        const definitions = [{text: "A carriage (four-wheeled), coach"}];
        expect(isOnlyDefinitionSameAsShort(definitions, "A carriage (four-wheeled), coach")).toBe(true);
    });

    it("is false when the sole definition's text differs from shortDefinition (bogus spice example)", () => {
        const definitions = [{text: "(hapax legomenon) a bogus spice"}];
        expect(isOnlyDefinitionSameAsShort(definitions, "a bogus spice")).toBe(false);
    });

    it("is false when there are multiple definitions", () => {
        const definitions = [{text: "to love"}, {text: "to be fond of"}];
        expect(isOnlyDefinitionSameAsShort(definitions, "to love")).toBe(false);
    });

    it("is false when the sole definition has children", () => {
        const definitions = [
            {text: "great, large, big", children: [{text: "especially:"}]},
        ];
        expect(isOnlyDefinitionSameAsShort(definitions, "great, large, big")).toBe(false);
    });
});