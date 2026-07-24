export const GOAL_TYPE_CONFIG = [
  {
    type: "career",
    label: "Career",
    description: "Prepare for a role, industry, or professional transition.",
    example: "Become a data analyst",
    variant: "wisdom",
  },
  {
    type: "certification",
    label: "Certification",
    description: "Work toward an exam, qualification, or assessed standard.",
    example: "Pass a piano grade exam",
    variant: "primary",
  },
  {
    type: "project",
    label: "Project",
    description: "Learn by completing something concrete and useful.",
    example: "Build a personal website",
    variant: "teal",
  },
  {
    type: "adventure",
    label: "Adventure",
    description: "Prepare for an experience with skills, practice, and safety.",
    example: "Complete a Class 3 hiking route",
    variant: "sage",
  },
  {
    type: "creative",
    label: "Creative",
    description: "Develop a creative practice, body of work, or personal voice.",
    example: "Create a night photography portfolio",
    variant: "lavender",
  },
  {
    type: "performance",
    label: "Performance",
    description: "Prepare to perform a skill with or for other people.",
    example: "Join an amateur band",
    variant: "coral",
  },
  {
    type: "mastery",
    label: "Mastery",
    description: "Build reliable depth in a subject or skill.",
    example: "Use Python confidently for data analysis",
    variant: "primary",
  },
  {
    type: "exploration",
    label: "Exploration",
    description: "Explore a field before committing to a larger goal.",
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
