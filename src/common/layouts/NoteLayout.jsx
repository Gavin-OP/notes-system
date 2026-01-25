import { useState } from "react";
import { Layout, Menu, Breadcrumb, Button, theme, Row, Col } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setTheme, setLanguage } from "../../redux/preferenceSlice";
import NoteHeader from "../components/NoteHeader";
import { buildMenuItems } from "../../utils/notesIndexUtils";

const { Header, Sider, Content } = Layout;

const NoteLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [showMenu, setShowMenu] = useState(true);

  // redux
  const themeValue = useSelector((state) => state.preference.theme);
  const language = useSelector((state) => state.preference.language);
  const notesIndex = useSelector((state) => state.notesIndex.data) || [];
  const currentMeta = useSelector((state) => state.currentNote.meta);

  // menu
  const menuItems = buildMenuItems(notesIndex);

  // breadcrumb
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

  // event handlers
  const handleThemeChange = (checked) =>
    dispatch(setTheme(checked ? "dark" : "light"));
  const handleLanguageChange = (value) => dispatch(setLanguage(value));
  const handleSearch = (value) => {};
  const handleNoteSelect = (path) => navigate(path);

  return (
    <Layout style={{ width: "100%", minHeight: "100vh" }}>
      {/* header */}
      <Header
        style={{
          background: colorBgContainer,
          padding: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* menu collapse button */}
        <Row align="middle" style={{ width: "100%" }}>
          <Col>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => {
                if (!collapsed) setShowMenu(false);
                else setShowMenu(true);
                setCollapsed(!collapsed);
              }}
              style={{ fontSize: 20, marginRight: 16 }}
            />
          </Col>

          {/* space between */}
          <Col flex="auto" />

          {/* theme, language, search */}
          <Col>
            <NoteHeader
              theme={themeValue}
              language={language}
              onThemeChange={handleThemeChange}
              onLanguageChange={handleLanguageChange}
              onSearch={handleSearch}
            />
          </Col>
        </Row>
      </Header>

      <Layout>
        {/* menu */}
        <Sider
          width={350}
          collapsedWidth={0}
          style={{ background: colorBgContainer }}
          collapsible
          collapsed={collapsed}
          trigger={null}
        >
          {showMenu && (
            <Menu
              mode="inline"
              style={{ height: "100%", borderInlineEnd: 0 }}
              items={menuItems}
              onClick={({ key }) => handleNoteSelect(key)}
            />
          )}
        </Sider>

        {/* breadcrumb and markdown renderer */}
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb items={breadcrumbItems} style={{ margin: "16px 0" }} />
          <Content
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>

        {/* note outline */}
        <Sider width={350} style={{ background: "transparent" }}>
          {/* <Outline noteContent={当前笔记内容} /> */}
        </Sider>
      </Layout>
    </Layout>
  );
};

export default NoteLayout;
