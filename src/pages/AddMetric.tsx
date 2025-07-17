import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Button, Card, Typography } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { metricsService, type CreateMetricRequest } from '../services/metrics';
import { useSuccessHandler, useApiErrorHandler, useToastService } from '../components/Toasts';
import styles from '../styles/AddMetric.module.scss';

const { Title } = Typography;

const AddMetric: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toastService = useToastService();
  const successHandler = useSuccessHandler();
  const apiErrorHandler = useApiErrorHandler();

  const onFinish = async (values: {
    name: string;
    value: number;
    unit: string;
    category: string;
    date: dayjs.Dayjs;
  }) => {
    setLoading(true);
    try {
      const metricData: CreateMetricRequest = {
        name: values.name,
        value: values.value,
        unit: values.unit,
        category: values.category,
        date: values.date.toISOString(),
      };

      await metricsService.createMetric(metricData);
      successHandler.created('Metric');
      navigate('/');
    } catch (error) {
      apiErrorHandler.handle(error, 'Failed to create metric');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          className={styles.backButton}
        >
          Back to Dashboard
        </Button>
      </div>

      <Card className={styles.card}>
        <Title level={2} className={styles.title}>
          Add New Metric
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            date: dayjs(),
            unit: 'kg',
            category: 'Energy',
          }}
          className={styles.form}
        >
          <Form.Item
            name="name"
            label="Metric Name"
            rules={[
              { required: true, message: 'Please enter metric name' },
              { min: 2, message: 'Name must be at least 2 characters' },
              { max: 100, message: 'Name must be less than 100 characters' },
            ]}
          >
            <Input placeholder="Enter metric name" />
          </Form.Item>

          <Form.Item
            name="value"
            label="Value"
            rules={[
              { required: true, message: 'Please enter value' },
              { type: 'number', min: 0, message: 'Value must be positive' },
            ]}
          >
            <InputNumber
              placeholder="Enter value"
              style={{ width: '100%' }}
              precision={2}
            />
          </Form.Item>

          <Form.Item
            name="unit"
            label="Unit"
            rules={[{ required: true, message: 'Please select unit' }]}
          >
            <Select placeholder="Select unit">
              <Select.Option value="kg">kg</Select.Option>
              <Select.Option value="g">g</Select.Option>
              <Select.Option value="l">L</Select.Option>
              <Select.Option value="ml">mL</Select.Option>
              <Select.Option value="kwh">kWh</Select.Option>
              <Select.Option value="wh">Wh</Select.Option>
              <Select.Option value="m3">m³</Select.Option>
              <Select.Option value="pieces">Pieces</Select.Option>
              <Select.Option value="count">Count</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select placeholder="Select category">
              <Select.Option value="Energy">Energy</Select.Option>
              <Select.Option value="Water">Water</Select.Option>
              <Select.Option value="Waste">Waste</Select.Option>
              <Select.Option value="Transport">Transport</Select.Option>
              <Select.Option value="Materials">Materials</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please select date' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              placeholder="Select date"
            />
          </Form.Item>

          <Form.Item className={styles.formActions}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              size="large"
              className={styles.submitButton}
            >
              Create Metric
            </Button>
            <Button
              onClick={handleBack}
              size="large"
              className={styles.cancelButton}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddMetric;