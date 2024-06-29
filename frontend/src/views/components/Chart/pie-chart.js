import { SmoothChart } from "~/shared/common";
import React, { useRef } from "react";
import { BlockPieChart } from "./style";
import { Pie } from "@ant-design/charts";
import { FormatNumber, HanldeFloorText } from "~/services";
import ChartConfig, { DefaultTheme } from "./data";
const { textStyle, grid, slider, onReady, scrollbar } = ChartConfig;

const style = textStyle;
export default ({
  angleField,
  colorField,
  data = [],
  unit = "kWh",
  colors = ["#6C62E5", "#27B180", "#17ACD3", "#A738F2", "#737B8C"],
  t,
  i18n,
  width,
  height,
  yFieldTexts,
  padding = 0,
  appendPadding = 0,
  legend = {},
}) => {
  const total = data.reduce((acc, curr) => acc + curr[angleField], 0);
  const parent = useRef(null);
  const config = {
    theme: DefaultTheme,
    data,
    animation: false,
    angleField,
    colorField,
    autoFit: true,
    radius: 1,
    innerRadius: 0.54,
    color: colors,
    renderer: "svg",
    padding,
    appendPadding,
    pieStyle: {
      cfg: {
        stroke: "#000",
        strokeOpacity: 0.7,
        lineWidth: 0.64,
      },
    },
    meta: {
      value: {
        formatter: (v) => `${FormatNumber(v)} ${unit}`,
      },
    },
    label: {
      type: "inner",
      offset: "-50%",
      style: {
        textAlign: "center",
        fill: "#fff",
      },
      autoRotate: false,
      formatter: (item) => {
        let value = item.percent * 100;
        return value >= 5 ? Math.round(value) + "%" : "";
      },
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: yFieldTexts[datum[colorField]],
          value: `${FormatNumber(datum[angleField])} ${unit}`,
        };
      },
    },
    legend: {
      position: "right",
      offsetX: -100,
      itemSpacing: 0,
      itemName: {
        formatter: (text) => {
          return yFieldTexts[text];
        },
        style: {
          ...style,
          fontSize: 12,
          opacity: 0.8,
        },
      },
      itemValue: {
        formatter: (_, __, index) => {
          return `${FormatNumber(data[index][angleField])} ${unit}`;
        },
        style: {
          ...style,
          fontSize: 14,
        },
      },
      ...legend,
    },
    content: {
      offsetY: 2,
      style: {
        fontSize: 12,
        fontWeight: 300,
        whiteSpace: "nowrap !important",
      },
    },
    statistic: {
      title: false,
      content: {
        style: {
          fontSize: 20,
          color: "#fff",
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        content: `${FormatNumber(total)} ${unit}`,
      },
    },
    state: {
      active: {
        animate: { duration: 100, easing: "easeLinear" },
        style: {
          lineWidth: 1,
          stroke: "#ffff",
          strokeOpacity: 0.7,
        },
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };

  return (
    <SmoothChart ref={parent}>
      <Pie {...config} />
    </SmoothChart>
  );
};
