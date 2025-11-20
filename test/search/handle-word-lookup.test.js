import {describe, it, expect} from "vitest";
import {handleWordLookup} from "@search";

const fetchMock = async (query) => {
    // Mock API results
    if (query === "apple") {
        return ["Apple", "Applet", "Applejack"];
    }
    return [];
};

const errorFetchMock = async () => {
    throw new Error("Network failure");
};

describe("handleWordLookup", () => {
    it("returns suggestions for a valid query", async () => {
        const result = await handleWordLookup("apple", fetchMock, 3);

        expect(result.status).toBe("success");
        // Order-insensitive check + ensure exact cardinality
        expect(result.data).toEqual(
            expect.arrayContaining(["Apple", "Applet", "Applejack"]),
        );
        expect(result.data).toHaveLength(3);
    });

    it("handles empty suggestions", async () => {
        const result = await handleWordLookup("banana", fetchMock, 3);

        expect(result).toEqual({
            status: "error",
            message: "No suggestions found",
        });
    });

    it("returns an error for fetch failures", async () => {


        const result = await handleWordLookup("apple", errorFetchMock, 3);

        expect(result).toEqual({
            status: "error",
            message:
                "We're having trouble fetching suggestions right now. Please try again later.",
        });
    });
});
