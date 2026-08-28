import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import App from "./App.vue";

vi.mock("./api", () => ({
  applyReviewAction: vi.fn(),
  fetchReviewItems: vi.fn().mockResolvedValue([])
}));

describe("App", () => {
  it("renders an empty reviewer queue without failing", async () => {
    const wrapper = mount(App);

    await flushPromises();

    expect(wrapper.text()).toContain("Signed in as alex");
    expect(wrapper.findAll(".queue-item")).toHaveLength(0);
  });
});

