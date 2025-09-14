import { describe, it, expect, vi } from "vitest";

// Mock dependencies used by handleLoadWordDetail.js
vi.mock("@api/apiClient.js", () => ({
  fetchWordDetailData: vi.fn(),
}));
vi.mock("@detail/renderWordDetail.js", () => ({
  renderWordDetail: vi.fn(),
}));

// Import the mocks for assertions from the same paths
import { fetchWordDetailData } from "@api/apiClient.js";
import { renderWordDetail } from "@detail/renderWordDetail.js";

// Import the SUT directly to avoid barrel side effects
import { handleLoadWordDetail } from "@detail/handleLoadWordDetail.js";

describe("handleLoadWordDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders on success", async () => {
    const data = { word: "example" };
    fetchWordDetailData.mockResolvedValueOnce(data);

    await handleLoadWordDetail("example", 123);

    expect(fetchWordDetailData).toHaveBeenCalledWith("example", 123);
    expect(renderWordDetail).toHaveBeenCalledWith(data);
  });

  it("throws loading error on fetch error", async () => {
    fetchWordDetailData.mockRejectedValueOnce(new Error("fetch failed"));

    await expect(handleLoadWordDetail("example", 123))
      .rejects.toThrow("There was a problem loading details for example.");
    expect(renderWordDetail).not.toHaveBeenCalled();
  });

  it("throws displaying error on non-fetch error", async () => {
    fetchWordDetailData.mockRejectedValueOnce(new Error("unexpected"));

    await expect(handleLoadWordDetail("test", 456))
      .rejects.toThrow("There was a problem displaying details for test.");
    expect(renderWordDetail).not.toHaveBeenCalled();
  });
});
