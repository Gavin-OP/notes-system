import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import MarkdownRenderer from "./MarkdownRenderer";

vi.mock("react-redux", () => ({
  useSelector: () => undefined,
}));

vi.mock("../../../../../i18n/useTranslation", () => ({
  default: () => ({ t: (key) => key }),
}));

describe("MarkdownRenderer", () => {
  it("renders Markdown blockquotes instead of escaping their marker", () => {
    render(
      <MarkdownRenderer
        content={"**弱表达：**\n\n> 参与用户调研，负责整理数据。"}
        theme="light"
      />,
    );

    const quote = screen.getByText("参与用户调研，负责整理数据。");
    expect(quote.closest("blockquote")).toHaveClass("markdown-blockquote");
  });

  it("keeps supported note anchors while removing unsafe raw HTML", () => {
    const { container } = render(
      <MarkdownRenderer
        content={'<a id="concept-star"></a>\n\n[unsafe](javascript:alert(1))\n\n<script>alert(1)</script>'}
        theme="light"
      />,
    );

    expect(container.querySelector("#concept-star")).toBeInTheDocument();
    expect(container.querySelector("script")).not.toBeInTheDocument();
    expect(screen.getByText("unsafe").closest("a")).not.toHaveAttribute("href");
  });

  it("keeps the note Markdown extensions used by authored content", () => {
    const { container } = render(
      <MarkdownRenderer
        content={'==重点==\n\n| 能力 | 证据 |\n| --- | --- |\n| 沟通 | 用户访谈 |\n\n- [x] 已完成'}
        theme="light"
      />,
    );

    expect(container.querySelector("mark")).toHaveTextContent("重点");
    expect(container.querySelector("table")).toBeInTheDocument();
    expect(container.querySelector('input[type="checkbox"]')).toBeChecked();
  });
});
