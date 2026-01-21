import { Layout, Menu, Breadcrumb, Button, theme } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setTheme, setLanguage } from "../../redux/preferenceSlice";
import { useState } from "react";
import NoteHeader from "../components/NoteHeader";

const { Header, Sider, Content } = Layout;

function buildMenuItems(data) {
  if (!data) return [];
  return data
    // .filter((item) => item.display !== false) // 可选：只显示 display 不为 false 的
    .map((item) => {
      if (item.type === "folder" && item.children && item.children.length > 0) {
        return {
          key: item.url,
          label: item.title || item.name,
          children: buildMenuItems(item.children),
        };
      }
      return {
        key: item.url,
        label: item.title || item.name,
      };
    });
}

const NoteLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);

  // redux 状态
  const notesIndex = useSelector((state) => state.notesIndex.data || []);
  const themeValue = useSelector((state) => state.preference.theme);
  const language = useSelector((state) => state.preference.language);
  const currentMeta = useSelector((state) => state.currentNote.meta);

  // Sider 菜单项

  const menuItems = buildMenuItems(notesIndex);
  1;

  // Breadcrumb
  const breadcrumbItems = currentMeta
    ? [
        ...(currentMeta.directory && currentMeta.directory !== "."
          ? currentMeta.directory
              .split("/")
              .filter(Boolean)
              .map((dir, idx) => ({
                title: dir,
                key: idx,
              }))
          : []),
        ...(currentMeta.type === "file" && currentMeta.name
          ? [{ title: currentMeta.name, key: "name" }]
          : []),
      ]
    : [];

  // 事件处理
  const handleThemeChange = (checked) =>
    dispatch(setTheme(checked ? "dark" : "light"));
  const handleLanguageChange = (value) => dispatch(setLanguage(value));
  const handleSearch = (value) => {};
  const handleNoteSelect = (path) => navigate(path);

  return (
    <Layout style={{ minHeight: "100vh", minWidth: 1400 }}>
      <Header
        style={{
          background: colorBgContainer,
          padding: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: 20, marginRight: 16 }}
        />
        <NoteHeader
          theme={themeValue}
          language={language}
          onThemeChange={handleThemeChange}
          onLanguageChange={handleLanguageChange}
          onSearch={handleSearch}
        />
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{ background: colorBgContainer }}
          collapsible
          collapsed={collapsed}
          trigger={null}
        >
          <Menu
            mode="inline"
            style={{ height: "100%", borderInlineEnd: 0 }}
            items={menuItems}
            onClick={({ key }) => handleNoteSelect(key)}
          />
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb items={breadcrumbItems} style={{ margin: "16px 0" }} />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              minWidth: 800,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default NoteLayout;
