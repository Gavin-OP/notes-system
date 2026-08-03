import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import "./BottomOutlineProgress.css";

function getScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / scrollable));
}

function resolveActiveHeadingId(outline) {
  if (!Array.isArray(outline) || outline.length === 0) return "";
  const candidates = outline
    .map((item) => {
      if (!item?.id) return null;
      const element = document.getElementById(item.id);
      if (!element) return null;
      return {
        id: item.id,
        top: element.getBoundingClientRect().top,
      };
    })
    .filter(Boolean);
  const current = candidates.filter((item) => item.top <= 140).at(-1);
  return current?.id || candidates[0]?.id || "";
}

const BottomOutlineProgress = ({ outline }) => {
  const language = useSelector((state) => state.preference.language);
  const [progress, setProgress] = useState(() => getScrollProgress());
  const [activeId, setActiveId] = useState("");
  const outlineItems = useMemo(
    () =>
      (Array.isArray(outline) ? outline : [])
        .filter((item) => item?.id && item?.text)
        .slice(0, 18),
    [outline],
  );

  useEffect(() => {
    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setProgress(getScrollProgress());
        setActiveId(resolveActiveHeadingId(outlineItems));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [outlineItems]);

  if (outlineItems.length === 0) return null;

  const label = language !== "en" ? "阅读进度" : "Reading progress";

  return (
    <aside className="bottom-outline-progress" aria-label={label}>
      <div className="bottom-outline-progress__bar" aria-hidden="true">
        <span
          className="bottom-outline-progress__bar-fill"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <div className="bottom-outline-progress__items">
        {outlineItems.map((item) => {
          const isActive = item.id === activeId;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`bottom-outline-progress__item ${
                isActive ? "bottom-outline-progress__item--active" : ""
              }`}
              data-level={item.level}
            >
              {item.text}
            </a>
          );
        })}
      </div>
    </aside>
  );
};

export default BottomOutlineProgress;
