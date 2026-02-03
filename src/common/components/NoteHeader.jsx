import { useState } from "react";
import { useSelector } from "react-redux";
import { Select, Switch, AutoComplete, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./NoteHeader.css";

function NoteHeader({
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  onSearch,
}) {
  // Local state
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  // Redux state
  const isMobile = useSelector((state) => state.preference.isMobile);

  // constants
  const themeLabel = language === "cn" ? "主题" : "Theme";
  const languageLabel = language === "cn" ? "语言" : "Language";
  const darkLabel = language === "cn" ? "深色" : "Dark";
  const lightLabel = language === "cn" ? "浅色" : "Light";
  const searchPlaceholder = language === "cn" ? "搜索..." : "Search...";

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
                className={`note-header__search-input ${isMobile ? 'note-header__search-input--mobile' : ''}`}
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

        {/* language switch - hide label on mobile */}
        {!isMobile && <span>{languageLabel}</span>}
        <Select
          className={`note-header__language-select ${isMobile ? 'note-header__language-select--mobile' : ''}`}
          value={language}
          options={[
            { value: "en", label: "English" },
            { value: "cn", label: "中文" },
          ]}
          onChange={onLanguageChange}
        />

        {/* theme switch - hide label on mobile */}
        {!isMobile && <span>{themeLabel}</span>}
        <Switch
          checked={theme === "dark"}
          checkedChildren={isMobile ? "" : darkLabel}
          unCheckedChildren={isMobile ? "" : lightLabel}
          onChange={onThemeChange}
        />
      </Space>
    </div>
  );
}

export default NoteHeader;
