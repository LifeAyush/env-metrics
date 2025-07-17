import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Signup.module.scss';
import axios from 'axios'

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, values);
      message.success('Signup successful! Redirecting to login...');
      navigate('/login');
    } catch (error: any) {
      message.error(
        error.response?.data?.error || 'Signup failed. Please try again.'
      );
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
