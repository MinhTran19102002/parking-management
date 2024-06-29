import { Col, Form, Popover, Row, Switch, Typography } from "antd";
import React from "react";
import { MoreOutlined } from "@ant-design/icons";
import { Button } from "antd";

function ChartSetting({ onChangeSetting, initialValues }) {
  return (
    <Popover
      title={"Cài đặt"}
      content={
        <SettingForm
          initialValues={initialValues}
          onChangeSetting={onChangeSetting}
        />
      }
    >
      <Button
        id="btnSettingCard"
        icon={<MoreOutlined />}
        size={"small"}
        type="text"
      />
    </Popover>
  );
}

const SettingForm = ({ onChangeSetting, initialValues }) => {
  return (
    <Form initialValues={{ ...initialValues }} onValuesChange={onChangeSetting}>
      <Form.Item
        name={"isLabel"}
        label="Hiển thị giá trị điểm"
        valuePropName="checked"
      >
        <Switch size="small" />
      </Form.Item>
    </Form>
  );
};

export default ChartSetting;
