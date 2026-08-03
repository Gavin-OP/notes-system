const enabledValues = new Set(["1", "true", "yes", "on"]);

export const FULL_PRODUCT_ENABLED = enabledValues.has(
  String(import.meta.env.VITE_ENABLE_FULL_PRODUCT || "").trim().toLowerCase(),
);

function isFeatureEnabled(value) {
  return FULL_PRODUCT_ENABLED || enabledValues.has(String(value || "").trim().toLowerCase());
}

// Pilot features stay in the codebase and can be restored independently through env flags.
export const LEARNING_SUPPORT_ENABLED = isFeatureEnabled(import.meta.env.VITE_ENABLE_PILOT_LEARNING_SUPPORT);
export const GLOBAL_ASSISTANT_ENABLED = isFeatureEnabled(import.meta.env.VITE_ENABLE_PILOT_GLOBAL_ASSISTANT);
export const IMMERSIVE_MODE_ENABLED = isFeatureEnabled(import.meta.env.VITE_ENABLE_PILOT_IMMERSIVE_MODE);
export const NOTE_VERSION_SWITCHER_ENABLED = isFeatureEnabled(import.meta.env.VITE_ENABLE_PILOT_NOTE_VERSIONS);

export const PILOT_SUBJECT_SLUG =
  String(import.meta.env.VITE_PILOT_SUBJECT_SLUG || "fall-recruiting").trim() || "fall-recruiting";

export const PILOT_START_PATH =
  String(import.meta.env.VITE_PILOT_START_PATH || "").trim() ||
  `/note/${PILOT_SUBJECT_SLUG}/autumn-recruitment-roadmap.md`;
