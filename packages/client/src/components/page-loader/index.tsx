import React from 'react';
import { Space, Spin } from 'antd';

function PageLoader() {
  return (
    <Space
      direction="horizontal"
      style={{ width: '100%', height: '100vh', justifyContent: 'center' }}>
      <Spin size="large" />
    </Space>
  );
}

export default PageLoader;
