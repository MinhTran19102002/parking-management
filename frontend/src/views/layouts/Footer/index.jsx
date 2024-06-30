import { Layout, Typography } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

function Footer() {
  const {t: lag} = useTranslation();
  return (
    <Layout.Footer className="text-center py-1">
      <Typography.Title type="secondary" level={5}>
       {lag('common:footer')}
      </Typography.Title>
    </Layout.Footer>
  );
}

export default Footer;
