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
  const [narrationState, setNarrationState] = useState("idle");
  const [narrationAudioUrls, setNarrationAudioUrls] = useState([]);
  const [currentNarrationChunkIndex, setCurrentNarrationChunkIndex] = useState(0);
  const [isNarrationPlaying, setIsNarrationPlaying] = useState(false);
  const narrationAudioRef = useRef(null);
  const narrationAudioUrlsRef = useRef([]);
  const narrationChunkIndexRef = useRef(0);

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

  useEffect(() => {
    narrationAudioUrlsRef.current = narrationAudioUrls;
  }, [narrationAudioUrls]);

  useEffect(() => {
    narrationChunkIndexRef.current = currentNarrationChunkIndex;
  }, [currentNarrationChunkIndex]);

  useEffect(() => {
    const audio = narrationAudioRef.current;
    if (!audio) return undefined;
    const onPlay = () => setIsNarrationPlaying(true);
    const onPause = () => setIsNarrationPlaying(false);
    const onEnded = async () => {
      const urls = narrationAudioUrlsRef.current;
      const idx = narrationChunkIndexRef.current;
      const hasNext = idx + 1 < urls.length;
      if (!hasNext) {
        setIsNarrationPlaying(false);
        return;
      }
      const nextIdx = idx + 1;
      setCurrentNarrationChunkIndex(nextIdx);
      requestAnimationFrame(() => {
        const player = narrationAudioRef.current;
        if (!player) return;
        player.play().catch((error) => {
          console.error("Narration next chunk playback failed:", error);
          setNarrationState("error");
        });
      });
    };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    async function resolveNarration() {
      const noteKey =
        currentMeta && currentMeta.name
          ? currentMeta.directory === "."
            ? currentMeta.name
            : `${currentMeta.directory}/${currentMeta.name}`
          : "";

      const audio = narrationAudioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setIsNarrationPlaying(false);
      setNarrationAudioUrls([]);
      setCurrentNarrationChunkIndex(0);

      if (!noteKey) {
        setNarrationState("idle");
        return;
      }
      setNarrationState("loading");
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}audio/narration-index.json`, {
          cache: "no-store",
        });
        if (!res.ok) {
          setNarrationState("no_audio");
          return;
        }
        const indexData = await res.json();
        const hit = indexData?.by_note_key?.[noteKey];
        const relPaths = Array.isArray(hit?.audio_rel_paths)
          ? hit.audio_rel_paths
          : hit?.audio_rel_path
            ? [hit.audio_rel_path]
            : [];
        if (relPaths.length === 0) {
          setNarrationState("no_audio");
          return;
        }
        setNarrationAudioUrls(
          relPaths.map((relPath) => {
            const cleanRelPath = String(relPath).replace(/^\/+/, "");
            return `${import.meta.env.BASE_URL}${cleanRelPath}`;
          }),
        );
        setCurrentNarrationChunkIndex(0);
        setNarrationState("ready");
      } catch (error) {
        console.error("Failed to load narration index:", error);
        setNarrationState("error");
      }
    }
    resolveNarration();
  }, [currentMeta]);

  const handleToggleNarration = async () => {
    if (narrationState !== "ready" || !narrationAudioRef.current) return;
    const audio = narrationAudioRef.current;
    try {
      if (audio.paused) {
        if (currentNarrationChunkIndex >= narrationAudioUrls.length) {
          setCurrentNarrationChunkIndex(0);
        }
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      console.error("Narration playback failed:", error);
      setNarrationState("error");
    }
  };

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
              narrationState={narrationState}
              isNarrationPlaying={isNarrationPlaying}
              onToggleNarration={handleToggleNarration}
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
      <audio
        ref={narrationAudioRef}
        src={narrationAudioUrls[currentNarrationChunkIndex] ?? ""}
        preload="none"
      />
    </Layout>
  );
};

export default NoteLayout;
