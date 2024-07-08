import { Layout, Spin } from 'antd';
import React from 'react';

function Loading({}) {
  return (
    <Layout>
      <Spin size="large" style={{ margin: 'auto' }} />
    </Layout>
  );
}

export default Loading;
