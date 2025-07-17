import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/Login.module.scss";
import axios from "axios";

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const onFinish = async (values: any) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        values
      );
      login(response.data.access_token);
      message.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Login failed";
      message.error(errorMsg);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>
        <Form
          form={form}
          name="login_form"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Username"
            className={styles.formItem}
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
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
