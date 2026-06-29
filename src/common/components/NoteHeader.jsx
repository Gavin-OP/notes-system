import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dropdown, Space, Tooltip } from "antd";
import {
  SearchOutlined,
  GlobalOutlined,
  SunOutlined,
  MoonOutlined,
  AudioOutlined,
  PauseCircleOutlined,
  LoadingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import AppFeatureTour from "./guide/AppFeatureTour";
import SearchModal from "./SearchModal";
import useTranslation from "../../i18n/useTranslation";

import "./NoteHeader.css";

function NoteHeader({
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  searchOptions = [],
  narrationState = "idle",
  isNarrationPlaying = false,
  onToggleNarration,
  narrationGuideRef = null,
  profileGuideRef = null,
  headerToolbarRef = null,
  notesGuideSteps = [],
  notesTourStartToken = 0,
  onNotesTourStepChange,
}) {
  const navigate = useNavigate();
  // redux
  const isMobile = useSelector((state) => state.preference.isMobile);
  const { t } = useTranslation();

  // state
  const [searchOpen, setSearchOpen] = useState(false);

  // language menu items
  const languageItems = [
    {
      key: "en",
      label: t("language.english"),
      onClick: () => onLanguageChange("en"),
    },
    {
      key: "cn",
      label: t("language.chinese"),
      onClick: () => onLanguageChange("cn"),
    },
  ];

  // handle theme toggle
  const handleThemeToggle = () => {
    onThemeChange(theme !== "dark");
  };

  const narrationDisabled = narrationState !== "ready";
  let narrationLabel = t("note.narration.unavailable");
  if (narrationState === "loading") narrationLabel = t("note.narration.loadingAudio");
  if (narrationState === "ready") {
    narrationLabel = isNarrationPlaying ? t("note.narration.pause") : t("note.narration.play");
  }
  if (narrationState === "error") narrationLabel = t("note.narration.failed");

  const handleNarrationKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!narrationDisabled) onToggleNarration?.();
    }
  };

  return (
    <div>
      <Space size={isMobile ? "small" : "middle"} ref={headerToolbarRef}>
        {/* search */}
        <SearchOutlined
          className="note-header__search-icon"
          onClick={() => setSearchOpen(true)}
        />
        <SearchModal
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          localOptions={searchOptions}
        />

        {/* language selector - click globe icon to show dropdown */}
        <Dropdown
          menu={{
            items: languageItems,
            selectable: true,
            selectedKeys: [language],
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <GlobalOutlined className="note-header__icon note-header__icon--clickable" />
        </Dropdown>

        {/* theme toggle - click icon to switch theme */}
        {theme === "light" ? (
          <MoonOutlined
            className="note-header__icon note-header__icon--clickable"
            onClick={handleThemeToggle}
          />
        ) : (
          <SunOutlined
            className="note-header__icon note-header__icon--clickable"
            onClick={handleThemeToggle}
          />
        )}

        <span ref={narrationGuideRef}>
          <Tooltip title={narrationLabel}>
            <span
              role="button"
              tabIndex={narrationDisabled ? -1 : 0}
              aria-label={narrationLabel}
              onClick={() => {
                if (!narrationDisabled) onToggleNarration?.();
              }}
              onKeyDown={handleNarrationKeyDown}
              className={`note-header__icon note-header__icon--clickable ${
                narrationDisabled ? "note-header__icon--disabled" : ""
              }`}
            >
              {narrationState === "loading" ? (
                <LoadingOutlined />
              ) : isNarrationPlaying ? (
                <PauseCircleOutlined />
              ) : (
                <AudioOutlined />
              )}
            </span>
          </Tooltip>
        </span>
        {Array.isArray(notesGuideSteps) && notesGuideSteps.length > 0 ? (
          <AppFeatureTour
            guideKey="notes_page"
            steps={notesGuideSteps}
            iconOnly
            buttonAriaLabel={t("note.toolbar.learningGuide")}
            triggerClassName="note-header__guide-trigger"
            startToken={notesTourStartToken}
            onBeforeStepChange={onNotesTourStepChange}
          />
        ) : null}
        <span ref={profileGuideRef}>
          <UserOutlined
            className="note-header__icon note-header__icon--clickable"
            onClick={() => navigate("/user/profile")}
          />
        </span>
        <span className="note-header__sr-only" aria-live="polite">
          {narrationLabel}
        </span>
      </Space>
    </div>
  );
}

export default NoteHeader;
