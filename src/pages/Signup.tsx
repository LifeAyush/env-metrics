import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { authService, type SignupRequest } from '../services/auth';
import { useToastService, useApiErrorHandler } from '../components/Toasts';
import styles from '../styles/Signup.module.scss';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toastService = useToastService();
  const apiErrorHandler = useApiErrorHandler();

  const onFinish = async (values: SignupRequest) => {
    setLoading(true);
    try {
      await authService.signup(values);
      toastService.success('Signup successful! Redirecting to login...');
      navigate('/login');
    } catch (error: unknown) {
      apiErrorHandler.handle(error, 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign Up</h2>
        <Form name="signup" onFinish={onFinish} layout="vertical">

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
            className={styles.formItem}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            className={styles.formItem}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item className={styles.formItem}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.signupBtn}
              loading={loading}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.linkText}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
