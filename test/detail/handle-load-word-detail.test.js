import { describe, it, expect, vi } from "vitest";

// Mock dependencies used by handle-load-word-detail.js
vi.mock("@api/api-client.js", () => ({
  fetchWordDetailData: vi.fn(),
}));
vi.mock("@detail/render-word-detail.js", () => ({
  renderWordDetail: vi.fn(),
}));

// Import the mocks for assertions from the same paths
import { fetchWordDetailData } from "@api/api-client.js";
import { renderWordDetail } from "@detail/render-word-detail.js";

// Import the SUT directly to avoid barrel side effects
import { handleLoadWordDetail } from "@detail/handle-load-word-detail.js";

describe("handleLoadWordDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders on success", async () => {
    const data = { word: "example" };
    fetchWordDetailData.mockResolvedValueOnce(data);

    const lexemeId = 123;
    await handleLoadWordDetail("example", lexemeId);

    expect(fetchWordDetailData).toHaveBeenCalledWith("example", lexemeId);
    expect(renderWordDetail).toHaveBeenCalledWith(data);
  });

  it("throws loading error on fetch error", async () => {
    fetchWordDetailData.mockRejectedValueOnce(new Error("fetch failed"));
      const lexemeId = 123;

    await expect(handleLoadWordDetail("example", lexemeId))
      .rejects.toThrow("There was a problem loading details for example.");
    expect(renderWordDetail).not.toHaveBeenCalled();
  });

  it("throws displaying error on non-fetch error", async () => {
    fetchWordDetailData.mockRejectedValueOnce(new Error("unexpected"));
    const lexemeId = 456;
    await expect(handleLoadWordDetail("test", lexemeId))
      .rejects.toThrow("There was a problem displaying details for test.");
    expect(renderWordDetail).not.toHaveBeenCalled();
  });
});
