import {describe, it, expect, beforeEach} from "vitest";
import {renderDefinitions} from "@detail/render-definitions.js";
import {CSS_CLASSES} from "@utilities/constants.js";

function directChildren(list) {
    return [...list.children].filter((element) => element.tagName === "LI");
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
        expect(toggle.textContent).toBe("Show more");

        toggle.click();
        expect(hiddenList.style.display).toBe("block");
        expect(toggle.textContent).toBe("Show less");
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
        expect(topLi.firstChild.textContent).toBe("(literally):");

        const secondLevelList = topLi.querySelector(`.${CSS_CLASSES.DEFINITIONS_LIST}`);
        expect(secondLevelList.classList.contains(CSS_CLASSES.DEFINITIONS_UNNUMBERED)).toBe(false);
        expect(directChildren(secondLevelList)).toHaveLength(2);

        const especiallyLi = directChildren(secondLevelList)
            .find((li) => li.firstChild.textContent === "especially:");
        const thirdLevelList = especiallyLi.querySelector(`.${CSS_CLASSES.DEFINITIONS_LIST}`);
        expect(thirdLevelList.classList.contains(CSS_CLASSES.DEFINITIONS_UNNUMBERED)).toBe(true);
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
});