import React, { useEffect, useState } from "react";
import {
  Table,
  Drawer,
  Typography,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { SorterResult, FilterValue } from "antd/es/table/interface";
import dayjs from "dayjs";
import { metricsService, type Metric, type CreateMetricRequest } from "../services/metrics";
import { useSuccessHandler, useApiErrorHandler, useToastService } from "../components/Toasts";
import { useMetricsUrlState } from "../hooks/useUrlState";
import styles from "../styles/MetricsTable.module.scss";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";



const dummyMetrics = Array.from({ length: 50 }, (_, i) => ({
  id: `metric-${i + 1}`,
  name: `Metric ${i + 1}`,
  value: Math.floor(Math.random() * 1000),
  unit: "kg",
  category: ["Energy", "Water", "Waste"][i % 3],
  date: new Date(Date.now() - i * 86400000).toISOString(),
}));

interface MetricsTableProps {
  addModalVisible: boolean;
  onCloseAddModal: () => void;
}

const MetricsTable: React.FC<MetricsTableProps> = ({
  addModalVisible,
  onCloseAddModal,
}) => {
  const [data, setData] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const [editingMetric, setEditingMetric] = useState<Metric | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [metricToDelete, setMetricToDelete] = useState<Metric | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [form] = Form.useForm();
  const toastService = useToastService();
  const successHandler = useSuccessHandler();
  const apiErrorHandler = useApiErrorHandler();
  const isFetchingRef = React.useRef(false);

  // URL state management
  const [urlState, setUrlState] = useMetricsUrlState();

  const fetchMetrics = async (params = urlState) => {
    // Prevent multiple simultaneous requests
    if (isFetchingRef.current) {
      return;
    }
    
    isFetchingRef.current = true;
    setLoading(true);
    const startTime = Date.now();
    const minLoadingTime = 300; // Minimum 300ms loading time
    
    try {
      const response = await metricsService.getMetrics({
        page: params.page,
        limit: params.limit,
        sort_by: params.sort_by,
        order: params.order,
        category: params.category,
        search: params.search,
      });
      
      // Calculate remaining time for minimum loading duration
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      // Wait for minimum loading time before updating data
      setTimeout(() => {
        setData(response.data);
        setTotal(response.total);
        setLoading(false);
        isFetchingRef.current = false;
        // Only show success toast for subsequent fetches (not initial load)
        if (!isInitialLoad && response.data.length > 0) {
          toastService.success(`Successfully loaded ${response.data.length} metrics`);
        }
        setIsInitialLoad(false);
      }, remainingTime);
      
    } catch (error) {
      apiErrorHandler.handle(error, 'Failed to fetch metrics');
      
      // Show error message and keep existing data or show empty state
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      setTimeout(() => {
        // Don't fall back to dummy data, show empty state instead
        setData([]);
        setTotal(0);
        setLoading(false);
        isFetchingRef.current = false;
      }, remainingTime);
    }
  };

  useEffect(() => {
    fetchMetrics(urlState);
  }, [urlState.page, urlState.limit, urlState.sort_by, urlState.order, urlState.category, urlState.search]);

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    newFilters: Record<string, FilterValue | null>,
    newSorter: SorterResult<Metric> | SorterResult<Metric>[]
  ) => {
    setUrlState(prev => {
      // Always keep API limit at 50, don't allow changes
      const newLimit = 50;
      
      return {
        ...prev,
        page: newPagination.current || 1,
        limit: newLimit,
        category: newFilters.category ? (Array.isArray(newFilters.category) ? newFilters.category[0] : newFilters.category) as string : undefined,
        sort_by: !Array.isArray(newSorter) ? newSorter.field as string : undefined,
        order: !Array.isArray(newSorter) && newSorter.order ? 
          (newSorter.order === 'ascend' ? 'asc' : 'desc') : undefined,
      };
    });
  };

  const openEditModal = (metric: Metric) => {
    setEditingMetric(metric);
    form.setFieldsValue({
      ...metric,
      date: dayjs(metric.date),
    });
    setEditModalVisible(true);
  };

  const handleAddMetricSubmit = async () => {
    try {
      const values = await form.validateFields();
      const newMetric: CreateMetricRequest = {
        name: values.name,
        value: values.value,
        unit: values.unit,
        category: values.category,
        date: values.date.toISOString(),
      };

      if (editingMetric) {
        await metricsService.updateMetric({ ...newMetric, id: editingMetric.id });
        successHandler.updated('Metric');
      } else {
        await metricsService.createMetric(newMetric);
        successHandler.created('Metric');
      }

      form.resetFields();
      onCloseAddModal();
      setEditModalVisible(false);
      setEditingMetric(null);
      fetchMetrics();
    } catch (error) {
      apiErrorHandler.handle(error, 'Failed to save metric');
    }
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setEditingMetric(null);
    form.resetFields();
  };


  const handleDelete = async (metric: Metric) => {
    setMetricToDelete(metric);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!metricToDelete) return;

    setDeleteLoading(true);
    try {
      await metricsService.deleteMetric(metricToDelete.id);
      successHandler.deleted('Metric');
      fetchMetrics();
      setDeleteModalVisible(false);
      setMetricToDelete(null);
    } catch (error) {
      apiErrorHandler.handle(error, 'Failed to delete metric');
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setMetricToDelete(null);
    setDeleteLoading(false);
  };

  const handleRowClick = (record: Metric) => {
    setSelectedMetric(record);
    setDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setSelectedMetric(null);
  };

  const columns: ColumnsType<Metric> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      sorter: true,
      render: (_, record) => `${record.value} ${record.unit}`,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: [
        { text: "Energy", value: "Energy" },
        { text: "Water", value: "Water" },
        { text: "Waste", value: "Waste" },
      ],
      filterMultiple: true,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: true,
      render: (date: string) => dayjs(date).format("DD MMM YYYY"),
    },
    {
      title: "Action",
      key: "action",
      width: "200px",
      render: (_, record) => (
        <div className={styles.actions}>
          <Typography.Link onClick={() => openEditModal(record)}>
            Update
          </Typography.Link>
          <span className={styles.divider}>|</span>
          <Typography.Link type="danger" onClick={() => handleDelete(record)}>
            Delete
          </Typography.Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <Modal
        open={addModalVisible || editModalVisible}
        onCancel={editingMetric ? handleCloseEditModal : onCloseAddModal}
        onOk={handleAddMetricSubmit}
        title={editingMetric ? "Edit Metric" : "Add Metric"}
        okText={editingMetric ? "Update" : "Add"}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddMetricSubmit}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="value" label="Value" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { label: "Energy", value: "Energy" },
                { label: "Water", value: "Water" },
                { label: "Waste", value: "Waste" },
              ]}
            />
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalVisible}
        onCancel={cancelDelete}
        onOk={confirmDelete}
        title="Confirm Delete"
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
        confirmLoading={deleteLoading}
      >
        <p>
          Are you sure you want to delete "{metricToDelete?.name}"? This action cannot be undone.
        </p>
      </Modal>

      <div className={styles.tableWrapper}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={{
            spinning: loading,
            tip: 'Loading metrics...',
            indicator: <div style={{ fontSize: '16px' }}>⏳</div>
          }}
          pagination={{
            current: urlState.page,
            pageSize: 10,
            total,
            showTotal: (total) => `Total ${total} items`,
            showSizeChanger: false,
            showQuickJumper: false,
          }}
          onChange={handleTableChange}
          onRow={(record) => ({
            onClick: (e) => {
              const target = e.target as HTMLElement;
              // Prevent drawer open if clicking an action link
              if (
                target.closest(".actionLink") ||
                target.closest(".ant-typography") // fallback for general Typography.Link
              ) {
                return;
              }
              handleRowClick(record);
            },
          })}
        />

        <Drawer
          title={selectedMetric?.name}
          placement="right"
          onClose={handleDrawerClose}
          open={drawerVisible}
          width={400}
        >
          {selectedMetric && (
            <div className={styles.drawerContent}>
              <Typography.Text className={styles.metricLabel}>
                Category:
              </Typography.Text>
              <p>{selectedMetric.category}</p>

              <Typography.Text className={styles.metricLabel}>
                Value:
              </Typography.Text>
              <p>
                {selectedMetric.value} {selectedMetric.unit}
              </p>

              <Typography.Text className={styles.metricLabel}>
                Date:
              </Typography.Text>
              <p>{dayjs(selectedMetric.date).format("DD MMM YYYY")}</p>

              <Typography.Text className={styles.metricLabel}>
                Trend (dummy):
              </Typography.Text>
              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={[...Array(10)].map((_, i) => ({
                      date: dayjs().subtract(i, "day").format("DD MMM"),
                      value:
                        selectedMetric.value +
                        Math.floor(Math.random() * 10 - 5),
                    }))}
                  >
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#20a569" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </>
  );
};

export default MetricsTable;
