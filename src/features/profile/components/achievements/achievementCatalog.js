export const SUBJECT_COUNT_MILESTONES = [5, 10, 20, 50];
export const TOTAL_LEARNING_DAY_MILESTONES = [30, 50, 100, 200];

const EXCLUDED_SUBJECT_SLUGS = new Set(["disclaimer", "mindmap", "test", "image"]);

export function buildBestStreakTrophy(overview = {}) {
  const maxStreak = overview.max_streak ?? overview.maxStreak ?? 0;
  return {
    id: "overview-best-streak",
    category: "overview",
    title: "Best Streak",
    description: "",
    value: maxStreak,
    isUnlocked: true,
    earnedAt: "",
  };
}

export function buildAchievementCatalog(subjects = []) {
  const catalog = [
    {
      id: "overview-best-streak",
      category: "overview",
      title: "Best Streak",
      description: "",
      value: null,
    },
  ];

  SUBJECT_COUNT_MILESTONES.forEach((milestone) => {
    catalog.push({
      id: `subjects_completed_${milestone}`,
      category: "subjects_milestone",
      title: `Explored ${milestone} Knowledge Domains`,
      description: "",
      value: milestone,
    });
  });

  TOTAL_LEARNING_DAY_MILESTONES.forEach((milestone) => {
    catalog.push({
      id: `total_learning_days_${milestone}`,
      category: "total_days",
      title: `${milestone} Learning Days`,
      description: "",
      value: milestone,
    });
  });

  subjects.forEach((subject) => {
    catalog.push({
      id: `subject_completed:${subject.slug}`,
      category: "subject",
      title: `Explored ${subject.title}`,
      description: "",
      value: subject.title,
    });
  });

  return catalog;
}

export function mergeAchievementCatalog(catalog, earnedAchievements = [], overview = {}) {
  const bestStreak = buildBestStreakTrophy(overview);
  const earnedById = new Map(
    earnedAchievements
      .filter((item) => item.id !== "streak_max" && item.category !== "streak")
      .map((item) => [item.id, item]),
  );

  return catalog.map((item) => {
    if (item.id === "overview-best-streak") {
      return bestStreak;
    }

    const earned = earnedById.get(item.id);
    if (earned) {
      return {
        ...item,
        ...earned,
        description: "",
        isUnlocked: true,
      };
    }

    return {
      ...item,
      description: "",
      isUnlocked: false,
      earnedAt: "",
    };
  });
}

export function extractSubjectsFromNotesIndex(notesIndex = []) {
  const subjects = [];
  notesIndex.forEach((item) => {
    const url = String(item?.url || "").split("#")[0];
    const match = url.match(/^\/note\/([^/]+)$/);
    if (!match) return;
    const slug = match[1].toLowerCase();
    if (EXCLUDED_SUBJECT_SLUGS.has(slug)) return;

    const rawTitle = String(item.title || item.name || slug)
      .replace(/\.md$/i, "")
      .trim();
    if (rawTitle.toLowerCase() === "disclaimer") return;

    const title = rawTitle
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    subjects.push({ slug, title });
  });
  return subjects.sort((a, b) => a.title.localeCompare(b.title));
}

export function buildDomainBadges(subjects = [], completedNotes = []) {
  const subjectBySlug = new Map(subjects.map((subject) => [String(subject.slug).toLowerCase(), subject]));
  const completedIdsBySlug = new Map();

  completedNotes.forEach((note) => {
    const noteUrl = String(note.noteUrl || note.note_url || "").split(/[?#]/)[0];
    const urlMatch = noteUrl.match(/^\/note\/([^/]+)/);
    const subjectSlug = String(note.subject || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const slug = String(urlMatch?.[1] || subjectSlug).toLowerCase();
    if (slug && !EXCLUDED_SUBJECT_SLUGS.has(slug)) {
      if (!completedIdsBySlug.has(slug)) completedIdsBySlug.set(slug, new Set());
      completedIdsBySlug.get(slug).add(String(note.id || noteUrl));
    }
  });

  return [...completedIdsBySlug].map(([slug, completedIds]) => {
    const subject = subjectBySlug.get(slug);
    return {
      id: `domain_explored:${slug}`,
      category: "domain",
      title: subject?.title || slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
      description: "Domain explored",
      value: null,
      courseCount: completedIds.size,
      isUnlocked: true,
    };
  }).sort((a, b) => a.title.localeCompare(b.title));
}
