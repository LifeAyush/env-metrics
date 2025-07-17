import React, { useState } from "react";
import styles from "../styles/Dashboard.module.scss";
import { Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import MetricsTable from "../components/MetricTable";

const Dashboard: React.FC = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);

  const handleAddMetric = () => {
    setAddModalVisible(true);
  };

  const handleAddModalClose = () => {
    setAddModalVisible(false);
  };

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
        <div className={styles.metricHeader}>
          <div className={styles.metricTitle}>
            <span>Metrics</span>
          </div>
          <div className={styles.metricActions}>
            <Button type="primary" onClick={handleAddMetric}>Add Metric</Button>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search for a metric"
              className={styles.search}
            />
          </div>
        </div>
        <MetricsTable
          addModalVisible={addModalVisible}
          onCloseAddModal={handleAddModalClose}
        />
      </main>
    </div>
  );
};

export default Dashboard;
