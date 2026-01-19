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

  return (
    <div>
      {/* 主题切换 */}
      <span>Theme: </span>
      <Switch
        checked={theme === "dark"}
        checkedChildren="Dark"
        unCheckedChildren="Light"
        onChange={onThemeChange}
      />

      {/* 语言切换 */}
      <span style={{ marginLeft: 16 }}>Language: </span>
      <Select
        value={language}
        style={{ width: 100 }}
        onChange={onLanguageChange}
        options={[
          { value: "en", label: "English" },
          { value: "cn", label: "中文" },
        ]}
      />

      {/* 搜索 */}
      <Tooltip
        title={
          showSearch ? (
            <Input.Search
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={onSearch}
              autoFocus
              style={{ width: 200 }}
            />
          ) : null
        }
        trigger={["hover"]}
        open={showSearch}
        onOpenChange={setShowSearch}
        placement="bottom"
      >
        <SearchOutlined
          style={{ fontSize: 20, marginLeft: 16, cursor: "pointer" }}
        />
      </Tooltip>
    </div>
  );
}

export default NoteHeader;
