import { useState } from "react";
import { Dropdown, Tooltip } from "antd";
import {
  SearchOutlined,
  GlobalOutlined,
  SunOutlined,
  MoonOutlined,
  AudioOutlined,
  PauseCircleOutlined,
  LoadingOutlined,
  UserOutlined,
  ApartmentOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons";

import AppFeatureTour from "./guide/AppFeatureTour";
import SearchModal from "./SearchModal";
import SemanticChip from "./SemanticChip";
import useTranslation from "../../i18n/useTranslation";

import "./NoteWorkspaceBar.css";

function NoteWorkspaceBar({
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  searchOptions = [],
  narrationState = "idle",
  isNarrationPlaying = false,
  onToggleNarration,
  workspaceBarRef = null,
  exploreGuideRef = null,
  notesGuideSteps = [],
  notesTourStartToken = 0,
  onNotesTourStepChange,
  onOpenProfile,
  immersiveMode = false,
  onToggleImmersiveMode,
  isCurrentNoteCompleted = false,
  completePending = false,
  onToggleCompletion,
  workspaceMeta = null,
  onExploreMindmap,
  isMobile = false,
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { t } = useTranslation();

  const languageItems = [
    { key: "en", label: t("language.english"), onClick: () => onLanguageChange("en") },
    { key: "cn", label: t("language.chinese"), onClick: () => onLanguageChange("cn") },
  ];

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

  const morePanel = (
    <div className="note-workspace-bar__more-panel">
      {hasVersions ? (
        <div className="note-workspace-bar__more-version">
          <span className="note-workspace-bar__more-label">{t("note.toolbar.noteVersion")}</span>
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
      ) : null}
      <div className="note-workspace-bar__more-actions">
        <button
          type="button"
          className="note-workspace-bar__more-action"
          onClick={() => onThemeChange(theme !== "dark")}
        >
          {theme === "light" ? <MoonOutlined /> : <SunOutlined />}
          {theme === "light" ? t("note.toolbar.darkMode") : t("note.toolbar.lightMode")}
        </button>
        <Dropdown
          menu={{
            items: languageItems,
            selectable: true,
            selectedKeys: [language],
          }}
          trigger={["click"]}
          placement="bottomLeft"
        >
          <button type="button" className="note-workspace-bar__more-action">
            <GlobalOutlined />
            {language === "cn" ? t("language.chinese") : t("language.english")}
          </button>
        </Dropdown>
        <button
          type="button"
          className="note-workspace-bar__more-action"
          disabled={narrationDisabled}
          onClick={() => {
            if (!narrationDisabled) onToggleNarration?.();
          }}
        >
          {narrationState === "loading" ? (
            <LoadingOutlined />
          ) : isNarrationPlaying ? (
            <PauseCircleOutlined />
          ) : (
            <AudioOutlined />
          )}
          {t("note.toolbar.narration")}
        </button>
        <button type="button" className="note-workspace-bar__more-action" onClick={onOpenProfile}>
          <UserOutlined />
          {t("note.toolbar.profile")}
        </button>
      </div>
    </div>
  );

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
      </div>

      <div className="note-workspace-bar__assist" aria-label="Assist">
        <Tooltip title={t("note.toolbar.searchNotes")}>
          <button
            type="button"
            className="note-workspace-bar__icon-btn"
            onClick={() => setSearchOpen(true)}
            aria-label={t("note.toolbar.searchNotes")}
          >
            <SearchOutlined />
            {!isMobile ? <span>{t("note.toolbar.search")}</span> : null}
          </button>
        </Tooltip>
        <SearchModal
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          localOptions={searchOptions}
        />
      </div>

      <div className="note-workspace-bar__meta" aria-label="Settings">
        {Array.isArray(notesGuideSteps) && notesGuideSteps.length > 0 ? (
          <AppFeatureTour
            guideKey="notes_page"
            steps={notesGuideSteps}
            iconOnly
            buttonAriaLabel={t("note.toolbar.learningGuide")}
            triggerClassName="note-workspace-bar__guide-trigger"
            startToken={notesTourStartToken}
            onBeforeStepChange={onNotesTourStepChange}
          />
        ) : null}

        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          overlayClassName="note-workspace-bar__more-overlay"
          dropdownRender={() => morePanel}
        >
          <button
            type="button"
            className="note-workspace-bar__icon-btn note-workspace-bar__more-btn"
            aria-label={t("note.toolbar.moreOptions")}
          >
            <MoreOutlined />
            {!isMobile ? <span>{t("note.toolbar.more")}</span> : null}
            {hasVersions ? (
              <SemanticChip variant="slate" className="note-workspace-bar__more-badge">
                {t("note.toolbar.version")}
              </SemanticChip>
            ) : null}
          </button>
        </Dropdown>
      </div>

      <span className="note-workspace-bar__sr-only" aria-live="polite">{narrationLabel}</span>
    </div>
  );
}

export default NoteWorkspaceBar;
