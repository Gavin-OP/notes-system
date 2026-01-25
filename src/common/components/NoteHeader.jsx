import { useState } from "react";
import { Select, Switch, AutoComplete, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

function NoteHeader({
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  onSearch,
}) {
  // hooks
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // constants
  const themeLabel = language === "cn" ? "主题" : "Theme";
  const languageLabel = language === "cn" ? "语言" : "Language";
  const darkLabel = language === "cn" ? "深色" : "Dark";
  const lightLabel = language === "cn" ? "浅色" : "Light";
  const searchPlaceholder = language === "cn" ? "搜索..." : "Search...";

  return (
    <div>
      <Space>
        {/* search */}
        <span
          style={{ position: "relative" }}
          onMouseEnter={() => setShowSearch(true)}
          onMouseLeave={() => setShowSearch(false)}
        >
          <Space>
            {showSearch && (
              <AutoComplete
                value={searchValue}
                options={[]}
                onChange={setSearchValue}
                onSelect={onSearch}
                placeholder={searchPlaceholder}
                showSearch
                autoFocus
                style={{ width: 200 }}
              ></AutoComplete>
            )}
            <SearchOutlined
              style={{ fontSize: 18, cursor: "pointer" }}
              onClick={() => setShowSearch(true)}
            />
          </Space>
        </span>

        {/* language switch */}
        <span>{languageLabel}</span>
        <Select
          value={language}
          options={[
            { value: "en", label: "English" },
            { value: "cn", label: "中文" },
          ]}
          onChange={onLanguageChange}
          style={{ width: 100 }}
        />

        {/* theme switch */}
        <span>{themeLabel}</span>
        <Switch
          checked={theme === "dark"}
          checkedChildren={darkLabel}
          unCheckedChildren={lightLabel}
          onChange={onThemeChange}
        />
      </Space>
    </div>
  );
}

export default NoteHeader;
