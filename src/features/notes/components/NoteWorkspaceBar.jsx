import { Dropdown, Tooltip } from "antd";
import {
  AudioOutlined,
  CustomerServiceOutlined,
  PauseCircleOutlined,
  LoadingOutlined,
  ApartmentOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  HistoryOutlined,
  DownOutlined,
} from "@ant-design/icons";

import useTranslation from "../../../i18n/useTranslation";

import "./NoteWorkspaceBar.css";

function NoteWorkspaceBar({
  narrationState = "idle",
  isNarrationPlaying = false,
  onToggleNarration,
  officialPodcast = null,
  onOpenPodcast,
  workspaceBarRef = null,
  exploreGuideRef = null,
  immersiveMode = false,
  onToggleImmersiveMode,
  isCurrentNoteCompleted = false,
  completePending = false,
  onToggleCompletion,
  onEnoughForNow,
  workspaceMeta = null,
  onExploreMindmap,
  isMobile = false,
}) {
  const { t } = useTranslation();

  const narrationDisabled = narrationState !== "ready";
  let narrationLabel = t("note.narration.unavailable");
  if (narrationState === "loading") narrationLabel = t("note.narration.loading");
  if (narrationState === "ready") {
    narrationLabel = isNarrationPlaying ? t("note.narration.pause") : t("note.narration.play");
  }
  if (narrationState === "error") narrationLabel = t("note.narration.failed");

  const showMindmap = Boolean(workspaceMeta?.showMindmap);
  const versions = Array.isArray(workspaceMeta?.versions) ? workspaceMeta.versions : [];
  const hasVersions = versions.length > 0;
  const restoreCount = Number(workspaceMeta?.restoreCandidateCount || 0);

  const completionLabel = completePending
    ? t("note.toolbar.updating")
    : isCurrentNoteCompleted
      ? t("note.toolbar.completed")
      : t("note.toolbar.markComplete");

  return (
    <div className="note-workspace-bar" ref={workspaceBarRef} aria-label="Note workspace tools">
      <div className="note-workspace-bar__study" aria-label="Study">
        {typeof onToggleCompletion === "function" ? (
          <Tooltip title={isCurrentNoteCompleted ? t("note.toolbar.markIncomplete") : t("note.toolbar.markThisComplete")}>
            <button
              type="button"
              className={`note-workspace-bar__completion ${
                isCurrentNoteCompleted ? "note-workspace-bar__completion--done" : ""
              }`}
              onClick={onToggleCompletion}
              disabled={completePending}
            >
              {isCurrentNoteCompleted ? <CheckCircleOutlined /> : <CheckOutlined />}
              <span>{completionLabel}</span>
            </button>
          </Tooltip>
        ) : null}

        {typeof onEnoughForNow === "function" ? (
          <Tooltip title={t("note.toolbar.enoughForNowHint", "Pause here without marking this note complete")}>
            <button
              type="button"
              className="note-workspace-bar__icon-btn note-workspace-bar__enough"
              onClick={onEnoughForNow}
            >
              <PauseCircleOutlined />
              <span>{t("note.toolbar.enoughForNow", "Enough for now")}</span>
            </button>
          </Tooltip>
        ) : null}

        {showMindmap ? (
          <Tooltip title={t("note.toolbar.openMindmap")}>
            <button
              type="button"
              className="note-workspace-bar__icon-btn"
              ref={exploreGuideRef}
              onClick={onExploreMindmap}
              aria-label={t("note.toolbar.openMindmap")}
            >
              <ApartmentOutlined />
              {!isMobile ? <span>{t("note.toolbar.mindmap")}</span> : null}
            </button>
          </Tooltip>
        ) : null}

        <Tooltip title={immersiveMode ? t("note.toolbar.exitImmersive") : t("note.toolbar.enterImmersive")}>
          <button
            type="button"
            className={`note-workspace-bar__icon-btn ${
              immersiveMode ? "note-workspace-bar__icon-btn--active" : ""
            }`}
            onClick={onToggleImmersiveMode}
            aria-label={immersiveMode ? t("note.toolbar.exitImmersive") : t("note.toolbar.enterImmersive")}
            aria-pressed={immersiveMode}
          >
            {immersiveMode ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            {!isMobile ? <span>{t("note.toolbar.immersive")}</span> : null}
          </button>
        </Tooltip>

        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          menu={{
            items: [
              {
                key: "narration",
                icon: isNarrationPlaying ? <PauseCircleOutlined /> : <AudioOutlined />,
                label: (
                  <span className="note-workspace-bar__audio-option">
                    <strong>{narrationLabel}</strong>
                    <small>Listen to this note</small>
                  </span>
                ),
                disabled: narrationDisabled,
              },
              {
                key: "podcast",
                icon: <CustomerServiceOutlined />,
                label: (
                  <span className="note-workspace-bar__audio-option">
                    <strong>{t("note.podcast.title", "Official Podcast")}</strong>
                    <small>{officialPodcast ? "Course discussion including this note" : "Not available for this note"}</small>
                  </span>
                ),
                disabled: !officialPodcast,
              },
            ],
            onClick: ({ key }) => {
              if (key === "narration" && !narrationDisabled) onToggleNarration?.();
              if (key === "podcast" && officialPodcast) onOpenPodcast?.();
            },
          }}
        >
          <button
            type="button"
            className="note-workspace-bar__version-trigger note-workspace-bar__audio-trigger"
            aria-label={t("note.audio.choose", "Choose narration or podcast")}
            aria-haspopup="menu"
          >
            {narrationState === "loading" ? <LoadingOutlined /> : <AudioOutlined />}
            {!isMobile ? <span>{t("note.toolbar.audio", "Audio")}</span> : null}
            <DownOutlined className="note-workspace-bar__version-chevron" aria-hidden="true" />
          </button>
        </Dropdown>
      </div>

      {hasVersions ? (
        <details className="note-workspace-bar__version" aria-label={t("note.toolbar.noteVersion")}>
          <summary className="note-workspace-bar__version-trigger">
            <HistoryOutlined aria-hidden="true" />
            <span>{t("note.toolbar.noteVersion")}</span>
            <DownOutlined className="note-workspace-bar__version-chevron" aria-hidden="true" />
          </summary>
          <div className="note-workspace-bar__version-popover">
            <label className="note-workspace-bar__version-field">
              <span className="note-workspace-bar__version-field-label">{t("note.toolbar.view")}</span>
              <select
                className="note-workspace-bar__version-select"
                value={workspaceMeta?.selectedVersionId || "current"}
                onChange={(event) => workspaceMeta?.onVersionChange?.(event.target.value)}
              >
                {versions.map((version) => (
                  <option key={version.version_id} value={version.version_id}>
                    {version.is_current ? t("note.toolbar.current") : version.version_id}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="note-workspace-bar__restore-btn"
              onClick={() => workspaceMeta?.onRestoreAnnotations?.()}
              disabled={workspaceMeta?.restorePending}
            >
              {workspaceMeta?.restorePending ? t("note.toolbar.restoring") : t("note.toolbar.restoreHighlights")}
            </button>
            {restoreCount > 0 ? (
              <span className="note-workspace-bar__restore-hint">
                {restoreCount} {t("note.toolbar.candidates")}
              </span>
            ) : null}
          </div>
        </details>
      ) : null}

      <span className="note-workspace-bar__sr-only" aria-live="polite">
        {narrationLabel}
      </span>
    </div>
  );
}

export default NoteWorkspaceBar;
