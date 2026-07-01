import React, { useState } from "react";
import { useSelector } from "react-redux";
import { LinkOutlined } from "@ant-design/icons";

import "./CopyLinkIcon.css";

const CopyLinkIcon = ({ id }) => {
  const currentTheme = useSelector((state) => state.preference.theme);
  const language = useSelector((state) => state.preference.language) || "cn";

  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const messages = {
    cn: { title: "复制链接", copied: "已复制" },
    en: { title: "Copy link", copied: "Copied!" },
  };

  const styleVars = {
    "--copy-link-icon-color": currentTheme === "dark" ? "#bbb" : "#666",
    "--copy-link-tip-bg": currentTheme === "dark" ? "#222" : "#f8f8f8",
  };

  return (
    <span
      className="copy-link-icon"
      style={styleVars}
      onClick={handleCopy}
      title={messages[language]?.title || messages.cn.title}
    >
      <LinkOutlined />
      {copied && (
        <span className="copied-tip">
          {messages[language]?.copied || messages.cn.copied}
        </span>
      )}
    </span>
  );
};

export default CopyLinkIcon;
