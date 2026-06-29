import { useCallback } from "react";
import { useSelector } from "react-redux";

import { translate } from "./translations";

function useTranslation() {
  const language = useSelector((state) => state.preference.language) || "en";
  const t = useCallback(
    (key, fallback) => translate(language, key, fallback),
    [language],
  );

  return { language, t };
}

export default useTranslation;
