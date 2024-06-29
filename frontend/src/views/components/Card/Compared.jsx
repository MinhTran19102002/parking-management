import Icon, { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import React from "react";
function Compared({
  value,
  compareIcons = [CaretUpOutlined, CaretDownOutlined],
}) {
  // const getIconByValue = (v) => (v > 0 ? compareIcons[0] : compareIcons[1]);
  // const getColorByValue = (v) => (v > 0 ? compareColors[0] : compareColors[1]);
  // const { theme } = useTheme();
  // const compareColors = [
  //   theme.colors.events.danger.core,
  //   theme.colors.events.success.core,
  // ];
  // return (
  //   value && (
  //     <Space size={1} style={{ transform: false && "translateY(48%)" }}>
  //       <Icon
  //         component={getIconByValue(value)}
  //         style={{ color: getColorByValue(value) }}
  //       />
  //       <Typography.Title level={4} style={{ color: getColorByValue(value) }}>
  //         {Math.abs(value)}%
  //       </Typography.Title>
  //     </Space>
  //   )
  // );
}

export default Compared;
