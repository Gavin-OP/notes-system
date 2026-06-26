export function waitForTourTarget() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.setTimeout(resolve, 100);
    });
  });
}

export function createProfileGuideSteps(refs) {
  const {
    profileHeroRef,
    profileDashboardTabsRef,
    profileLearningRef,
    profileRecordsRef,
    profileCareerRef,
  } = refs;

  return [
    {
      title: "Pick up where you left off",
      description:
        "Continue learning returns you to your current note. Everything else—progress, saved passages, and career planning—lives here on your profile.",
      target: () => profileHeroRef?.current,
      placement: "bottom",
    },
    {
      title: "Learning and Career",
      description:
        "Learning tracks study progress, achievements, and saved work. Career is optional—open it when you want job matches and skill-gap guidance.",
      target: () => profileDashboardTabsRef?.current,
      placement: "bottom",
    },
    {
      title: "Track momentum",
      description:
        "Learning progress, achievements, and your activity history show what you have finished and how consistently you study.",
      target: () => profileLearningRef?.current,
      placement: "top",
    },
    {
      title: "Revisit what you saved",
      description:
        "Assistant conversations and highlighted passages land here. Open any item to jump back to the note where you left off.",
      target: () => profileRecordsRef?.current,
      placement: "top",
    },
    {
      title: "Aim at a role, if you want",
      description:
        "Set career goals, compare matches, and turn skill gaps into a concrete learning path. Skip this entirely if you are here just to study.",
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

export function createNoteGuideSteps(refs) {
  const {
    directoryAreaRef,
    noteAreaRef,
    subjectNavRef,
    assistantAreaRef,
    headerToolbarRef,
  } = refs;

  return [
    {
      title: "Your learning workspace",
      description:
        "Read notes in order, explore ideas visually, and ask the assistant—all without leaving this page. We will walk through the pieces that matter most.",
      placement: "center",
    },
    {
      title: "Follow the course path",
      description:
        "The sidebar lists notes in sequence. Pick any topic to jump ahead, or work top to bottom when you want a guided path.",
      target: () => directoryAreaRef?.current,
      placement: "right",
    },
    {
      title: "Read, highlight, complete",
      description:
        "Study in the main canvas. Highlight text to save a quote or ask a question, then mark the note complete when you are ready to move on.",
      target: () => noteAreaRef?.current,
      placement: "right",
    },
    {
      title: "Explore connections",
      description:
        "Open Mindmap from Explore when a linear list is not enough—see how concepts relate across the subject.",
      target: () => subjectNavRef?.current || document.querySelector(".note-page__subject-nav"),
      placement: "bottom",
    },
    {
      title: "Ask, capture, test",
      description:
        "Use Q&A for quick help, Notes to collect your own takeaways, and Quiz to check understanding. Outline keeps you oriented inside long notes.",
      target: () => assistantAreaRef?.current,
      placement: "left",
    },
    {
      title: "Header shortcuts",
      description:
        "Search notes, listen to narration, or open your profile for progress and career tools. Tap the question-mark icon anytime to replay this tour.",
      target: () => headerToolbarRef?.current,
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
        setAssistantDockTab("qa");
        setAssistantTool("qa");
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
