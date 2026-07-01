import { useState } from "react";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAdminAuth } from "../auth/AdminAuthProvider";

const { Paragraph, Title } = Typography;

export default function AdminLoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, session, login } = useAdminAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!loading && session?.authenticated) {
    const nextPath = typeof location.state?.from === "object" && location.state?.from?.pathname
      ? `${location.state.from.pathname}${location.state.from.search || ""}${location.state.from.hash || ""}`
      : "/admin";
    return <Navigate to={nextPath} replace />;
  }

  const handleFinish = async (values) => {
    setSubmitting(true);
    setError(null);

    try {
      await login(values.username, values.password);
      const nextPath =
        typeof location.state?.from === "object" && location.state?.from?.pathname
          ? `${location.state.from.pathname}${location.state.from.search || ""}${location.state.from.hash || ""}`
          : "/admin";
      navigate(nextPath, { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Sign-in failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <Card className="admin-login__card">
        <Typography>
          <div className="admin-login__eyebrow">Notes System Admin</div>
          <Title level={2}>Sign in to the admin console</Title>
          <Paragraph type="secondary">
            Authentication uses the backend cookie session. No token is stored in the frontend.
          </Paragraph>
        </Typography>

        {error ? <Alert type="error" showIcon message={error} /> : null}

        <Form layout="vertical" onFinish={handleFinish} initialValues={{ username: "admin" }}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter your username." }]}
          >
            <Input prefix={<UserOutlined />} autoComplete="username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password." }]}
          >
            <Input.Password prefix={<LockOutlined />} autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting} block>
            Sign in
          </Button>
        </Form>
      </Card>
    </div>
  );
}
