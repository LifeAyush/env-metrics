import React, { useEffect, useState } from "react";
import { Table, Drawer, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { SorterResult, FilterValue } from "antd/es/table/interface";
import axios from "axios";
import dayjs from "dayjs";
import styles from "../styles/MetricsTable.module.scss";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  category: string;
  date: string;
}

interface ApiResponse {
  metrics: Metric[];
  total: number;
}

const dummyMetrics = Array.from({ length: 50 }, (_, i) => ({
  id: `metric-${i + 1}`,
  name: `Metric ${i + 1}`,
  value: Math.floor(Math.random() * 1000),
  unit: "kg",
  category: ["Energy", "Water", "Waste"][i % 3],
  date: new Date(Date.now() - i * 86400000).toISOString(),
}));

const MetricsTable: React.FC = () => {
  const [data, setData] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  const [sorter, setSorter] = useState<{
    field?: string;
    order?: "ascend" | "descend";
  }>({});

  const [filters, setFilters] = useState<{ category?: string[] }>({});

  const handleUpdate = (metric: Metric) => {
  console.log("Update clicked for:", metric);
  // Example: Open the drawer with form pre-filled for editing
  setSelectedMetric(metric);
  setDrawerVisible(true);
};

const handleDelete = async (metric: Metric) => {
  const confirmed = window.confirm(`Are you sure you want to delete "${metric.name}"?`);
  if (!confirmed) return;

  try {
    // const token = localStorage.getItem("token");
    // await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/metrics/${metric.id}`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });

    console.log("Deleted:", metric);
    setData(prev => prev.filter(m => m.id !== metric.id));
    setTotal(prev => prev - 1);
  } catch (error) {
    console.error("Failed to delete metric:", error);
  }
};


  const fetchMetrics = async () => {
    setLoading(true);
    try {
      // const token = localStorage.getItem('token');
      // const response = await axios.get<ApiResponse>(`${import.meta.env.VITE_API_BASE_URL}/metrics`, {
      //   headers: { Authorization: `Bearer ${token}` },
      //   params: {
      //     page: pagination.current,
      //     page_size: pagination.pageSize,
      //     sort_by: sorter.field,
      //     sort_order: sorter.order === 'ascend' ? 'asc' : 'desc',
      //     filter_category: filters.category?.join(','),
      //   },
      // });
      // setData(response.data.metrics);
      // setTotal(response.data.total);
      setData(dummyMetrics);
      setTotal(dummyMetrics.length);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [pagination.current, pagination.pageSize, sorter, filters]);

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    newFilters: Record<string, FilterValue | null>,
    newSorter: SorterResult<Metric> | SorterResult<Metric>[]
  ) => {
    setPagination(newPagination);
    setFilters({
      category: newFilters.category as string[] | undefined,
    });

    if (!Array.isArray(newSorter)) {
      setSorter({
        field: newSorter.field as string,
        order: newSorter.order ?? undefined,
      });
    }
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
      sorter: true,
    },
    {
      title: "Value",
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
          <Typography.Link onClick={() => handleUpdate(record)}>
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
    <div className={styles.tableWrapper}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          total,
          showTotal: (total) => `Total ${total} items`,
        }}
        onChange={handleTableChange}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
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
                      selectedMetric.value + Math.floor(Math.random() * 10 - 5),
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
  );
};

export default MetricsTable;
