import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Spin } from "antd";

import { useAdminAuth } from "./AdminAuthProvider";

export default function AdminRouteGuard() {
  const location = useLocation();
  const { loading, session } = useAdminAuth();

  if (loading) {
    return (
      <div className="admin-page-state admin-page-state--fullscreen">
        <Spin size="large" />
      </div>
    );
  }

  if (!session?.authenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
