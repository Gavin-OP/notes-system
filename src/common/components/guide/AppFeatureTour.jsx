import { useEffect, useMemo, useState } from "react";
import { Button, Tour } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import { getMyGuideState, updateMyGuideState } from "../../api/user";

const STORAGE_PREFIX = "notes-system.guide.";

function getLocalGuideState(guideKey) {
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${guideKey}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

function setLocalGuideState(guideKey, state) {
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${guideKey}`, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

function AppFeatureTour({
  guideKey,
  steps = [],
  startLabel = "Start Guide",
  iconOnly = false,
  buttonAriaLabel = "Open guide",
  triggerClassName = "",
}) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false);

  const normalizedSteps = useMemo(
    () => {
      const total = steps.length;
      return steps.map((step, index) => {
        const isLast = index === total - 1;
        const rawTitle = String(step.title || "").trim();
        return {
          ...step,
          title: `(${index + 1}/${total}) ${rawTitle}`,
          nextButtonProps:
            step.nextButtonProps ??
            (isLast
              ? {
                  children: "Finish",
                }
              : {
                  children: "Next",
                }),
        };
      });
    },
    [steps],
  );

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      if (!guideKey || normalizedSteps.length === 0) {
        setReady(true);
        return;
      }
      const localState = getLocalGuideState(guideKey);
      if (localState?.completed) {
        setCurrent(0);
        setOpen(false);
        setReady(true);
        return;
      }
      try {
        const response = await getMyGuideState();
        if (cancelled) return;
        const remote = response?.guides?.[guideKey];
        const completed = Boolean(remote?.completed);
        const currentStep = Math.max(0, Number(remote?.current_step || 0));
        if (completed) {
          setOpen(false);
          setCurrent(0);
          setLocalGuideState(guideKey, {
            completed: true,
            seen: true,
            current_step: 0,
          });
        } else {
          setCurrent(Math.min(currentStep, Math.max(0, normalizedSteps.length - 1)));
          setOpen(true);
          setLocalGuideState(guideKey, {
            completed: false,
            seen: true,
            current_step: currentStep,
          });
          await updateMyGuideState({
            guideKey,
            seen: true,
            currentStep,
          });
        }
      } catch {
        if (cancelled) return;
        const fallbackStep = Math.max(0, Number(localState?.current_step || 0));
        setCurrent(Math.min(fallbackStep, Math.max(0, normalizedSteps.length - 1)));
        setOpen(true);
      } finally {
        if (!cancelled) setReady(true);
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [guideKey, normalizedSteps.length]);

  const handleStepChange = async (nextCurrent) => {
    setCurrent(nextCurrent);
    setLocalGuideState(guideKey, {
      completed: false,
      seen: true,
      current_step: nextCurrent,
    });
    try {
      await updateMyGuideState({
        guideKey,
        seen: true,
        currentStep: nextCurrent,
      });
    } catch {
      // ignore network errors
    }
  };

  const handleFinish = async () => {
    setOpen(false);
    setCurrent(0);
    setLocalGuideState(guideKey, {
      completed: true,
      seen: true,
      current_step: 0,
    });
    try {
      await updateMyGuideState({
        guideKey,
        seen: true,
        completed: true,
        currentStep: 0,
      });
    } catch {
      // ignore network errors
    }
  };

  if (!ready || normalizedSteps.length === 0) return null;

  return (
    <>
      <Button
        size="small"
        type={iconOnly ? "text" : "default"}
        icon={iconOnly ? <QuestionCircleOutlined /> : null}
        onClick={() => setOpen(true)}
        aria-label={iconOnly ? buttonAriaLabel : undefined}
        title={iconOnly ? buttonAriaLabel : undefined}
        className={triggerClassName || undefined}
      >
        {iconOnly ? null : startLabel}
      </Button>
      <Tour
        open={open}
        current={current}
        onChange={handleStepChange}
        onClose={handleFinish}
        steps={normalizedSteps}
      />
    </>
  );
}

export default AppFeatureTour;
