import { useEffect, useMemo, useState } from "react";

import { translateContent } from "../shared/api/translations";
import useTranslation from "./useTranslation";


function useTranslatedContent(content, options = {}) {
  const { language } = useTranslation();
  const normalizedContent = useMemo(() => String(content || ""), [content]);
  const [translatedContent, setTranslatedContent] = useState(normalizedContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const targetLanguage = String(options.targetLanguage || language || "en").toLowerCase();
    const sourceLanguage = String(options.sourceLanguage || "en").toLowerCase();
    setTranslatedContent(normalizedContent);
    setError(null);

    if (
      !normalizedContent.trim() ||
      sourceLanguage === targetLanguage ||
      targetLanguage === "en" ||
      options.disabled
    ) {
      setLoading(false);
      return undefined;
    }

    async function runTranslation() {
      setLoading(true);
      try {
        const response = await translateContent({
          source_type: options.sourceType || "dynamic_text",
          source_id: options.sourceId || "dynamic",
          source_language: sourceLanguage,
          target_language: targetLanguage,
          content: normalizedContent,
          content_hash: options.contentHash || null,
          content_version: options.contentVersion || null,
        });
        if (!cancelled) {
          setTranslatedContent(response?.translated_content || normalizedContent);
        }
      } catch (translationError) {
        if (!cancelled) {
          setError(translationError);
          setTranslatedContent(normalizedContent);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    runTranslation();
    return () => {
      cancelled = true;
    };
  }, [
    language,
    normalizedContent,
    options.contentHash,
    options.contentVersion,
    options.disabled,
    options.sourceId,
    options.sourceLanguage,
    options.sourceType,
    options.targetLanguage,
  ]);

  return {
    content: translatedContent,
    loading,
    error,
    isTranslated: translatedContent !== normalizedContent,
  };
}

export default useTranslatedContent;
