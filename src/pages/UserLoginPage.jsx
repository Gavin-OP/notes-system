import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Checkbox, Divider, Form, Input, Space, Tabs, Tag, Typography, message } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { getCurrentUser, loginUser, registerUser } from "../common/api/user";

import "./UserLoginPage.css";

const { Title, Text, Paragraph } = Typography;

function UserLoginPage() {
  const navigate = useNavigate();
  const [tabKey, setTabKey] = useState("login");
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    let mounted = true;
    async function checkSession() {
      try {
        await getCurrentUser();
        if (mounted) navigate("/user/profile", { replace: true });
      } catch {
        // User not logged in, keep login screen.
      }
    }
    checkSession();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleLogin = async (values) => {
    setErrorText("");
    setLoginLoading(true);
    try {
      await loginUser({
        email: values.email,
        password: values.password,
      });
      message.success("Login successful.");
      navigate("/user/profile");
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
        displayName: values.displayName,
        display_name: values.displayName,
      });
      message.success("Account created successfully.");
      navigate("/user/profile");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Registration failed.");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="user-auth-page">
      <Card className="user-auth-page__card" bordered={false}>
        <Space direction="vertical" size={4} className="user-auth-page__title-block">
          <Tag color="blue">Learner Portal</Tag>
          <Title level={3}>Welcome to Notes System</Title>
          <Text type="secondary">
            Sign in to sync learning progress, assistant chat history, and personal study notes.
          </Text>
        </Space>

        <Tabs
          activeKey={tabKey}
          onChange={setTabKey}
          items={[
            {
              key: "login",
              label: "Login",
              children: (
                <Form layout="vertical" onFinish={handleLogin} requiredMark={false}>
                  <Form.Item label="Email" name="email" rules={[{ required: true }]}>
                    <Input prefix={<MailOutlined />} placeholder="name@example.com" />
                  </Form.Item>
                  <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Enter password" />
                  </Form.Item>
                  <div className="user-auth-page__row">
                    <Checkbox>Remember me</Checkbox>
                    <Button type="link" size="small">
                      Forgot password?
                    </Button>
                  </div>
                  <Button type="primary" htmlType="submit" block loading={loginLoading}>
                    Login
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
                    <Input prefix={<UserOutlined />} placeholder="Your name" />
                  </Form.Item>
                  <Form.Item label="Email" name="email" rules={[{ required: true }]}>
                    <Input prefix={<MailOutlined />} placeholder="name@example.com" />
                  </Form.Item>
                  <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Create password" />
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
                      prefix={<LockOutlined />}
                      placeholder="Confirm password"
                    />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" block loading={registerLoading}>
                    Create account
                  </Button>
                </Form>
              ),
            },
          ]}
        />
        {errorText ? <Alert type="error" showIcon message={errorText} className="user-auth-page__error" /> : null}

        <Divider />
        <Paragraph type="secondary" className="user-auth-page__footer">
          Use the demo account `cindy@example.com / demo12345` if your backend seeded users.
        </Paragraph>
      </Card>
    </div>
  );
}

export default UserLoginPage;
