import { useState } from "react";
import { useSelector } from "react-redux";
import { Dropdown, AutoComplete, Space } from "antd";
import {
  SearchOutlined,
  GlobalOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
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

  // Constants
  const searchPlaceholder = language === "cn" ? "搜索..." : "Search...";

  // Language menu items
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

  // Handle theme toggle
  const handleThemeToggle = () => {
    onThemeChange(theme !== "dark");
  };

  return (
    <div>
      <Space size={isMobile ? "small" : "middle"}>
        {/* Search */}
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

        {/* Language selector - click globe icon to show dropdown */}
        <Dropdown
          menu={{ items: languageItems, selectable: true, selectedKeys: [language] }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <GlobalOutlined className="note-header__icon note-header__icon--clickable" />
        </Dropdown>

        {/* Theme toggle - click icon to switch theme */}
        {theme === "dark" ? (
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
      </Space>
    </div>
  );
}

export default NoteHeader;
