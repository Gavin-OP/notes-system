import { getExperienceLevelChipVariant } from "../../../shared/lib/semanticChipUtils";

export const CAREER_LEVEL_OPTIONS = [
  { label: "Entry", value: "Entry" },
  { label: "Senior", value: "Senior" },
  { label: "Manager", value: "Manager" },
];

const EXPERIENCE_LEVEL_LABELS = {
  entry: "Entry Level",
  entry_or_mid: "Entry Level",
  senior: "Senior Level",
  manager: "Manager Level",
  unspecified: "Unspecified",
};

const DEGREE_LEVEL_ORDER = ["associate", "bachelor", "master", "phd", "unspecified"];

const DEGREE_LEVEL_LABELS = {
  associate: "Associate",
  bachelor: "Bachelor",
  master: "Master",
  phd: "PhD",
  unspecified: "Unspecified",
};

function normalizeToken(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

const TAXONOMY_ACRONYMS = {
  ai: "AI",
  api: "API",
  bi: "BI",
  ml: "ML",
  phd: "PhD",
  sql: "SQL",
  numpy: "NumPy",
  pandas: "Pandas",
  pytorch: "PyTorch",
};

export function formatTaxonomyLabel(value = "") {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";

  return trimmed
    .replace(/[_-]+/g, " ")
    .split(/\s+/)
    .map((word) => {
      const key = word.toLowerCase();
      if (TAXONOMY_ACRONYMS[key]) return TAXONOMY_ACRONYMS[key];
      if (word === word.toUpperCase() && word.length > 1) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

export function formatExperienceLevel(level = "") {
  const normalized = normalizeToken(level);
  if (!normalized) return EXPERIENCE_LEVEL_LABELS.unspecified;
  return EXPERIENCE_LEVEL_LABELS[normalized] || level.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getExperienceLevelTagColor(level = "") {
  return getExperienceLevelChipVariant(level);
}

export function formatDegreeLevel(level = "") {
  const normalized = normalizeToken(level);
  if (!normalized) return DEGREE_LEVEL_LABELS.unspecified;
  return DEGREE_LEVEL_LABELS[normalized] || level.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatCareerRoleLabel(title = "", experienceLevel = "") {
  const levelLabel = formatExperienceLevel(experienceLevel);
  if (experienceLevel && normalizeToken(experienceLevel) !== "unspecified") {
    return `${title} (${levelLabel})`;
  }
  return title;
}

export function formatDegreeRequirement(requirement = {}) {
  const level = formatDegreeLevel(requirement.level);
  const fields = requirement.fields || [];
  return fields.length ? `${level}: ${fields.join(", ")}` : level;
}

function degreeLevelSortKey(level = "") {
  const normalized = normalizeToken(level);
  const index = DEGREE_LEVEL_ORDER.indexOf(normalized);
  return index === -1 ? DEGREE_LEVEL_ORDER.length : index;
}

export function normalizeDegreeRequirements(requirements = []) {
  if (!Array.isArray(requirements)) return [];

  const grouped = new Map();
  requirements.forEach((requirement) => {
    const level = formatDegreeLevel(requirement?.level);
    const fields = Array.isArray(requirement?.fields) ? requirement.fields : [];
    const existing = grouped.get(level) || { level, fields: new Set() };
    fields.forEach((field) => {
      const label = String(field || "").trim();
      if (label) existing.fields.add(label);
    });
    grouped.set(level, existing);
  });

  return Array.from(grouped.values())
    .map((item) => ({
      level: item.level,
      fields: Array.from(item.fields).sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => degreeLevelSortKey(a.level) - degreeLevelSortKey(b.level));
}
