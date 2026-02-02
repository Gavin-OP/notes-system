import { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // constants
  const themeLabel = language === "cn" ? "主题" : "Theme";
  const languageLabel = language === "cn" ? "语言" : "Language";
  const darkLabel = language === "cn" ? "深色" : "Dark";
  const lightLabel = language === "cn" ? "浅色" : "Light";
  const searchPlaceholder = language === "cn" ? "搜索..." : "Search...";

  return (
    <div style={{ paddingRight: isMobile ? "8px" : "0" }}>
      <Space size={isMobile ? "small" : "middle"}>
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
                style={{ width: isMobile ? 150 : 200 }}
              ></AutoComplete>
            )}
            <SearchOutlined
              style={{ fontSize: 18, cursor: "pointer" }}
              onClick={() => setShowSearch(true)}
            />
          </Space>
        </span>

        {/* language switch - hide label on mobile */}
        {!isMobile && <span>{languageLabel}</span>}
        <Select
          value={language}
          options={[
            { value: "en", label: "English" },
            { value: "cn", label: "中文" },
          ]}
          onChange={onLanguageChange}
          style={{ width: isMobile ? 80 : 100 }}
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
