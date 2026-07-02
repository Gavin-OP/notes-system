import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Divider, Form, Input, Space, Tabs, Tag, Typography, message } from "antd";
import { ArrowRightOutlined, BookOutlined, CheckCircleOutlined, LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { getCurrentUser, loginUser, registerUser } from "../api/user";

import "./UserLoginPage.css";

const { Title, Text, Paragraph } = Typography;

function UserLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabKey, setTabKey] = useState("login");
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const redirectTo =
    typeof location.state?.from === "string" &&
    location.state.from.startsWith("/") &&
    location.state.from !== "/user/login"
      ? location.state.from
      : "/user/profile";

  useEffect(() => {
    let mounted = true;
    async function checkSession() {
      try {
        await getCurrentUser();
        if (mounted) navigate(redirectTo, { replace: true });
      } catch {
        // User not logged in, keep login screen.
      }
    }
    checkSession();
    return () => {
      mounted = false;
    };
  }, [navigate, redirectTo]);

  const handleLogin = async (values) => {
    setErrorText("");
    setLoginLoading(true);
    try {
      await loginUser({
        email: values.email,
        password: values.password,
      });
      message.success("Login successful.");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (values) => {
    setErrorText("");
    setRegisterLoading(true);
    try {
      await registerUser({
        email: values.email,
        password: values.password,
        confirm_password: values.confirmPassword,
        displayName: values.displayName,
        display_name: values.displayName,
      });
      message.success("Account created successfully.");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Registration failed.");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="user-auth-page">
      <div className="user-auth-page__shell">
        <section className="user-auth-page__intro" aria-label="Notes System account benefits">
          <button type="button" className="user-auth-page__brand" onClick={() => navigate("/")}>
            <span className="user-auth-page__logo">NS</span>
            <span>Notes System</span>
          </button>
          <Tag className="user-auth-page__tag" color="blue">Learner Portal</Tag>
          <Title level={2} className="user-auth-page__headline">
            Save your learning progress when you are ready.
          </Title>
          <Text className="user-auth-page__subhead">
            You can browse the notes without an account. Sign in when you want your completed notes,
            study path, saved quotes, and profile to follow you across devices.
          </Text>
          <div className="user-auth-page__benefits">
            <span><CheckCircleOutlined /> Sync completed notes</span>
            <span><CheckCircleOutlined /> Keep personal study notes</span>
            <span><CheckCircleOutlined /> Resume from your profile</span>
          </div>
          <Button
            className="user-auth-page__browse-btn"
            icon={<BookOutlined />}
            onClick={() => navigate("/")}
          >
            Browse without signing in
          </Button>
        </section>

        <Card className="user-auth-page__card" bordered={false}>
          <Space direction="vertical" size={4} className="user-auth-page__title-block">
            <Title level={3}>Welcome</Title>
            <Text type="secondary">
              Sign in or create an account to turn browsing into a saved learning record.
            </Text>
          </Space>

          <Tabs
            activeKey={tabKey}
            onChange={(nextKey) => {
              setErrorText("");
              setTabKey(nextKey);
            }}
            items={[
              {
                key: "login",
                label: "Login",
                children: (
                  <Form layout="vertical" onFinish={handleLogin} requiredMark={false}>
                    <Form.Item label="Email" name="email" rules={[{ required: true }]}>
                      <Input size="large" prefix={<MailOutlined />} placeholder="name@example.com" />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                      <Input.Password size="large" prefix={<LockOutlined />} placeholder="Enter password" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block size="large" loading={loginLoading}>
                      Login <ArrowRightOutlined />
                    </Button>
                  </Form>
                ),
              },
              {
                key: "register",
                label: "Create Account",
                children: (
                  <Form layout="vertical" onFinish={handleRegister} requiredMark={false}>
                    <Form.Item label="Display name" name="displayName" rules={[{ required: true }]}>
                      <Input size="large" prefix={<UserOutlined />} placeholder="Your name" />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true }]}>
                      <Input size="large" prefix={<MailOutlined />} placeholder="name@example.com" />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                      <Input.Password size="large" prefix={<LockOutlined />} placeholder="Create password" />
                    </Form.Item>
                    <Form.Item
                      label="Confirm password"
                      name="confirmPassword"
                      dependencies={["password"]}
                      rules={[
                        { required: true },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error("Passwords do not match."));
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        size="large"
                        prefix={<LockOutlined />}
                        placeholder="Confirm password"
                      />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block size="large" loading={registerLoading}>
                      Create account <ArrowRightOutlined />
                    </Button>
                  </Form>
                ),
              },
            ]}
          />
          {errorText ? <Alert type="error" showIcon message={errorText} className="user-auth-page__error" /> : null}

          <Divider />
          <Paragraph type="secondary" className="user-auth-page__footer">
            Testing locally? Use `cindy@example.com / demo12345` if the backend seeded demo users.
          </Paragraph>
        </Card>
      </div>
    </div>
  );
}

export default UserLoginPage;
