import { ACADEMIC_PRIMARY } from "../../styles/academicTheme";

/** DESIGN.md semantic palette — stroke colors for progress bars */
export const SEMANTIC_STROKE = {
  primary: ACADEMIC_PRIMARY,
  sage: "#5f8f63",
  wisdom: "#8a7340",
  teal: "#3d8587",
  coral: "#b86a57",
  lavender: "#7a6aab",
  slate: "#52616b",
};

const CHIP_VARIANTS = [
  "primary",
  "sage",
  "wisdom",
  "teal",
  "coral",
  "lavender",
  "slate",
];

function normalizeToken(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function normalizeScore(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.round(numeric) : 0;
}

export function getExperienceLevelChipVariant(level = "") {
  const normalized = normalizeToken(level);
  if (!normalized || normalized === "unspecified") return "slate";
  if (normalized === "entry" || normalized === "entry_or_mid" || normalized === "beginner") {
    return "sage";
  }
  if (normalized === "senior" || normalized === "intermediate") return "wisdom";
  if (normalized === "manager" || normalized === "advanced") return "coral";
  return "primary";
}

export function getMatchScoreChipVariant(score) {
  const value = normalizeScore(score);
  if (value >= 70) return "sage";
  if (value >= 45) return "wisdom";
  return "slate";
}

export function getMatchScoreStrokeColor(score) {
  return SEMANTIC_STROKE[getMatchScoreChipVariant(score)] || SEMANTIC_STROKE.slate;
}

export function getProgressStateChipVariant(status = "") {
  const normalized = normalizeToken(status);
  if (!normalized) return "slate";
  if (normalized.includes("complete")) return "sage";
  if (normalized.includes("progress") || normalized.includes("active") || normalized.includes("started")) {
    return "primary";
  }
  if (normalized.includes("review") || normalized.includes("attention")) return "wisdom";
  if (normalized.includes("error") || normalized.includes("block")) return "coral";
  return "slate";
}

export function getProgressStateStrokeColor(status = "", percent = 0) {
  const variant = getProgressStateChipVariant(status);
  if (variant !== "slate") return SEMANTIC_STROKE[variant];
  if (normalizeScore(percent) >= 100) return SEMANTIC_STROKE.sage;
  if (normalizeScore(percent) > 0) return SEMANTIC_STROKE.primary;
  return SEMANTIC_STROKE.slate;
}

export function getKnowledgeAreaChipVariant(label = "") {
  const text = String(label || "").toLowerCase();
  if (!text) return "primary";
  if (/data|technical|programming|software|engineering|math|stat|machine|analytics|computer/.test(text)) {
    return "primary";
  }
  if (/business|career|management|finance|marketing|operations|product/.test(text)) {
    return "wisdom";
  }
  if (/research|science|biology|physics|chemistry|academic|experiment/.test(text)) {
    return "teal";
  }
  if (/communication|strategy|writing|humanities|reflection|leadership|soft/.test(text)) {
    return "lavender";
  }
  if (/tool|practice|workflow|hands-on|platform/.test(text)) {
    return "sage";
  }
  if (/risk|challenge|gap|ethic|security|compliance/.test(text)) {
    return "coral";
  }
  return "primary";
}

export function getSkillChipVariant(label = "") {
  return getKnowledgeAreaChipVariant(label);
}

export function getToolChipVariant() {
  return "sage";
}

export function getSoftSkillChipVariant() {
  return "lavender";
}

export function getGapChipVariant() {
  return "coral";
}

export function getCareerGoalChipVariant() {
  return "wisdom";
}

export function getSubjectChipVariant(score) {
  if (normalizeScore(score) >= 70) return "sage";
  if (normalizeScore(score) >= 45) return "primary";
  return "teal";
}

export function isChipVariant(value = "") {
  return CHIP_VARIANTS.includes(value);
}
