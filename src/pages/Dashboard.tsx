import React from 'react';
import styles from '../styles/Dashboard.module.scss';
import { Button, Tabs, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import MetricsTable from '../components/MetricTable';

const { TabPane } = Tabs;

const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>Dashbord</div>
        <div className={styles.menu}>
          <div className={`${styles.menuItem} ${styles.active}`}>Metrics</div>
          <div className={styles.menuItem}>Analytics</div>
        </div>
      </aside>

      <main className={styles.main}>

        <div className={styles.tabsContainer}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Environment" key="1" />
            <TabPane tab="Social" key="2" />
          </Tabs>
        </div>

        <div className={styles.metricHeader}>
          <div className={styles.metricTitle}>
            <span>Metrics</span>
            <span className={styles.metricStatus}>COMPLETED</span>
          </div>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search for a metric"
            className={styles.search}
          />
        </div>

        <Tabs defaultActiveKey="trend" className={styles.metricTabs}>
          <TabPane tab="Data" key="data">
            <MetricsTable />
          </TabPane>
          <TabPane tab="Trend" key="trend">
            <div className={styles.chartPlaceholder}>[Trend Graph Placeholder]</div>
          </TabPane>
        </Tabs>

        <div className={styles.footerActions}>
          <Button type="primary">Add Metric</Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
