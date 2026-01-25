import { useEffect } from "react";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";

import "katex/dist/katex.min.css";

const themeCssMap = {
  default_light: `${import.meta.env.BASE_URL}src/pages/NotePage/components/theme/default_light.css`,
  light: `${import.meta.env.BASE_URL}src/pages/NotePage/components/theme/default_light.css`,
  dark: `${import.meta.env.BASE_URL}src/pages/NotePage/components/theme/d42ker-github.css`,
};

const MarkdownRenderer = ({ content, theme }) => {
  const noteDirectory = useSelector(
    (state) => state.currentNote.meta?.directory,
  );

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

  const resolveRelativePath = (base, relative) => {
    const stack = base ? base.split("/") : [];
    const parts = relative.split("/");
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === "." || parts[i] === "") continue;
      if (parts[i] === "..") stack.pop();
      else stack.push(parts[i]);
    }
    return stack.join("/");
  };

  const components = {
    img({ src, ...props }) {
      let finalSrc = src;
      if (src && !/^https?:\/\//.test(src) && noteDirectory !== undefined) {
        const base = noteDirectory === "." ? "" : noteDirectory;
        const resolved = resolveRelativePath(base, src);
        finalSrc = `${import.meta.env.BASE_URL}notes/${resolved}`;
      }
      return <img src={finalSrc} {...props} />;
    },
  };

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeRaw], [rehypeKatex, { strict: false }]]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
