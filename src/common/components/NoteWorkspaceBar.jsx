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
  CommentOutlined,
  ApartmentOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";

import AppFeatureTour from "./guide/AppFeatureTour";
import SearchModal from "./SearchModal";
import SemanticChip from "./SemanticChip";

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
  onToggleAssistant,
  assistantActive = false,
  isCurrentNoteCompleted = false,
  completePending = false,
  onToggleCompletion,
  workspaceMeta = null,
  onExploreMindmap,
  isMobile = false,
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  const languageItems = [
    { key: "en", label: "English", onClick: () => onLanguageChange("en") },
    { key: "cn", label: "中文", onClick: () => onLanguageChange("cn") },
  ];

  const narrationDisabled = narrationState !== "ready";
  let narrationLabel = "Narration unavailable";
  if (narrationState === "loading") narrationLabel = "Loading narration";
  if (narrationState === "ready") {
    narrationLabel = isNarrationPlaying ? "Pause narration" : "Play narration";
  }
  if (narrationState === "error") narrationLabel = "Narration failed";

  const showMindmap = Boolean(workspaceMeta?.showMindmap);
  const versions = Array.isArray(workspaceMeta?.versions) ? workspaceMeta.versions : [];
  const hasVersions = versions.length > 0;
  const restoreCount = Number(workspaceMeta?.restoreCandidateCount || 0);

  const completionLabel = completePending
    ? "Updating..."
    : isCurrentNoteCompleted
      ? "Completed"
      : "Mark complete";

  const morePanel = (
    <div className="note-workspace-bar__more-panel">
      {hasVersions ? (
        <div className="note-workspace-bar__more-version">
          <span className="note-workspace-bar__more-label">Note version</span>
          <label className="note-workspace-bar__version-field">
            <span className="note-workspace-bar__version-field-label">View</span>
            <select
              className="note-workspace-bar__version-select"
              value={workspaceMeta?.selectedVersionId || "current"}
              onChange={(event) => workspaceMeta?.onVersionChange?.(event.target.value)}
            >
              {versions.map((version) => (
                <option key={version.version_id} value={version.version_id}>
                  {version.is_current ? "Current" : version.version_id}
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
            {workspaceMeta?.restorePending ? "Restoring…" : "Restore highlights"}
          </button>
          {restoreCount > 0 ? (
            <span className="note-workspace-bar__restore-hint">
              {restoreCount} candidates to review
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
          {theme === "light" ? "Dark mode" : "Light mode"}
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
            {language === "cn" ? "中文" : "English"}
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
          Narration
        </button>
        <button type="button" className="note-workspace-bar__more-action" onClick={onOpenProfile}>
          <UserOutlined />
          Profile
        </button>
      </div>
    </div>
  );

  return (
    <div className="note-workspace-bar" ref={workspaceBarRef} aria-label="Note workspace tools">
      <div className="note-workspace-bar__study" aria-label="Study">
        {typeof onToggleCompletion === "function" ? (
          <Tooltip title={isCurrentNoteCompleted ? "Mark as not complete" : "Mark this note complete"}>
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
          <Tooltip title="Explore subject mindmap">
            <button
              type="button"
              className="note-workspace-bar__icon-btn"
              ref={exploreGuideRef}
              onClick={onExploreMindmap}
              aria-label="Open mindmap"
            >
              <ApartmentOutlined />
              {!isMobile ? <span>Mindmap</span> : null}
            </button>
          </Tooltip>
        ) : null}
      </div>

      <div className="note-workspace-bar__assist" aria-label="Assist">
        <Tooltip title={assistantActive ? "Assistant open" : "Open learning assistant"}>
          <button
            type="button"
            className={`note-workspace-bar__icon-btn ${
              assistantActive ? "note-workspace-bar__icon-btn--active" : ""
            }`}
            onClick={onToggleAssistant}
            aria-label="Learning assistant"
            aria-pressed={assistantActive}
          >
            <CommentOutlined />
            {!isMobile ? <span>Assistant</span> : null}
          </button>
        </Tooltip>

        <Tooltip title="Search notes">
          <button
            type="button"
            className="note-workspace-bar__icon-btn"
            onClick={() => setSearchOpen(true)}
            aria-label="Search notes"
          >
            <SearchOutlined />
            {!isMobile ? <span>Search</span> : null}
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
            buttonAriaLabel="Learning guide"
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
            aria-label="More workspace options"
          >
            <MoreOutlined />
            {!isMobile ? <span>More</span> : null}
            {hasVersions ? (
              <SemanticChip variant="slate" className="note-workspace-bar__more-badge">
                Version
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
