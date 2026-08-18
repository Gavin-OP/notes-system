import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createCareerRun } from "../domain/careerRun";
import CareerRunPage from "./CareerRunPage";

const STORAGE_KEY = "notes-system:career-run:v1";

describe("Career Run resume behavior", () => {
  beforeEach(() => {
    const values = new Map();
    vi.stubGlobal("localStorage", {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: (key) => values.delete(key),
      clear: () => values.clear(),
    });
    window.localStorage.clear();
  });

  afterEach(() => cleanup());

  it("lets a player resolve a choice immediately after resuming a saved run", async () => {
    const user = userEvent.setup();
    const saved = createCareerRun({ seed: 1953 });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    render(
      <MemoryRouter>
        <CareerRunPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "继续上次进度" }));
    await user.click(screen.getByRole("button", { name: /先研究几份 JD/ }));

    expect(screen.getByText("这次选择带来了")).toBeInTheDocument();
    expect(screen.queryByText("你做出了选择，求职地图继续展开。")).not.toBeInTheDocument();
  });

  it("repairs an older saved event snapshot before showing its choices", async () => {
    const user = userEvent.setup();
    const saved = createCareerRun({ seed: 1953 });
    saved.currentEvent = {
      ...saved.currentEvent,
      title: "旧版本开场",
      choices: [{ id: "old-choice", label: "旧版本选项", available: true }],
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    render(
      <MemoryRouter>
        <CareerRunPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "继续上次进度" }));

    expect(screen.queryByText("旧版本开场")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /先研究几份 JD/ }));
    expect(screen.getByText("这次选择带来了")).toBeInTheDocument();
  });

  it("shows a distinct icon beside each of the five status dimensions", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CareerRunPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "开始这一局" }));

    const attributes = screen.getByLabelText("当前属性");
    expect(attributes.querySelectorAll(".career-run-attribute-icon")).toHaveLength(5);
    expect(new Set([...attributes.querySelectorAll(".career-run-attribute-icon")].map((icon) => icon.className.baseVal)).size).toBe(5);
  });
});
