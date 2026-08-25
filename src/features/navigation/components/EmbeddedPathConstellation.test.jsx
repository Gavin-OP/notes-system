import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import EmbeddedPathConstellation from "./EmbeddedPathConstellation";

vi.mock("reactflow", () => ({
  default: ({ children, fitView }) => <div data-testid="path-flow" data-fit-view={String(Boolean(fitView))}>{children}</div>,
  Background: () => null,
  BaseEdge: () => null,
  Controls: () => null,
  Handle: () => null,
  Position: { Left: "left", Right: "right", Top: "top", Bottom: "bottom" },
}));

vi.mock("../../../i18n/useTranslation", () => ({
  default: () => ({ t: (_key, fallback) => fallback || _key }),
}));

const draft = {
  nodes: [
    {
      node_id: "pilot:getting-started",
      title: "刚开始准备求职",
      note_url: "/note/fall-recruiting/getting-started.md",
      metadata: { pilot_official_path: true, estimated_order: 1 },
    },
    {
      node_id: "pilot:offer",
      title: "Offer 判断",
      note_url: "/note/fall-recruiting/offer.md",
      metadata: { pilot_official_path: true, estimated_order: 2 },
    },
  ],
  edges: [{ source: "pilot:getting-started", target: "pilot:offer", relation: "precedes" }],
  metadata: { personalization: { stage: "getting_started" } },
};

describe("Embedded Path constellation", () => {
  it("fits the complete graph and exposes Path adjustment on mobile", async () => {
    const onAdjust = vi.fn();
    const user = userEvent.setup();

    render(
      <EmbeddedPathConstellation
        draft={draft}
        currentNoteUrl="/note/fall-recruiting/getting-started.md"
        completedNoteUrls={new Set()}
        isMobile
        onAdjust={onAdjust}
      />,
    );

    expect(screen.getByTestId("path-flow")).toHaveAttribute("data-fit-view", "true");
    await user.click(screen.getByRole("button", { name: "调整 Path" }));
    expect(onAdjust).toHaveBeenCalledTimes(1);
  });

  it("collapses into a current-node affordance that restores the complete Path", async () => {
    cleanup();
    const onToggleExpand = vi.fn();
    const user = userEvent.setup();

    render(
      <EmbeddedPathConstellation
        draft={draft}
        currentNoteUrl="/note/fall-recruiting/getting-started.md"
        completedNoteUrls={new Set()}
        isRail
        onToggleExpand={onToggleExpand}
      />,
    );

    expect(screen.queryByTestId("path-flow")).not.toBeInTheDocument();
    expect(screen.getByText("刚开始准备求职")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "pilot.path.openSettings" }));
    expect(onToggleExpand).toHaveBeenCalledTimes(1);
  });
});
