import { useState, useEffect } from "react";
import { Layout, Menu, Breadcrumb, Button, theme, Row, Col } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FolderOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setTheme, setLanguage } from "../../redux/preferenceSlice";
import NoteHeader from "../components/NoteHeader";
import OutlineSider from "../components/OutlineSider";
import { buildMenuItems } from "../../utils/notesIndexUtils";
import "./NoteLayout.css";

const { Header, Sider, Content } = Layout;

// Helper function to convert iconType to actual icon component
const getIcon = (iconType) => {
  switch (iconType) {
    case "info":
      return <InfoCircleOutlined />;
    case "folder":
      return <FolderOutlined />;
    case "file":
      return <FileTextOutlined />;
    default:
      return null;
  }
};

// Add icons to menu items recursively
const addIconsToMenuItems = (items) => {
  return items.map((item) => ({
    ...item,
    icon: getIcon(item.iconType),
    children: item.children ? addIconsToMenuItems(item.children) : undefined,
  }));
};

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

  // menu - build items and add icons
  const menuItems = addIconsToMenuItems(buildMenuItems(notesIndex));

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
    <Layout 
      className="note-layout"
      style={{
        '--header-bg': colorBgContainer,
        '--sider-bg': colorBgContainer,
        '--content-bg': colorBgContainer,
        '--content-radius': borderRadiusLG,
      }}
    >
      {/* header */}
      <Header
        className={`note-layout__header ${isMobile ? 'note-layout__header--mobile' : ''}`}
      >
        {/* menu collapse button */}
        <Row align="middle" className="note-layout__header-row">
          <Col>
            <Button
              type="text"
              className={`note-layout__menu-button ${isMobile ? 'note-layout__menu-button--mobile' : ''}`}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => {
                if (!collapsed) setShowMenu(false);
                else setShowMenu(true);
                setCollapsed(!collapsed);
              }}
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

      <Layout className="note-layout__body">
        {/* Backdrop overlay for mobile menu */}
        {isMobile && !collapsed && (
          <div
            className="note-layout__backdrop"
            onClick={() => setCollapsed(true)}
          />
        )}

        {/* menu */}
        <Sider
          width={isMobile ? "100%" : 350}
          collapsedWidth={0}
          className={`note-layout__sider ${isMobile ? 'note-layout__sider--mobile' : ''}`}
          collapsible
          collapsed={collapsed}
          trigger={null}
        >
          {showMenu && (
            <Menu
              mode="inline"
              className={`note-layout__menu ${isMobile ? 'note-layout__menu--mobile' : ''}`}
              items={menuItems}
              onClick={({ key }) => {
                handleNoteSelect(key);
                // Auto-close menu on mobile after selection
                if (isMobile) {
                  setCollapsed(true);
                }
              }}
            />
          )}
        </Sider>

        <Layout className={`note-layout__content-wrapper ${isMobile ? 'note-layout__content-wrapper--mobile' : ''}`}>
          {/* breadcrumb and markdown renderer */}
          <Breadcrumb 
            items={breadcrumbItems} 
            className={`note-layout__breadcrumb ${isMobile ? 'note-layout__breadcrumb--mobile' : ''}`}
          />
          <Layout>
            <Content
              className={`note-layout__content ${isMobile ? 'note-layout__content--mobile' : ''}`}
            >
              <Outlet />
            </Content>
            {/* Hide outline sider on mobile */}
            {!isMobile && (
              <Sider
                width={350}
                className="note-layout__outline-sider"
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
