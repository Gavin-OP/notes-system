import { useState } from "react";
import { useSelector } from "react-redux";
import { Dropdown, AutoComplete, Space, Tooltip } from "antd";
import {
  SearchOutlined,
  GlobalOutlined,
  SunOutlined,
  MoonOutlined,
  AudioOutlined,
  PauseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import "./NoteHeader.css";

function NoteHeader({
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  onSearch,
  narrationState = "idle",
  isNarrationPlaying = false,
  onToggleNarration,
}) {
  // redux
  const isMobile = useSelector((state) => state.preference.isMobile);

  // state
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // constants
  const searchPlaceholder = language === "cn" ? "搜索..." : "Search...";

  // language menu items
  const languageItems = [
    {
      key: "en",
      label: "English",
      onClick: () => onLanguageChange("en"),
    },
    {
      key: "cn",
      label: "中文",
      onClick: () => onLanguageChange("cn"),
    },
  ];

  // handle theme toggle
  const handleThemeToggle = () => {
    onThemeChange(theme !== "dark");
  };

  const narrationDisabled = narrationState !== "ready";
  let narrationLabel = "Narration unavailable";
  if (narrationState === "loading") narrationLabel = "Loading narration audio";
  if (narrationState === "ready") {
    narrationLabel = isNarrationPlaying ? "Pause narration" : "Play narration";
  }
  if (narrationState === "error") narrationLabel = "Narration failed";

  const handleNarrationKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!narrationDisabled) onToggleNarration?.();
    }
  };

  return (
    <div>
      <Space size={isMobile ? "small" : "middle"}>
        {/* search */}
        <span
          className="note-header__search-wrapper"
          onMouseEnter={() => setShowSearch(true)}
          onMouseLeave={() => setShowSearch(false)}
        >
          <Space>
            {showSearch && (
              <AutoComplete
                className={`note-header__search-input ${isMobile ? "note-header__search-input--mobile" : ""}`}
                value={searchValue}
                options={[]}
                onChange={setSearchValue}
                onSelect={onSearch}
                placeholder={searchPlaceholder}
                showSearch
                autoFocus
              ></AutoComplete>
            )}
            <SearchOutlined
              className="note-header__search-icon"
              onClick={() => setShowSearch(true)}
            />
          </Space>
        </span>

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
        <span className="note-header__sr-only" aria-live="polite">
          {narrationLabel}
        </span>
      </Space>
    </div>
  );
}

export default NoteHeader;
