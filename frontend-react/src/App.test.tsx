import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import App from "./App";

vi.mock("./api", () => ({
  applyReviewAction: vi.fn(),
  fetchReviewItems: vi.fn().mockResolvedValue([])
}));

describe("App", () => {
  it("renders an empty reviewer queue without failing", async () => {
    const { container } = render(<App />);

    await waitFor(() => expect(screen.queryByText("Loading review items...")).toBeNull());

    expect(container.textContent).toContain("Signed in as alex");
    expect(container.querySelectorAll(".queue-item")).toHaveLength(0);
  });
});
