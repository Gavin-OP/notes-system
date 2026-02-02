import { useState, useEffect } from "react";
import { Layout, Menu, Breadcrumb, Button, theme, Row, Col } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setTheme, setLanguage } from "../../redux/preferenceSlice";
import NoteHeader from "../components/NoteHeader";
import OutlineSider from "../components/OutlineSider";
import { buildMenuItems } from "../../utils/notesIndexUtils";

const { Header, Sider, Content } = Layout;

const NoteLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Detect mobile screen size
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const [showMenu, setShowMenu] = useState(true);

  // Handle screen resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !collapsed) {
        setCollapsed(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [collapsed]);

  // redux
  const themeValue = useSelector((state) => state.preference.theme);
  const language = useSelector((state) => state.preference.language);
  const notesIndex = useSelector((state) => state.notesIndex.data) || [];
  const currentMeta = useSelector((state) => state.currentNote.meta);
  const outline = useSelector((state) => state.currentNote.outline);

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

        <Layout style={{ padding: isMobile ? "0 12px 12px" : "0 24px 24px" }}>
          {/* breadcrumb and markdown renderer */}
          <Breadcrumb items={breadcrumbItems} style={{ margin: isMobile ? "12px 0" : "16px 0" }} />
          <Layout>
            <Content
              style={{
                flex: 1,
                padding: isMobile ? 12 : 24,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </Content>
            {/* Hide outline sider on mobile */}
            {!isMobile && (
              <Sider
                width={350}
                style={{ background: "transparent", padding: "0 24px" }}
              >
                <OutlineSider outline={outline} />
              </Sider>
            )}
          </Layout>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default NoteLayout;
