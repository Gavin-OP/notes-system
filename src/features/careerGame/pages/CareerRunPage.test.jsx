import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createCareerRun } from "../domain/careerRun";
import CareerRunPage from "./CareerRunPage";

const STORAGE_KEY = "notes-system:career-run:v1";
const LEGACY_STORAGE_KEY = "notes-system:career-run:legacy:v1";

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
    await user.click(screen.getByRole("button", { name: /研究几份 JD/ }));

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
    await user.click(screen.getByRole("button", { name: /研究几份 JD/ }));
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

  it("keeps the landing page focused without the Graduate illustration", () => {
    render(
      <MemoryRouter>
        <CareerRunPage />
      </MemoryRouter>,
    );

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "应届生开荒局" })).toBeInTheDocument();
    expect(screen.getByText("你是一名刚从学校毕业的求职者，带着有限的时间和精力进入求职季。")).toBeInTheDocument();
    expect(screen.getByText("随机事件")).toBeInTheDocument();
    expect(screen.getByText("属性养成")).toBeInTheDocument();
    expect(screen.getByText("多种结局")).toBeInTheDocument();
    expect(screen.queryByText("5–10 分钟")).not.toBeInTheDocument();
  });

  it("warns when Time and Energy are running low without recoloring growth attributes", async () => {
    const user = userEvent.setup();
    const saved = createCareerRun({ seed: 1953 });
    saved.attributes = { ...saved.attributes, time: 30, energy: 12, confidence: 10, profile: 10, network: 10 };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    render(
      <MemoryRouter>
        <CareerRunPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "继续上次进度" }));

    expect(screen.getByRole("progressbar", { name: "剩余求职时间" })).toHaveClass("is-warning");
    expect(screen.getByRole("progressbar", { name: "继续行动的能量" })).toHaveClass("is-danger");
    expect(screen.getByRole("progressbar", { name: "面对不确定性的底气" })).not.toHaveClass("is-warning", "is-danger");
  });

  it("shows the equipped Legacy beneath the resource it changed", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify({ equippedLegacyId: "senior-contact", unlockedIds: ["senior-contact"] }));

    render(
      <MemoryRouter>
        <CareerRunPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "开始这一局" }));

    const networkMeter = screen.getByRole("progressbar", { name: "职业连接与信息来源" });
    expect(networkMeter.closest(".career-run-attribute")).toHaveTextContent("校友的联系方式");
    expect(networkMeter.closest(".career-run-attribute")).toHaveTextContent("Network +8");
  });

  it("does not show a fixed overall run progress bar", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CareerRunPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "开始这一局" }));

    expect(screen.queryByLabelText(/游戏进度/)).not.toBeInTheDocument();
  });

  it("marks a rare Event without hiding its recruiting category", async () => {
    const user = userEvent.setup();
    const saved = createCareerRun({ seed: 1953 });
    saved.turn = 8;
    saved.counters.rejections = 1;
    saved.currentEvent = { id: "creator-essay", choices: [] };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    render(
      <MemoryRouter>
        <CareerRunPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "继续上次进度" }));

    expect(screen.getByText("稀有事件")).toBeInTheDocument();
    expect(screen.getByText("PROFILE PREPARATION")).toBeInTheDocument();
    expect(screen.getByText("你在社交平台上发布的一篇求职随笔意外火了").closest(".career-run-event-card")).toHaveClass("is-rare");
  });
});
