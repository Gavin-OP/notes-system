const enabledValues = new Set(["1", "true", "yes", "on"]);

export const FULL_PRODUCT_ENABLED = enabledValues.has(
  String(import.meta.env.VITE_ENABLE_FULL_PRODUCT || "").trim().toLowerCase(),
);

export const PILOT_SUBJECT_SLUG =
  String(import.meta.env.VITE_PILOT_SUBJECT_SLUG || "fall-recruiting").trim() || "fall-recruiting";

export const PILOT_START_PATH =
  String(import.meta.env.VITE_PILOT_START_PATH || "").trim() ||
  `/note/${PILOT_SUBJECT_SLUG}/autumn-recruitment-roadmap.md`;
