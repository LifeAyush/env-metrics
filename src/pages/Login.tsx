import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authService, type LoginRequest } from "../services/auth";
import { useToastService, useApiErrorHandler } from "../components/Toasts";
import styles from "../styles/Login.module.scss";

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const toastService = useToastService();
  const apiErrorHandler = useApiErrorHandler();

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authService.login(values);
      login(response.access_token);
      toastService.success("Login successful!");
      navigate("/");
    } catch (error: unknown) {
      apiErrorHandler.handle(error, "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const testToast = () => {
    toastService.success("Test success toast!");
    toastService.error("Test error toast!");
    toastService.warning("Test warning toast!");
    toastService.info("Test info toast!");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>
        
        {/* Test button for toasts */}
        <Button onClick={testToast} style={{ marginBottom: 16 }}>
          Test Toasts
        </Button>
        
        <Form
          form={form}
          name="login_form"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="email"
            className={styles.formItem}
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="test@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            className={styles.formItem}
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              className={styles.loginBtn}
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        <div className={styles.linkText}>
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
