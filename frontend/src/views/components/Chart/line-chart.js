import React, { useEffect } from "react";
import { Line } from "@ant-design/plots";
import { SmoothChart } from "~/shared/common";
import { LineChartOutlined } from "@ant-design/icons";
import { BlockLineChart } from "./style";
import { Skeleton } from "antd";
export default ({
  data,
  unit,
  xField = "date",
  yField = "parkingHour",
  seriesField = "floor",
  color,
  loading,
  label,
}) => {
  data =
    data.length > 0
      ? data
      : [
          {
            date: "",
            parkingHour: 0,
            floor: "",
          },
        ];
  const config = {
    data,
    xField,
    yField,
    seriesField,
    color,
    label,
    legend: {
      position: "top",
      itemName: {
        style: {
          fill: "#ffffff",
        },
      },
    },
    xAxis: {
      label: {
        style: { fill: "#FFFFFF" },
      },
      title: {
        text: unit.x,
        style: {
          fontSize: 12,
          fill: "#ffffff",
        },
      },
    },
    yAxis: {
      label: {
        style: { fill: "#FFFFFF" },
      },
      title: {
        text: unit.y,
        style: {
          fontSize: 12,
          fill: "#ffffff",
        },
      },
    },
  };
  if (loading || data.length <= 0)
    return (
      <Skeleton.Node active>
        <LineChartOutlined style={{ fontSize: 50 }} />
      </Skeleton.Node>
    );
  return (
    <SmoothChart>
      <BlockLineChart ref={parent}>
        <Line {...config} />
      </BlockLineChart>
    </SmoothChart>
  );
};
