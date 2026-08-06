const SUPPORTED_LOCALES = new Set(["cn", "tw", "en"]);

export function resolveStaticNoteLocalePath(notePath, language) {
  const normalizedPath = String(notePath || "").replace(/^\/+/, "");
  const locale = SUPPORTED_LOCALES.has(language) ? language : "cn";
  if (!normalizedPath.startsWith("fall-recruiting/") || locale === "cn") return normalizedPath;
  return normalizedPath.replace(/\.md$/i, `.${locale}.md`);
}

export function getStaticLocaleUnavailableMessage(language) {
  if (language === "tw") return "此筆記的繁體中文版本暫時無法載入，以下顯示簡體中文內容。";
  if (language === "en") return "The English version of this note is temporarily unavailable. Simplified Chinese is shown below.";
  return "";
}
