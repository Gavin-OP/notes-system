import { useEffect, useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkSlug from "remark-slug";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import { rehypeMermaid, MermaidBlock } from "react-markdown-mermaid";
import Mermaid from "react-mermaid2";

import "katex/dist/katex.min.css";

import CopyLinkIcon from "./CopyLinkIcon";

import { resolveRelativePath } from "../../../utils/markdownUtils";
import { remarkHighlightMark } from "../../../utils/markdownUtils";

import "./MarkdownRenderer.css";

const themeCssMap = {
  default_light: `${import.meta.env.BASE_URL}theme/github.css`,
  light: `${import.meta.env.BASE_URL}theme/github.css`,
  dark: `${import.meta.env.BASE_URL}theme/d42ker-github.css`,
};

function useH1TitleFit(deps) {
  const toolbarRef = useRef(null);
  const titleRef = useRef(null);

  useLayoutEffect(() => {
    const toolbar = toolbarRef.current;
    const titleEl = titleRef.current;
    if (!toolbar || !titleEl) return undefined;

    const measure = () => {
      titleEl.style.fontSize = "";
      titleEl.style.overflow = "";
      titleEl.style.textOverflow = "";
      titleEl.style.whiteSpace = "nowrap";

      const maxPx = parseFloat(window.getComputedStyle(titleEl).fontSize) || 32;
      const minPx = 11;

      const fitsAt = (px) => {
        titleEl.style.fontSize = `${px}px`;
        return titleEl.scrollWidth <= titleEl.clientWidth + 0.5;
      };

      if (fitsAt(maxPx)) return;

      let low = minPx;
      let high = maxPx;
      for (let i = 0; i < 24; i += 1) {
        const mid = (low + high) / 2;
        if (fitsAt(mid)) low = mid;
        else high = mid;
      }

      titleEl.style.fontSize = `${Math.max(low, minPx)}px`;

      if (titleEl.scrollWidth > titleEl.clientWidth + 0.5) {
        titleEl.style.fontSize = `${minPx}px`;
        titleEl.style.overflow = "hidden";
        titleEl.style.textOverflow = "ellipsis";
      }
    };

    const observer = new ResizeObserver(() => measure());
    observer.observe(toolbar);
    measure();

    return () => observer.disconnect();
  }, deps);

  return [toolbarRef, titleRef];
}

function HeadingCopyH1({
  children,
  id,
  theme,
  onMarkComplete,
  completionPending,
  isCompleted,
  ...domProps
}) {
  const [toolbarRef, titleRef] = useH1TitleFit([
    children,
    id,
    completionPending,
    isCompleted,
    typeof onMarkComplete === "function",
  ]);

  const completionBtn =
    typeof onMarkComplete === "function" ? (
      <button
        type="button"
        className={`markdown-complete-btn ${isCompleted ? "is-completed" : ""}`}
        onClick={onMarkComplete}
        disabled={completionPending}
      >
        {completionPending
          ? "Updating..."
          : isCompleted
            ? "Completed"
            : "Mark as completed"}
      </button>
    ) : null;

  const { className: domClassName, id: markdownIdProp, ...restDomAttrs } =
    domProps;
  const headingId = id ?? markdownIdProp;
  const mergedClass = ["markdown-heading-with-link", "markdown-heading-with-link--h1", domClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <h1 {...restDomAttrs} id={headingId} className={mergedClass}>
      <div ref={toolbarRef} className="markdown-h1-toolbar">
        {headingId ? (
          <span className="markdown-h1-toolbar__copy-wrap">
            <CopyLinkIcon id={headingId} theme={theme} />
          </span>
        ) : null}
        <span ref={titleRef} className="markdown-h1-toolbar__title">
          {children}
        </span>
        {completionBtn}
      </div>
    </h1>
  );
}

const HeadingWithCopy = ({
  level,
  children,
  onMarkComplete,
  completionPending = false,
  isCompleted = false,
  ...props
}) => {
  const id = props.node?.data?.id || props.id;
  const Tag = `h${level}`;
  const theme = props.theme || "light";

  const { node: _nodeIgnored, ...restMarkdownProps } = props;

  if (level === 1) {
    return (
      <HeadingCopyH1
        {...restMarkdownProps}
        id={id}
        theme={theme}
        onMarkComplete={onMarkComplete}
        completionPending={completionPending}
        isCompleted={isCompleted}
      >
        {children}
      </HeadingCopyH1>
    );
  }

  return (
    <Tag id={id} className="markdown-heading-with-link" {...restMarkdownProps}>
      {id && <CopyLinkIcon id={id} theme={theme} />}
      <span className="markdown-heading-with-link__content">{children}</span>
    </Tag>
  );
};


const MarkdownRenderer = ({
  content,
  theme,
  onMarkComplete,
  completionPending = false,
  isCompleted = false,
}) => {
  const noteDirectory = useSelector(
    (state) => state.currentNote.meta?.directory,
  );

  // code cell style
  useEffect(() => {
    const resetStyle = document.createElement("style");
    resetStyle.id = "reset-code-style";
    resetStyle.innerHTML = `
      .markdown-body pre > code {
        all: unset !important;
        display: block;
        white-space: pre;
        font-family: inherit;
        font-size: inherit;
        background: none !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
    `;
    document.head.appendChild(resetStyle);

    return () => {
      const old = document.getElementById("reset-code-style");
      if (old) old.remove();
    };
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.id = "task-list-style";
    style.innerHTML = `
    .contains-task-list {
      margin: 12.8px 0;
    }
    .contains-task-list .task-list-item {
      list-style-type: none !important;
      margin-left: -1.3em;
      line-height: 1.9;
    }
    .contains-task-list .task-list-item > input {
      list-style-type: none;
    }
    .contains-task-list .task-list-item > input:checked {
      cursor: pointer;
    }
    .contains-task-list ul input[type="checkbox"] {
      margin-left: 24px;
    }
  `;
    document.head.appendChild(style);

    return () => {
      const old = document.getElementById("task-list-style");
      if (old) old.remove();
    };
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.id = "li-tasklist-p-reset";
    style.innerHTML = `
    .markdown-body li > p:has(> input[type="checkbox"]) {
      margin: 0 !important;
      padding: 0 !important;
      display: inline;
    }
  `;
    document.head.appendChild(style);

    return () => {
      const old = document.getElementById("li-tasklist-p-reset");
      if (old) old.remove();
    };
  }, []);

  // overall style and theme change
  useEffect(() => {
    const href = themeCssMap[theme];
    if (!href) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.id = "markdown-theme-css";
    document.head.appendChild(link);
    return () => {
      const old = document.getElementById("markdown-theme-css");
      if (old) old.remove();
    };
  }, [theme]);

  // code block theme change
  useEffect(() => {
    const old = document.getElementById("highlight-theme-css");

    if (old) old.remove();

    const highlightHref =
      theme === "dark"
        ? `${import.meta.env.BASE_URL}theme/code-highlight-github-dark.css`
        : `${import.meta.env.BASE_URL}theme/code-highlight-github.css`;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = highlightHref;
    link.id = "highlight-theme-css";
    document.head.appendChild(link);

    return () => {
      const old = document.getElementById("highlight-theme-css");
      if (old) old.remove();
    };
  }, [theme]);

  // 统一 code block 和 latex block 的滚动条样式
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "unified-scroll-style";
    style.innerHTML = `
      .markdown-body pre,
      .markdown-body .katex-display {
        overflow-x: auto !important;
      }
      .markdown-body pre {
        white-space: pre;
      }
      .markdown-body .katex-display {
        overflow-x: auto !important;
        overflow-y: hidden !important;
        white-space: nowrap !important;
        padding-bottom: 2px;
      }
      .markdown-body .katex-display > .katex {
        white-space: nowrap !important;
      }
      .markdown-body pre::-webkit-scrollbar,
      .markdown-body .katex-display::-webkit-scrollbar {
        height: 8px;
        background: ${theme === "dark" ? "#222" : "#f0f0f0"};
      }
      .markdown-body pre::-webkit-scrollbar-thumb,
      .markdown-body .katex-display::-webkit-scrollbar-thumb {
        background: ${theme === "dark" ? "#444" : "#bbb"};
        border-radius: 4px;
      }
      .markdown-body pre::-webkit-scrollbar-thumb:hover,
      .markdown-body .katex-display::-webkit-scrollbar-thumb:hover {
        background: ${theme === "dark" ? "#666" : "#888"};
      }
    `;
    document.head.appendChild(style);

    return () => {
      const old = document.getElementById("unified-scroll-style");
      if (old) old.remove();
    };
  }, [theme]);

  const components = {
    h1: (props) => (
      <HeadingWithCopy
        level={1}
        onMarkComplete={onMarkComplete}
        completionPending={completionPending}
        isCompleted={isCompleted}
        {...props}
      />
    ),
    h2: (props) => <HeadingWithCopy level={2} {...props} />,
    h3: (props) => <HeadingWithCopy level={3} {...props} />,
    h4: (props) => <HeadingWithCopy level={4} {...props} />,
    h5: (props) => <HeadingWithCopy level={5} {...props} />,
    h6: (props) => <HeadingWithCopy level={6} {...props} />,

    // relative image path
    img({ src, style, ...props }) {
      let finalSrc = src;
      if (src && !/^https?:\/\//.test(src) && noteDirectory !== undefined) {
        const base = noteDirectory === "." ? "" : noteDirectory;
        const resolved = resolveRelativePath(base, src);
        finalSrc = `${import.meta.env.BASE_URL}notes/${resolved}`;
      }

      // 合并用户自定义 style，优先级高于默认
      const mergedStyle = {
        display: "block",
        maxWidth: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        ...style,
      };
      return <img src={finalSrc} style={mergedStyle} {...props} />;
    },

    // code block formatting
    pre({ node, ...props }) {
      return <pre className="md-fences" {...props} />;
    },

    // table styling
    table({ node, ...props }) {
      return <table className="markdown-table" {...props} />;
    },

    li({ children, ...props }) {
      // 1. 只有纯文本时才包裹 p
      if (
        typeof children === "string" ||
        (Array.isArray(children) &&
          children.every((child) => typeof child === "string"))
      ) {
        return (
          <li {...props}>
            <p>{children}</p>
          </li>
        );
      }

      // 3. 其他情况原样渲染
      return <li {...props}>{children}</li>;
    },

    MermaidBlock: MermaidBlock,
  };

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkHighlightMark, remarkSlug]}
        rehypePlugins={[
          [rehypeRaw],
          [rehypeKatex, { strict: false }],
          [rehypeHighlight],
          [
            rehypeMermaid,
            {
              mermaidConfig: {
                theme: theme === "dark" ? "dark" : "default",
                flowchart: { useMaxWidth: true },
              },
            },
          ],
        ]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
