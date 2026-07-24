import { useEffect, useMemo, useState } from "react";
import { Layout, Menu, Button, Typography, Space, Grid } from "antd";
import {
  AppstoreOutlined,
  DatabaseOutlined,
  ForkOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAdminAuth } from "../auth/AdminAuthProvider";

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

const menuItems = [
  {
    key: "/admin",
    icon: <AppstoreOutlined />,
    label: "Dashboard",
  },
  {
    key: "/admin/content",
    icon: <DatabaseOutlined />,
    label: "Content",
  },
  {
    key: "/admin/community",
    icon: <ForkOutlined />,
    label: "Community",
  },
  {
    key: "/admin/system",
    icon: <SafetyCertificateOutlined />,
    label: "System",
  },
];

export default function AdminLayout() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg;
  const location = useLocation();
  const navigate = useNavigate();
  const { session, logout } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(isMobile);

  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  const selectedKeys = useMemo(() => {
    if (location.pathname.startsWith("/admin/system")) return ["/admin/system"];
    if (location.pathname.startsWith("/admin/community")) return ["/admin/community"];
    if (location.pathname.startsWith("/admin/content")) return ["/admin/content"];
    return ["/admin"];
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <Layout className="admin-layout">
      <Sider
        className="admin-layout__sider"
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={260}
      >
        <div className="admin-layout__brand">
          <Text className="admin-layout__brand-mark">Notes System</Text>
          {!collapsed ? <Title level={4}>Admin Console</Title> : null}
          {!collapsed ? (
            <Text type="secondary">Signed in as {session?.username || "-"}</Text>
          ) : null}
        </div>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems}
          onClick={({ key }) => {
            navigate(key);
            if (isMobile) {
              setCollapsed(true);
            }
          }}
        />
        <div className="admin-layout__logout">
          <Button icon={<LogoutOutlined />} onClick={handleLogout} block>
            {!collapsed ? "Sign out" : ""}
          </Button>
        </div>
      </Sider>
      <Layout>
        <Header className="admin-layout__header">
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((prev) => !prev)}
            />
            <div>
              <Text className="admin-layout__header-title">Admin</Text>
              <div className="admin-layout__header-subtitle">{session?.username}</div>
            </div>
          </Space>
        </Header>
        <Content className="admin-layout__content">
          <div className="admin-layout__content-inner">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
