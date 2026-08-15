import { describe, it, expect } from "vitest";
import { resolveInitialTab } from "@detail/verb/resolve-initial-tab.js";
import { TAB_KEY } from "@detail/verb/tabs/tab-keys.js";

// Builds a matcher-shaped result with the given flags set true.
function buildMatches({ voices = {}, participleGenders = {} } = {}) {
    return {
        voices: { [TAB_KEY.ACTIVE]: false, [TAB_KEY.PASSIVE]: false, [TAB_KEY.PARTICIPLE]: false, ...voices },
        participleGenders: {
            [TAB_KEY.MASCULINE]: false,
            [TAB_KEY.FEMININE]: false,
            [TAB_KEY.NEUTER]: false,
            ...participleGenders,
        },
    };
}

describe("resolveInitialTab", () => {
    it("selects ACTIVE/MASCULINE for an active match", () => {
        const result = resolveInitialTab(buildMatches({ voices: { [TAB_KEY.ACTIVE]: true } }));
        expect(result).toEqual({ voice: TAB_KEY.ACTIVE, gender: TAB_KEY.MASCULINE });
    });

    it("selects PASSIVE/MASCULINE for a passive-only match", () => {
        const result = resolveInitialTab(buildMatches({ voices: { [TAB_KEY.PASSIVE]: true } }));
        expect(result).toEqual({ voice: TAB_KEY.PASSIVE, gender: TAB_KEY.MASCULINE });
    });

    it("selects PARTICIPLE with the matching gender", () => {
        const result = resolveInitialTab(
            buildMatches({ voices: { [TAB_KEY.PARTICIPLE]: true }, participleGenders: { [TAB_KEY.FEMININE]: true } }),
        );
        expect(result).toEqual({ voice: TAB_KEY.PARTICIPLE, gender: TAB_KEY.FEMININE });
    });

    it("prefers ACTIVE over participle when both match", () => {
        const result = resolveInitialTab(
            buildMatches({
                voices: { [TAB_KEY.ACTIVE]: true, [TAB_KEY.PARTICIPLE]: true },
                participleGenders: { [TAB_KEY.NEUTER]: true },
            }),
        );
        expect(result).toEqual({ voice: TAB_KEY.ACTIVE, gender: TAB_KEY.MASCULINE });
    });

    it("prefers PASSIVE over participle when both match", () => {
        const result = resolveInitialTab(
            buildMatches({
                voices: { [TAB_KEY.PASSIVE]: true, [TAB_KEY.PARTICIPLE]: true },
                participleGenders: { [TAB_KEY.MASCULINE]: true },
            }),
        );
        expect(result).toEqual({ voice: TAB_KEY.PASSIVE, gender: TAB_KEY.MASCULINE });
    });

    it("defaults to ACTIVE/MASCULINE when nothing matches", () => {
        const result = resolveInitialTab(buildMatches());
        expect(result).toEqual({ voice: TAB_KEY.ACTIVE, gender: TAB_KEY.MASCULINE });
    });
});
