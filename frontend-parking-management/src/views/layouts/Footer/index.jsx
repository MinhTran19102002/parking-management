import { Layout, Typography } from "antd";
import React from "react";

function Footer() {
  return (
    <Layout.Footer className="text-center py-1">
      <Typography.Title type="secondary" level={5}>
        Website được phát triển bởi Trần Trung Hậu và Trần Công Minh
      </Typography.Title>
    </Layout.Footer>
  );
}

export default Footer;
