import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import NoteInteractiveBlock from "./NoteInteractiveBlock";

const checklistConfig = {
  type: "resume-checklist",
  id: "resume-checklist-test",
  eyebrow: "Before sending",
  title: "Resume checklist",
  description: "Check each item.",
  progressLabel: "Progress",
  inProgressMessage: "Keep reviewing.",
  completedMessage: "Review complete.",
  resetLabel: "Reset",
  items: [
    { id: "evidence", text: "Lead with relevant evidence" },
    { id: "format", text: "Check the file format" },
  ],
};

describe("NoteInteractiveBlock resume checklist", () => {
  beforeEach(() => {
    const saved = new Map();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: (key) => saved.get(key) ?? null,
        setItem: (key, value) => saved.set(key, value),
        removeItem: (key) => saved.delete(key),
        clear: () => saved.clear(),
      },
    });
  });

  it("updates, persists, completes, and resets checked items", () => {
    const { unmount } = render(<NoteInteractiveBlock configText={JSON.stringify(checklistConfig)} />);

    const evidence = screen.getByRole("checkbox", { name: "Lead with relevant evidence" });
    fireEvent.click(evidence);

    expect(evidence).toBeChecked();
    expect(screen.getByText("1 / 2")).toBeInTheDocument();

    unmount();
    render(<NoteInteractiveBlock configText={JSON.stringify(checklistConfig)} />);

    expect(screen.getByRole("checkbox", { name: "Lead with relevant evidence" })).toBeChecked();
    fireEvent.click(screen.getByRole("checkbox", { name: "Check the file format" }));
    expect(screen.getByText("Review complete.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getAllByRole("checkbox").every((item) => !item.checked)).toBe(true);
    expect(screen.getByText("0 / 2")).toBeInTheDocument();
  });
});
