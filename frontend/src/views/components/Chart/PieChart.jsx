import { Pie } from "@ant-design/charts";
import { PieChartOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";
import React, { useRef, useState } from "react";
import { SmoothChart } from "~/shared/common";

const textStyle = {
  fontSize: 12,
  fill: "rgba(255,255,255, 0.8)",
};

function PieChart({ data, color, angleField, colorField, yFieldTexts, unit }) {
  const parent = useRef(null);
  const [loading, setLoading] = useState(false);

  const config = {
    data,
    angleField,
    colorField,
    color,
    height: 200,
    autoFit: true,
    appendPadding: [0, 40, 20, 20],
    radius: 1,
    innerRadius: 0.54,
    animation: false,
    pieStyle: {
      stroke: false,
    },
    label: {
      type: "inner",
      offset: "-50%",
      formatter: (item) => (item[angleField] > 0 ? `${item[angleField]}` : ""),
      style: {
        textAlign: "center",
        fontSize: 14,
      },
      autoRotate: false,
      autoHide: true,
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
    legend: {
      offsetX: -40,
      itemSpacing: 1,
      itemName: {
        formatter: (text) => {
          return yFieldTexts[text];
        },
        spacing: 24,
        style: {
          fontSize: 14,
          opacity: 1,
          fill: "#fff",
          fontWeight: 400,
        },
      },
    },
    tooltip: {
      customItems: (originalItems) => {
        let rs = [];
        console.log(originalItems);
        originalItems.map((e) => {
          rs.push({
            ...e,
            name: yFieldTexts[e.name],
            value: `${e.value} ${unit}`,
          });
        });
        return rs;
      },
    },
    statistic: {
      title: false,
      content: {
        style: {
          ...textStyle,
          whiteSpace: "pre-wrap",
          overflow: "visible",
          textOverflow: "ellipsis",
          fontSize: 16,
          fontWeight: 400,
        },
      },
    },
  };
  if (loading == true)
    return (
      <Skeleton.Node active>
        <PieChartOutlined style={{ fontSize: 50 }} />
      </Skeleton.Node>
    );
  return (
    <SmoothChart ref={parent}>
      <Pie {...config} />
    </SmoothChart>
  );
}

export default PieChart;
