import { describe, it, expect, vi } from "vitest";
import { fetchWordDetailData, fetchWordSuggestions } from "@api";

function mockFetchOnce(response, isError = false) {
  globalThis.fetch = vi.fn().mockImplementationOnce(() =>
    isError
      ? Promise.reject(response)
      : Promise.resolve({
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          json: async () => response.json,
        }),
  );
}

describe("fetchWordDetailData", () => {
  it("should throw an error if resonse is not ok", async () => {
    mockFetchOnce({ ok: false, status: 404, statusText: "Not Found" });

    await expect(fetchWordDetailData("lemma", "lexemeId")).rejects.toThrowError(
      "Failed to fetch lemma details: HTTP Status: 404",
    );
  });
});

describe("fetchWordSuggestions", () => {
  it("should throw an error if response is not ok", async () => {
    mockFetchOnce({ ok: false, status: 400, statusText: "Not Found" });
    await expect(fetchWordSuggestions("query", false)).rejects.toThrow(
      "HTTP Status: 400",
    );
  });

  it("should log an error on fetch failure", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetchOnce({ ok: false, status: 404, statusText: "Not Found" });

    await expect(fetchWordSuggestions("query", false)).rejects.toThrow(
      "HTTP Status: 404",
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      `Failed to fetch data for suggestion: query`,
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });
});
