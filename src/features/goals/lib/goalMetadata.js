export const GOAL_TYPE_CONFIG = [
  {
    type: "career",
    label: "Career",
    description: "Prepare for a role, industry, or professional transition.",
    example: "Become a data analyst",
    variant: "wisdom",
  },
  {
    type: "project",
    label: "Project",
    description: "Build skills by completing something concrete and useful.",
    example: "Build a personal website",
    variant: "teal",
  },
  {
    type: "interest",
    label: "Interest",
    description: "Explore a field because you want to understand it more deeply.",
    example: "Understand the foundations of behavioral finance",
    variant: "slate",
  },
];

export const LEARNING_ARCHETYPE_LABELS = {
  conceptual: "Conceptual",
  practice_based: "Practice-based",
  creative: "Creative",
};

export function getGoalTypeConfig(goalType = "") {
  return GOAL_TYPE_CONFIG.find((item) => item.type === goalType) || {
    type: goalType || "custom",
    label: goalType ? goalType.replace(/_/g, " ") : "Custom",
    description: "A personal learning outcome.",
    example: "",
    variant: "slate",
  };
}

export function formatArchetype(value = "") {
  return LEARNING_ARCHETYPE_LABELS[value] || String(value || "").replace(/_/g, " ");
}
