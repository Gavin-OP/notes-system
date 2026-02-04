import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

import { Layout, Menu, Breadcrumb, Button, theme, Row, Col } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FolderOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

import NoteHeader from "../components/NoteHeader";
import OutlineSider from "../components/OutlineSider";
import FloatingOutlineButton from "../components/FloatingOutlineButton";

import { buildMenuItems } from "../../utils/notesIndexUtils";
import { setTheme, setLanguage } from "../../redux/preferenceSlice";

import "./NoteLayout.css";

const { Header, Sider, Content } = Layout;

// convert icon type to icon
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

// add icons to menu items recursively
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

  // redux state
  const themeValue = useSelector((state) => state.preference.theme);
  const language = useSelector((state) => state.preference.language);
  const isMobile = useSelector((state) => state.preference.isMobile);
  const notesIndex = useSelector((state) => state.notesIndex.data) || [];
  const currentMeta = useSelector((state) => state.currentNote.meta);
  const outline = useSelector((state) => state.currentNote.outline);

  // local state
  const [collapsed, setCollapsed] = useState(isMobile);
  const [showMenu, setShowMenu] = useState(true);
  const [outlineCollapsed, setOutlineCollapsed] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(true);

  // track previous isMobile value
  const prevIsMobileRef = useRef(isMobile);

  // auto collapse menu when switching from desktop to mobile
  useEffect(() => {
    if (isMobile && !prevIsMobileRef.current) {
      // just switched to mobile, collapse the menu
      setCollapsed(true);
    }
    prevIsMobileRef.current = isMobile;
  }, [isMobile]);

  // Scroll listener for floating button (mobile only)
  useEffect(() => {
    if (!isMobile) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // hide button when scrolling down, show when scrolling up
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setShowFloatingButton(false);
          } else {
            setShowFloatingButton(true);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // menu contents & icons
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
  const handleOutlineCollapse = () => setOutlineCollapsed(!outlineCollapsed);

  return (
    <Layout
      className="note-layout"
      style={{
        "--header-bg": colorBgContainer,
        "--sider-bg": colorBgContainer,
        "--content-bg": colorBgContainer,
        "--content-radius": borderRadiusLG,
      }}
    >
      {/* header */}
      <Header
        className={`note-layout__header ${isMobile ? "note-layout__header--mobile" : ""}`}
      >
        {/* menu collapse button */}
        <Row align="middle" className="note-layout__header-row">
          <Col>
            <Button
              type="text"
              className={`note-layout__menu-button ${isMobile ? "note-layout__menu-button--mobile" : ""}`}
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

      <Layout className="note-layout__main">
        {/* backdrop overlay for mobile menu */}
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
          className={`note-layout__sider ${isMobile ? "note-layout__sider--mobile" : ""}`}
          collapsible
          collapsed={collapsed}
          trigger={null}
        >
          {showMenu && (
            <Menu
              mode="inline"
              className={`note-layout__menu ${isMobile ? "note-layout__menu--mobile" : ""}`}
              items={menuItems}
              onClick={({ key }) => {
                handleNoteSelect(key);
                // auto-close menu on mobile after selection
                if (isMobile) {
                  setCollapsed(true);
                }
              }}
            />
          )}
        </Sider>

        <Layout
          className={`note-layout__content-wrapper ${isMobile ? "note-layout__content-wrapper--mobile" : ""}`}
        >
          {/* breadcrumb and markdown renderer */}
          <Breadcrumb
            items={breadcrumbItems}
            className={`note-layout__breadcrumb ${isMobile ? "note-layout__breadcrumb--mobile" : ""}`}
          />
          <Layout>
            <Content
              className={`note-layout__content ${isMobile ? "note-layout__content--mobile" : ""}`}
            >
              <Outlet />
            </Content>
            {/* hide outline sider on mobile */}
            {!isMobile && (
              <Sider
                width={350}
                collapsedWidth={48}
                className={`note-layout__outline-sider ${outlineCollapsed ? "note-layout__outline-sider--collapsed" : ""}`}
                collapsible
                collapsed={outlineCollapsed}
                trigger={null}
              >
                <OutlineSider
                  outline={outline}
                  collapsed={outlineCollapsed}
                  onCollapse={handleOutlineCollapse}
                />
              </Sider>
            )}
          </Layout>
        </Layout>
      </Layout>

      {/* floating outline button for mobile */}
      {isMobile && (
        <FloatingOutlineButton outline={outline} visible={showFloatingButton} />
      )}
    </Layout>
  );
};

export default NoteLayout;
