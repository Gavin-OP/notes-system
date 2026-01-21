import { Select, Switch, Tooltip, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

function NoteHeader({
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  onSearch,
}) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const themeLabel = language === "cn" ? "主题" : "Theme";
  const languageLabel = language === "cn" ? "语言" : "Language";
  const darkLabel = language === "cn" ? "深色" : "Dark";
  const lightLabel = language === "cn" ? "浅色" : "Light";

  return (
    <div>
      {/* theme switch */}
      <span>{themeLabel}</span>
      <Switch
        checked={theme === "dark"}
        checkedChildren={darkLabel}
        unCheckedChildren={lightLabel}
        onChange={onThemeChange}
      />

      {/* language switch */}
      <span style={{ marginLeft: 16 }}>{languageLabel}</span>
      <Select
        value={language}
        style={{ width: 100 }}
        onChange={onLanguageChange}
        options={[
          { value: "en", label: "English" },
          { value: "cn", label: "中文" },
        ]}
      />

      {/* search */}
      <Tooltip
        title={
          <Input.Search
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={onSearch}
            autoFocus
            style={{ width: 200 }}
          />
        }
        trigger={["click"]}
        open={showSearch}
        onOpenChange={setShowSearch}
        placement="bottom"
      >
        <SearchOutlined
          style={{ fontSize: 20, marginLeft: 16, cursor: "pointer" }}
          onClick={() => setShowSearch(true)}
        />
      </Tooltip>
    </div>
  );
}

export default NoteHeader;
