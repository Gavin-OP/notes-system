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

const coverLetterArgumentConfig = {
  type: "cover-letter-argument",
  id: "cover-letter-argument-test",
  eyebrow: "Evidence bridge",
  title: "Turn a requirement into an argument",
  description: "Connect the role to your evidence.",
  exampleLabel: "Example",
  yourTurnLabel: "Your turn",
  savedHint: "Saved in this browser.",
  resetLabel: "Clear",
  columns: [
    { id: "requirement", label: "Employer need", placeholder: "Paste a requirement" },
    { id: "evidence", label: "My evidence", placeholder: "Add your evidence" },
    { id: "argument", label: "Connecting sentence", placeholder: "Write the connection" },
  ],
  examples: [
    {
      id: "analysis",
      requirement: "Data analysis experience",
      evidence: "Analysed user behaviour with Python",
      argument: "This experience supports data-informed decisions.",
    },
    {
      id: "communication",
      requirement: "Customer communication",
      evidence: "Resolved customer questions",
      argument: "This experience supports clear customer communication.",
    },
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

describe("NoteInteractiveBlock cover letter argument", () => {
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

  it("renders two examples and persists the editable third row", () => {
    const { unmount } = render(
      <NoteInteractiveBlock configText={JSON.stringify(coverLetterArgumentConfig)} />,
    );

    expect(screen.getByText("Data analysis experience")).toBeInTheDocument();
    expect(screen.getByText("Customer communication")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Employer need"), {
      target: { value: "Strong research skills" },
    });
    unmount();

    render(<NoteInteractiveBlock configText={JSON.stringify(coverLetterArgumentConfig)} />);
    expect(screen.getByLabelText("Employer need")).toHaveValue("Strong research skills");
  });
});
