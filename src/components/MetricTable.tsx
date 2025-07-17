import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { SorterResult, FilterValue } from 'antd/es/table/interface';
import axios from 'axios';
import dayjs from 'dayjs';
import styles from '../styles/MetricsTable.module.scss';

interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  category: string;
  date: string;
  description: string;
}

interface ApiResponse {
  metrics: Metric[];
  total: number;
}

const MetricsTable: React.FC = () => {
  const [data, setData] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  const [sorter, setSorter] = useState<{
    field?: string;
    order?: 'ascend' | 'descend';
  }>({});

  const [filters, setFilters] = useState<{ category?: string[] }>({});

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<ApiResponse>(`${import.meta.env.VITE_API_BASE_URL}/metrics`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: pagination.current,
          page_size: pagination.pageSize,
          sort_by: sorter.field,
          sort_order: sorter.order === 'ascend' ? 'asc' : 'desc',
          filter_category: filters.category?.join(','),
        },
      });
      setData(response.data.metrics);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const columns: ColumnsType<Metric> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Value',
      key: 'value',
      sorter: true,
      render: (_, record) => `${record.value} ${record.unit}`,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Energy', value: 'Energy' },
        { text: 'Water', value: 'Water' },
        { text: 'Waste', value: 'Waste' },
      ],
      filterMultiple: true,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: true,
      render: (date: string) => dayjs(date).format('DD MMM YYYY'),
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
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default MetricsTable;
