import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import CareerPathMetaReveal from "./CareerPathMetaReveal";

const observations = [
  {
    id: "profile-readiness",
    title: "你的材料还有继续打磨的空间",
    body: "Path 会从准备简历与 Profile 开始。",
    nodeIds: ["pilot:profile-preparation"],
  },
  {
    id: "network-entry",
    title: "你可能需要更多认识人的入口",
    body: "Path 会加入 Coffee Chat / Networking。",
    nodeIds: ["pilot:networking"],
  },
];

describe("Career Path meta reveal", () => {
  afterEach(() => cleanup());

  it("keeps the real-world Path hidden until the player unlocks the anomalous result", async () => {
    const user = userEvent.setup();
    render(<CareerPathMetaReveal observations={observations} onEnterWorkspace={() => {}} />);

    expect(screen.queryByRole("dialog", { name: "你以为游戏结束了？" })).not.toBeInTheDocument();
    expect(screen.getByText("你发现了通往现实求职道路的入口")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /打开隐藏内容/ }));

    expect(screen.getByRole("dialog", { name: "你以为游戏结束了？" })).toBeInTheDocument();
    expect(screen.getByText("根据这一局……")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("offers one clear action into the Learning Workspace", async () => {
    const user = userEvent.setup();
    const onEnterWorkspace = vi.fn();
    render(<CareerPathMetaReveal observations={observations} onEnterWorkspace={onEnterWorkspace} />);

    await user.click(screen.getByRole("button", { name: /打开隐藏内容/ }));
    await user.click(screen.getByRole("button", { name: "进入 Learning Workspace" }));

    expect(onEnterWorkspace).toHaveBeenCalledTimes(1);
  });

  it("lets keyboard users dismiss the hidden layer and returns focus to its trigger", async () => {
    const user = userEvent.setup();
    render(<CareerPathMetaReveal observations={observations} onEnterWorkspace={() => {}} />);
    const trigger = screen.getByRole("button", { name: /打开隐藏内容/ });

    await user.click(trigger);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "你以为游戏结束了？" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
