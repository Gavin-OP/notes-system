import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkSlug from "remark-slug";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

import "katex/dist/katex.min.css";

import CopyLinkIcon from "./CopyLinkIcon";
import NoteInteractiveBlock from "../../../components/interactive/NoteInteractiveBlock";

import { NOTE_SELECTION_ACTIONS_ENABLED } from "../../../../../config/productMode";
import { resolveRelativePath } from "../../../lib/markdownUtils";
import { remarkHighlightMark } from "../../../lib/markdownUtils";
import useTranslation from "../../../../../i18n/useTranslation";

import "./MarkdownRenderer.css";

const themeCssMap = {
  default_light: `${import.meta.env.BASE_URL}theme/github.css`,
  light: `${import.meta.env.BASE_URL}theme/github.css`,
  dark: `${import.meta.env.BASE_URL}theme/d42ker-github.css`,
};

const MARKDOWN_REMARK_PLUGINS = [remarkGfm, remarkMath, remarkHighlightMark, remarkSlug];

const MARKDOWN_SANITIZE_SCHEMA = {
  ...defaultSchema,
  clobber: [],
  tagNames: Array.from(new Set([
    ...(defaultSchema.tagNames || []),
    "span",
    "sub",
    "sup",
    "kbd",
    "mark",
  ])),
  attributes: {
    ...defaultSchema.attributes,
    "*": Array.from(new Set([
      ...(defaultSchema.attributes?.["*"] || []),
      "id",
      "className",
    ])),
    a: Array.from(new Set([
      ...(defaultSchema.attributes?.a || []),
      "id",
      "name",
      "className",
    ])),
  },
};

function normalizeTranslatedMarkdown(content) {
  return String(content || "")
    .replace(/\\\*\\\*/g, "**")
    .replace(/\*\*\s*(<a\b[^>]*>[\s\S]*?<\/a>)\s*\*\*/g, "<strong>$1</strong>")
    .replace(/__\s*(<a\b[^>]*>[\s\S]*?<\/a>)\s*__/g, "<strong>$1</strong>");
}

function MermaidDiagram({ chart }) {
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2)}`);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function renderDiagram() {
      setSvg("");
      setError("");
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "default",
          flowchart: { useMaxWidth: true },
        });
        const { svg: renderedSvg } = await mermaid.render(idRef.current, chart);
        if (cancelled) return;
        setSvg(DOMPurify.sanitize(renderedSvg, { USE_PROFILES: { svg: true, svgFilters: true } }));
      } catch {
        if (cancelled) return;
        setError("Unable to render Mermaid diagram.");
      }
    }
    renderDiagram();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return <pre className="md-fences">{chart}</pre>;
  }

  if (!svg) {
    return <div className="markdown-mermaid-placeholder" aria-label="Loading diagram" />;
  }

  return (
    <div
      className="markdown-mermaid"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function MarkdownImage({ finalSrc, style, src: _discardSrc, ...imgRest }) {
  const imgStyle = {
    display: "block",
    boxSizing: "border-box",
    width: "100%",
    height: "auto",
    marginTop: "8px",
    marginBottom: "8px",
    ...style,
    maxWidth: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  };

  return (
    <div className="markdown-image-crop-shell">
      <img src={finalSrc} style={imgStyle} {...imgRest} />
    </div>
  );
}

function isSkippableHighlightNode(node) {
  const element = node?.parentElement;
  if (!element) return true;
  return Boolean(element.closest("pre, code, script, style, textarea, button, .note-selection-toolbar"));
}

const SELECTION_TOOLBAR_EXCLUDE_SELECTORS = [
  ".markdown-h1-addon",
  ".markdown-complete-btn",
  ".note-workspace-bar",
  ".note-page__complete-footer",
  ".note-page__complete-btn",
].join(", ");

function isSelectionInExcludedChrome(selection) {
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  const nodesToCheck = [
    range.commonAncestorContainer,
    selection.anchorNode,
    selection.focusNode,
  ];

  return nodesToCheck.some((node) => {
    const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
    return Boolean(element?.closest?.(SELECTION_TOOLBAR_EXCLUDE_SELECTORS));
  });
}

function isPointerInExcludedChrome(target) {
  return Boolean(target?.closest?.(SELECTION_TOOLBAR_EXCLUDE_SELECTORS));
}

function unwrapExistingQuoteHighlights(root) {
  root.querySelectorAll(".note-quote-highlight").forEach((element) => {
    const textNode = document.createTextNode(element.textContent || "");
    element.replaceWith(textNode);
    textNode.parentElement?.normalize();
  });
}

function unwrapExistingSearchHighlights(root) {
  root.querySelectorAll(".note-search-highlight").forEach((element) => {
    const textNode = document.createTextNode(element.textContent || "");
    element.replaceWith(textNode);
    textNode.parentElement?.normalize();
  });
}

function wrapFirstSearchMatch(root, matchText, queryText) {
  const candidates = [matchText, queryText]
    .flatMap((value) => {
      const raw = String(value || "").trim();
      if (!raw) return [];
      const words = raw.split(/\s+/).filter((word) => word.length >= 3);
      return [raw, ...words];
    })
    .filter(Boolean);

  for (const candidate of candidates) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (isSkippableHighlightNode(node)) return NodeFilter.FILTER_REJECT;
        const text = node.nodeValue || "";
        return text.toLowerCase().includes(candidate.toLowerCase())
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      },
    });

    const target = walker.nextNode();
    if (!target) continue;
    const lowerText = target.nodeValue.toLowerCase();
    const startIndex = lowerText.indexOf(candidate.toLowerCase());
    if (startIndex < 0) continue;
    const matchNode = target.splitText(startIndex);
    matchNode.splitText(candidate.length);
    const wrapper = document.createElement("span");
    wrapper.className = "note-search-highlight";
    wrapper.title = "Search result";
    matchNode.parentNode.insertBefore(wrapper, matchNode);
    wrapper.appendChild(matchNode);
    return wrapper;
  }
  return null;
}

function wrapFirstTextMatch(root, quote, activeQuoteId) {
  const selectedText = String(quote?.selected_text || quote?.selectedText || "").trim();
  if (!selectedText) return null;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (isSkippableHighlightNode(node)) return NodeFilter.FILTER_REJECT;
      const text = node.nodeValue || "";
      return text.includes(selectedText) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });

  const target = walker.nextNode();
  if (!target) return null;

  const startIndex = target.nodeValue.indexOf(selectedText);
  const matchNode = target.splitText(startIndex);
  matchNode.splitText(selectedText.length);

  const wrapper = document.createElement("span");
  const quoteId = String(quote.quote_id || quote.quoteId || "");
  wrapper.className =
    quoteId && quoteId === activeQuoteId
      ? "note-quote-highlight note-quote-highlight--active"
      : "note-quote-highlight";
  wrapper.dataset.quoteId = quoteId;
  wrapper.dataset.selectedText = selectedText;
  wrapper.dataset.personalNote = String(
    quote?.personal_note ||
      quote?.personalNote ||
      quote?.note ||
      quote?.content ||
      "",
  ).trim();
  wrapper.tabIndex = 0;
  wrapper.setAttribute("role", "button");
  wrapper.title = wrapper.dataset.personalNote
    ? "Click to review your saved note"
    : "Saved to your notes";
  matchNode.parentNode.insertBefore(wrapper, matchNode);
  wrapper.appendChild(matchNode);
  return wrapper;
}

function getSelectionContext(selection, selectedText) {
  const anchorText = selection.anchorNode?.parentElement?.textContent || "";
  const matchIndex = anchorText.indexOf(selectedText);
  if (matchIndex < 0) {
    return { contextBefore: "", contextAfter: "" };
  }
  return {
    contextBefore: anchorText.slice(Math.max(0, matchIndex - 180), matchIndex),
    contextAfter: anchorText.slice(matchIndex + selectedText.length, matchIndex + selectedText.length + 180),
  };
}

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

function HeadingCopyH1({ children, id, theme, ...domProps }) {
  const [toolbarRef, titleRef] = useH1TitleFit([children, id]);

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
      </div>
    </h1>
  );
}

const HeadingWithCopy = ({ level, children, ...props }) => {
  const id = props.node?.data?.id || props.id;
  const Tag = `h${level}`;
  const theme = props.theme || "light";

  const { node: _nodeIgnored, ...restMarkdownProps } = props;

  if (level === 1) {
    return (
      <HeadingCopyH1 {...restMarkdownProps} id={id} theme={theme}>
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

const MarkdownContent = memo(function MarkdownContent({
  content,
  components,
}) {
  return (
    <ReactMarkdown
      remarkPlugins={MARKDOWN_REMARK_PLUGINS}
      rehypePlugins={[
        rehypeRaw,
        [rehypeSanitize, MARKDOWN_SANITIZE_SCHEMA],
        [rehypeKatex, { strict: false }],
        rehypeHighlight,
      ]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
});

const MarkdownRenderer = ({
  content,
  theme,
  noteQuotes = [],
  activeQuoteId = "",
  searchQuery = "",
  searchMatchText = "",
  onCreateQuoteFromSelection,
  onAskWithSelectedText,
  onGenerateQuizFromSelection,
  immersiveMode = false,
  selectionActionsEnabled = NOTE_SELECTION_ACTIONS_ENABLED,
}) => {
  const bodyRef = useRef(null);
  const { t } = useTranslation();
  const selectionRangeRef = useRef(null);
  const selectionStartedInBodyRef = useRef(false);
  const noteComposerOpenRef = useRef(false);
  const [selectionToolbar, setSelectionToolbar] = useState(null);
  const [noteComposerOpen, setNoteComposerOpen] = useState(false);
  const [personalNoteText, setPersonalNoteText] = useState("");
  const [personalNoteSaving, setPersonalNoteSaving] = useState(false);
  const [activeQuoteDetail, setActiveQuoteDetail] = useState(null);
  const noteDirectory = useSelector(
    (state) => state.currentNote.meta?.directory,
  );
  const normalizedContent = useMemo(() => normalizeTranslatedMarkdown(content), [content]);

  const confirmedQuotes = useMemo(
    () => (Array.isArray(noteQuotes) ? noteQuotes.filter((quote) => quote?.selected_text || quote?.selectedText) : []),
    [noteQuotes],
  );

  useEffect(() => {
    noteComposerOpenRef.current = noteComposerOpen;
  }, [noteComposerOpen]);

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

  useEffect(() => {
    const root = bodyRef.current;
    if (!root) return undefined;

    const readQuoteDetail = (element) => ({
      quoteId: element.dataset.quoteId || "",
      selectedText: element.dataset.selectedText || element.textContent || "",
      personalNote: element.dataset.personalNote || "",
    });

    const handleQuoteClick = (event) => {
      const quoteElement = event.target?.closest?.(".note-quote-highlight");
      if (!quoteElement || !root.contains(quoteElement)) return;
      event.preventDefault();
      event.stopPropagation();
      setActiveQuoteDetail(readQuoteDetail(quoteElement));
    };

    const handleQuoteKeyDown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const quoteElement = event.target?.closest?.(".note-quote-highlight");
      if (!quoteElement || !root.contains(quoteElement)) return;
      event.preventDefault();
      setActiveQuoteDetail(readQuoteDetail(quoteElement));
    };

    root.addEventListener("click", handleQuoteClick);
    root.addEventListener("keydown", handleQuoteKeyDown);

    return () => {
      root.removeEventListener("click", handleQuoteClick);
      root.removeEventListener("keydown", handleQuoteKeyDown);
    };
  }, []);

  useEffect(() => {
    const root = bodyRef.current;
    if (!root) return undefined;
    window.setTimeout(() => {
      unwrapExistingQuoteHighlights(root);
      unwrapExistingSearchHighlights(root);
      let activeElement = null;
      confirmedQuotes.forEach((quote) => {
        const wrapped = wrapFirstTextMatch(root, quote, activeQuoteId);
        const quoteId = String(quote.quote_id || quote.quoteId || "");
        if (quoteId && quoteId === activeQuoteId) activeElement = wrapped;
      });
      if (searchQuery || searchMatchText) {
        activeElement = wrapFirstSearchMatch(root, searchMatchText, searchQuery) || activeElement;
      }
      if (activeElement) {
        activeElement.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 0);
    return () => {
      unwrapExistingQuoteHighlights(root);
      unwrapExistingSearchHighlights(root);
    };
  }, [content, confirmedQuotes, activeQuoteId, searchQuery, searchMatchText]);

  const restoreSavedSelection = () => {
    const range = selectionRangeRef.current;
    if (!range) return;
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(range);
  };

  useLayoutEffect(() => {
    if (!selectionActionsEnabled || !selectionToolbar || noteComposerOpenRef.current) return;
    restoreSavedSelection();
  }, [selectionActionsEnabled, selectionToolbar]);

  useEffect(() => {
    if (selectionActionsEnabled) return;
    setSelectionToolbar(null);
    selectionRangeRef.current = null;
    setNoteComposerOpen(false);
    setPersonalNoteText("");
  }, [selectionActionsEnabled]);

  useEffect(() => {
    if (!selectionActionsEnabled || !selectionToolbar) return undefined;

    const handleOutsideToolbarPointerDown = (event) => {
      if (noteComposerOpenRef.current) return;
      if (event.target?.closest?.(".note-selection-toolbar")) return;
      setSelectionToolbar(null);
      selectionRangeRef.current = null;
    };

    document.addEventListener("pointerdown", handleOutsideToolbarPointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", handleOutsideToolbarPointerDown, true);
    };
  }, [selectionActionsEnabled, selectionToolbar]);

  const updateSelectionToolbarFromCurrentSelection = () => {
    if (!selectionActionsEnabled) return;
    if (noteComposerOpenRef.current) return;

    const root = bodyRef.current;
    const selection = window.getSelection();
    if (!root || !selection || selection.rangeCount === 0 || selection.isCollapsed) {
      setSelectionToolbar(null);
      selectionRangeRef.current = null;
      setNoteComposerOpen(false);
      setPersonalNoteText("");
      return;
    }

    const range = selection.getRangeAt(0);
    if (!root.contains(range.commonAncestorContainer)) {
      setSelectionToolbar(null);
      selectionRangeRef.current = null;
      setNoteComposerOpen(false);
      setPersonalNoteText("");
      return;
    }
    if (isSelectionInExcludedChrome(selection)) {
      setSelectionToolbar(null);
      selectionRangeRef.current = null;
      setNoteComposerOpen(false);
      setPersonalNoteText("");
      return;
    }
    const selectedText = selection.toString().replace(/\s+/g, " ").trim();
    if (!selectedText) {
      setSelectionToolbar(null);
      selectionRangeRef.current = null;
      setNoteComposerOpen(false);
      setPersonalNoteText("");
      return;
    }
    const rect = range.getBoundingClientRect();
    const fallbackRect = range.getClientRects()?.[0];
    const selectionRect = rect.width || rect.height ? rect : fallbackRect;
    if (!selectionRect) return;
    const context = getSelectionContext(selection, selectedText);
    selectionRangeRef.current = range.cloneRange();
    setSelectionToolbar({
      selectedText,
      ...context,
      x: selectionRect.left + selectionRect.width / 2,
      y: Math.max(12, selectionRect.top - 44),
    });
    setNoteComposerOpen(false);
    setPersonalNoteText("");
  };

  const scheduleSelectionToolbarUpdate = () => {
    window.setTimeout(updateSelectionToolbarFromCurrentSelection, 0);
  };

  const handleSelectionPointerDownCapture = (event) => {
    if (!selectionActionsEnabled) return;
    if (event.target?.closest?.(".note-selection-toolbar")) return;
    if (isPointerInExcludedChrome(event.target)) {
      selectionStartedInBodyRef.current = false;
      return;
    }
    selectionStartedInBodyRef.current = true;
  };

  const handleSelectionMouseUp = (event) => {
    if (!selectionActionsEnabled) return;
    if (event.target?.closest?.(".note-selection-toolbar")) return;
    scheduleSelectionToolbarUpdate();
  };

  useEffect(() => {
    if (!selectionActionsEnabled) return undefined;

    const handleDocumentSelectionEnd = (event) => {
      if (noteComposerOpenRef.current) return;
      if (event.target?.closest?.(".note-selection-toolbar")) return;
      if (!selectionStartedInBodyRef.current) return;
      selectionStartedInBodyRef.current = false;
      scheduleSelectionToolbarUpdate();
    };

    const handleKeyboardSelection = () => {
      if (noteComposerOpenRef.current) return;
      const root = bodyRef.current;
      const selection = window.getSelection();
      if (!root || !selection || selection.rangeCount === 0) return;
      if (!root.contains(selection.getRangeAt(0).commonAncestorContainer)) return;
      scheduleSelectionToolbarUpdate();
    };

    document.addEventListener("pointerup", handleDocumentSelectionEnd, true);
    document.addEventListener("mouseup", handleDocumentSelectionEnd, true);
    document.addEventListener("keyup", handleKeyboardSelection, true);
    return () => {
      document.removeEventListener("pointerup", handleDocumentSelectionEnd, true);
      document.removeEventListener("mouseup", handleDocumentSelectionEnd, true);
      document.removeEventListener("keyup", handleKeyboardSelection, true);
    };
  }, [selectionActionsEnabled]);

  const clearSelectionToolbar = () => {
    setSelectionToolbar(null);
    selectionRangeRef.current = null;
    setNoteComposerOpen(false);
    setPersonalNoteText("");
    setPersonalNoteSaving(false);
  };

  const handleAddSelectionToNotes = async () => {
    if (!selectionToolbar) return;
    if (immersiveMode) {
      if (!noteComposerOpen) {
        setNoteComposerOpen(true);
      }
      return;
    }
    restoreSavedSelection();
    await onCreateQuoteFromSelection?.(selectionToolbar);
    clearSelectionToolbar();
  };

  const handleSavePersonalNote = async () => {
    if (!selectionToolbar || personalNoteSaving) return;
    setPersonalNoteSaving(true);
    restoreSavedSelection();
    await onCreateQuoteFromSelection?.({
      ...selectionToolbar,
      personalNote: personalNoteText.trim(),
    });
    clearSelectionToolbar();
  };

  const handleAskSelection = () => {
    if (!selectionToolbar) return;
    restoreSavedSelection();
    onAskWithSelectedText?.(selectionToolbar);
    clearSelectionToolbar();
  };

  const handleGenerateQuizSelection = () => {
    if (!selectionToolbar) return;
    restoreSavedSelection();
    onGenerateQuizFromSelection?.(selectionToolbar);
    clearSelectionToolbar();
  };

  const preventToolbarSelectionLoss = (event) => {
    event.stopPropagation();
    if (noteComposerOpenRef.current && event.target?.closest?.("textarea, input")) {
      return;
    }
    if (!event.target?.closest?.("textarea, input")) {
      event.preventDefault();
    }
    if (!noteComposerOpenRef.current) {
      restoreSavedSelection();
    }
  };

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

  const components = useMemo(
    () => ({
      h1: (props) => <HeadingWithCopy level={1} {...props} />,
      h2: (props) => <HeadingWithCopy level={2} {...props} />,
      h3: (props) => <HeadingWithCopy level={3} {...props} />,
      h4: (props) => <HeadingWithCopy level={4} {...props} />,
      h5: (props) => <HeadingWithCopy level={5} {...props} />,
      h6: (props) => <HeadingWithCopy level={6} {...props} />,

      blockquote({ node: _nodeIgnored, children, className = "", ...props }) {
        const quoteClassName = ["markdown-blockquote", className].filter(Boolean).join(" ");
        return (
          <blockquote className={quoteClassName} {...props}>
            {children}
          </blockquote>
        );
      },

      // relative image path
      img({ node: _nodeIgnored, src, style, width: _ignoredWidth, height: _ignoredHeight, ...props }) {
        let finalSrc = src;
        if (src && !/^https?:\/\//.test(src) && noteDirectory !== undefined) {
          const base = noteDirectory === "." ? "" : noteDirectory;
          const resolved = resolveRelativePath(base, src);
          finalSrc = `${import.meta.env.BASE_URL}notes/${resolved}`;
        }

        return <MarkdownImage finalSrc={finalSrc} style={style} {...props} />;
      },

      // code block formatting
      pre({ children, ...props }) {
        if (children?.type === MermaidDiagram || children?.type === NoteInteractiveBlock) {
          return children;
        }
        return <pre className="md-fences" {...props}>{children}</pre>;
      },

      code({ children, className, ...props }) {
        const codeText = String(children || "").replace(/\n$/, "");
        if (/\blanguage-mermaid\b/.test(className || "")) {
          return <MermaidDiagram chart={codeText} />;
        }
        if (/\blanguage-note-interactive\b/.test(className || "")) {
          return <NoteInteractiveBlock configText={codeText} />;
        }
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },

      // table styling
      table(props) {
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

    }),
    [noteDirectory],
  );

  return (
    <div
      ref={bodyRef}
      className="markdown-body"
      onPointerDownCapture={handleSelectionPointerDownCapture}
      onMouseUp={handleSelectionMouseUp}
    >
      <MarkdownContent content={normalizedContent} components={components} />
      {activeQuoteDetail ? (
        <div className="note-quote-popover" role="dialog" aria-label="Saved personal note">
          <div className="note-quote-popover__header">
            <span>Saved note</span>
            <button type="button" onClick={() => setActiveQuoteDetail(null)} aria-label="Close saved note">
              &times;
            </button>
          </div>
          <blockquote>{activeQuoteDetail.selectedText}</blockquote>
          {activeQuoteDetail.personalNote ? (
            <p>{activeQuoteDetail.personalNote}</p>
          ) : (
            <p className="note-quote-popover__empty">No personal note was added for this highlight.</p>
          )}
        </div>
      ) : null}
      {selectionActionsEnabled && selectionToolbar ? (
        <div
          className={`note-selection-toolbar ${
            immersiveMode ? "note-selection-toolbar--immersive" : ""
          }`}
          onPointerDown={preventToolbarSelectionLoss}
          onMouseDown={preventToolbarSelectionLoss}
          onPointerUp={preventToolbarSelectionLoss}
          onMouseUp={preventToolbarSelectionLoss}
          onClick={(event) => {
            event.stopPropagation();
            restoreSavedSelection();
          }}
          style={{
            left: `${selectionToolbar.x}px`,
            top: `${selectionToolbar.y}px`,
          }}
        >
          {!(immersiveMode && noteComposerOpen) ? (
            <>
              <button type="button" tabIndex={-1} onClick={handleAddSelectionToNotes}>
                {t("note.selection.addToNotes")}
              </button>
              <button type="button" tabIndex={-1} onClick={handleAskSelection}>
                {t("note.selection.ask")}
              </button>
              <button type="button" tabIndex={-1} onClick={handleGenerateQuizSelection}>
                {t("note.selection.generateQuiz")}
              </button>
            </>
          ) : null}
          {immersiveMode && noteComposerOpen ? (
            <div className="note-selection-toolbar__composer">
              <blockquote className="note-selection-toolbar__quote-preview">
                {selectionToolbar.selectedText}
              </blockquote>
              <textarea
                value={personalNoteText}
                onChange={(event) => setPersonalNoteText(event.target.value)}
                placeholder={t("note.selection.notePlaceholder")}
                rows={3}
                autoFocus
              />
              <div className="note-selection-toolbar__composer-actions">
                <button type="button" tabIndex={-1} onClick={clearSelectionToolbar}>
                  {t("common.cancel")}
                </button>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={handleSavePersonalNote}
                  disabled={personalNoteSaving}
                >
                  {personalNoteSaving ? t("common.loading") : t("common.save")}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default MarkdownRenderer;
