export function waitForTourTarget() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.setTimeout(resolve, 100);
    });
  });
}

export function createProfileGuideSteps(refs, t = (key, fallback) => fallback || key) {
  const {
    profileHeroRef,
    profileDashboardTabsRef,
    profileLearningRef,
    profileRecordsRef,
    profileCareerRef,
  } = refs;

  return [
    {
      title: t("guide.profile.0.title", "Pick up where you left off"),
      description: t(
        "guide.profile.0.description",
        "Continue learning returns you to your current note. Your goals, courses, progress, saved passages, and optional career planning all live here.",
      ),
      target: () => profileHeroRef?.current,
      placement: "bottom",
    },
    {
      title: t("guide.profile.1.title", "Your learning workspace"),
      description: t(
        "guide.profile.1.description",
        "Overview connects your current direction. My Goals, My Learning, and My Courses separate outcomes, progress, and course perspectives; Career remains an optional goal-discovery lens.",
      ),
      target: () => profileDashboardTabsRef?.current,
      placement: "bottom",
    },
    {
      title: t("guide.profile.2.title", "Track momentum"),
      description: t(
        "guide.profile.2.description",
        "Learning progress, achievements, and your activity history show what you have finished and how consistently you study.",
      ),
      target: () => profileLearningRef?.current,
      placement: "top",
    },
    {
      title: t("guide.profile.3.title", "Revisit what you saved"),
      description: t(
        "guide.profile.3.description",
        "Assistant conversations and highlighted passages land here. Open any item to jump back to the note where you left off.",
      ),
      target: () => profileRecordsRef?.current,
      placement: "top",
    },
    {
      title: t("guide.profile.4.title", "Aim at a role, if you want"),
      description: t(
        "guide.profile.4.description",
        "Set career goals, compare matches, and turn skill gaps into a concrete learning path. Skip this entirely if you are here just to study.",
      ),
      target: () => profileCareerRef?.current,
      placement: "top",
    },
  ];
}

export async function prepareProfileTourStep(stepIndex, controls) {
  const { setActiveDashboard, setLearningRecordsTab } = controls;

  switch (stepIndex) {
    case 0:
    case 1:
      setActiveDashboard("overview");
      break;
    case 2:
      setActiveDashboard("learning");
      setLearningRecordsTab("study");
      break;
    case 3:
      setActiveDashboard("learning");
      setLearningRecordsTab("interactions");
      break;
    case 4:
      setActiveDashboard("career");
      break;
    default:
      break;
  }

  await waitForTourTarget();
}

export function createNoteGuideSteps(refs, t = (key, fallback) => fallback || key) {
  const {
    directoryAreaRef,
    noteAreaRef,
    exploreGuideRef,
    assistantAreaRef,
    workspaceBarRef,
  } = refs;

  return [
    {
      title: t("guide.note.0.title", "Your learning workspace"),
      description: t(
        "guide.note.0.description",
        "Read notes in order, explore ideas visually, and ask the assistant—all without leaving this page. We will walk through the pieces that matter most.",
      ),
      placement: "center",
    },
    {
      title: t("guide.note.1.title", "Follow the course path"),
      description: t(
        "guide.note.1.description",
        "The sidebar lists notes in sequence. Pick any topic to jump ahead, or work top to bottom when you want a guided path.",
      ),
      target: () => directoryAreaRef?.current,
      placement: "right",
    },
    {
      title: t("guide.note.2.title", "Read, highlight, complete"),
      description: t(
        "guide.note.2.description",
        "Study in the main canvas. Highlight text to save a quote or ask a question. Mark complete from the workspace bar when you are ready to move on.",
      ),
      target: () => noteAreaRef?.current,
      placement: "right",
    },
    {
      title: t("guide.note.3.title", "Explore connections"),
      description: t(
        "guide.note.3.description",
        "Open Mindmap from the workspace bar when a linear list is not enough—see how concepts relate across the subject.",
      ),
      target: () =>
        exploreGuideRef?.current ||
        document.querySelector(".note-workspace-bar__study .note-workspace-bar__icon-btn"),
      placement: "bottom",
    },
    {
      title: t("guide.note.4.title", "Ask, capture, test"),
      description: t(
        "guide.note.4.description",
        "Use Notes to collect your own takeaways and Quiz to check understanding. The floating assistant stays available for questions anywhere in the product.",
      ),
      target: () => assistantAreaRef?.current,
      placement: "left",
    },
    {
      title: t("guide.note.5.title", "Workspace shortcuts"),
      description: t(
        "guide.note.5.description",
        "Mark notes complete, switch versions, listen to narration, or use the top bar for search, home, theme, language, and profile.",
      ),
      target: () =>
        workspaceBarRef?.current ||
        document.querySelector(".note-workspace-bar"),
      placement: "bottom",
    },
  ];
}

export async function prepareNoteTourStep(stepIndex, controls) {
  const {
    setCollapsed,
    setShowMenu,
    setAssistantCollapsed,
    setAssistantMode,
    setAssistantDockTab,
    setAssistantTool,
    setAssistantModalOpen,
    isMobile,
  } = controls;

  switch (stepIndex) {
    case 0:
      break;
    case 1:
    case 2:
      setShowMenu(true);
      setCollapsed(false);
      break;
    case 3:
      break;
    case 4:
      if (isMobile) {
        setAssistantModalOpen?.(true);
      } else {
        setAssistantMode("dock");
        setAssistantCollapsed(false);
        setAssistantDockTab("notes");
        setAssistantTool("notes");
      }
      break;
    case 5:
      if (isMobile) {
        setAssistantModalOpen?.(false);
      }
      break;
    default:
      break;
  }

  await waitForTourTarget();
}
