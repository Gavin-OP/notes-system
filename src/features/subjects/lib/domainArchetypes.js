const DOMAIN_ARCHETYPES = {
  "data-science": ["Conceptual", "Practice-based"],
  finance: ["Conceptual"],
  python: ["Practice-based", "Conceptual"],
  statistics: ["Conceptual", "Practice-based"],
};

export function getDomainArchetypes(subjectSlug = "") {
  return DOMAIN_ARCHETYPES[subjectSlug] || ["Conceptual"];
}
