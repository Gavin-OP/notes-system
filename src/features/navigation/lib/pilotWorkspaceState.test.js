import { describe, expect, it, vi } from "vitest";

import {
  loadPilotWorkspaceView,
  resolvePilotCurrentNoteUrl,
  savePilotWorkspaceView,
} from "./pilotWorkspaceState";

describe("pilot workspace refresh state", () => {
  it("uses the concrete route while note metadata is still loading", () => {
    expect(resolvePilotCurrentNoteUrl("", "/note/fall-recruiting/cover-letter.md"))
      .toBe("/note/fall-recruiting/cover-letter.md");
    expect(resolvePilotCurrentNoteUrl(
      "/note/fall-recruiting/resume-story.md",
      "/note/fall-recruiting/cover-letter.md",
    )).toBe("/note/fall-recruiting/resume-story.md");
  });

  it("restores the reading or Path view saved before refresh", () => {
    const values = new Map();
    const storage = {
      getItem: vi.fn((key) => values.get(key) ?? null),
      setItem: vi.fn((key, value) => values.set(key, value)),
    };

    expect(loadPilotWorkspaceView(storage)).toBe("reading");
    savePilotWorkspaceView("path", storage);
    expect(loadPilotWorkspaceView(storage)).toBe("path");
    savePilotWorkspaceView("reading", storage);
    expect(loadPilotWorkspaceView(storage)).toBe("reading");
  });
});
