import React, { useMemo, useRef, useState } from "react";
import { Bar } from "@ant-design/charts";
import { BarChartOutlined, PieChartOutlined } from "@ant-design/icons";
import { Descriptions, Row, Skeleton } from "antd";
import { SmoothChart } from "~/shared/common";
import { FormatNumber } from "~/services";
import ChartConfig, { DefaultTheme } from "./data";
const { textStyle, grid, slider, onReady, scrollbar } = ChartConfig;

function BarChart({
  id,
  data = [],
  xField,
  yField,
  color,
  yFieldTexts,
  loading,
  unit,
  isLabel,
  isScrollbar,
  isSlider,
  minBarWidth = 8,
  seriesField = false,
  yAxixTitle = true,
  annotations = [],
  appendPadding = [16, 16, 0, 24],
  description,
}) {
  const [height, setHeight] = useState();
  const parent = useRef(null);
  const max = Math.max(...data.map((el) => el[xField])) * 1.1;
  const [sliderState, setSliderState] = useState({ start: 0, end: 0.2 });
  const barCount = useMemo(
    () =>
      data.reduce((acc = [], curr) => {
        const currInAccByXField = acc.find((el) => el[xField] === curr[xField]);
        if (!currInAccByXField) acc.push(curr);
        return acc;
      }, []).length,
    [JSON.stringify(data)]
  );
  const isSliderMemo = useMemo(() => {
    if (id) console.log(Math.floor(height / barCount) <= minBarWidth);
    return Math.floor(height / barCount) <= minBarWidth;
  }, [height, barCount, minBarWidth]);

  const config = {
    theme: DefaultTheme,
    data,
    xField,
    yField,
    color,
    appendPadding,
    seriesField,
    animation: false,
    barStyle: {
      radius: [4, 4, 0, 0],
    },
    autoFit: true,
    minBarWidth,
    maxBarWidth: 24,
    marginRatio: 0.4,
    slider: isSliderMemo &&
      isSlider && {
        ...sliderState,
        ...slider,
      },
    scrollbar: isSliderMemo && isScrollbar && { type: "vertical" },
    label: isLabel && {
      formatter: (item) => {
        const value = item[xField];
        return FormatNumber(value || 0, { isEndZeroDecimal: false });
      },
      style: {
        fontSize: 12,
        fill: "#ffffff",
        opacity: 0.64,
      },
      position: "right",
      autoHide: true,
    },
    legend: {
      position: "top",
      itemName: {
        style: {
          fill: "#ffffff",
        },
        // formatter: (_, item) => {
        //   const i = types.findIndex((e) => e === item.value);
        //   return yFieldTexts[i];
        // },
      },
    },
    xAxis: {
      max,
      label: {
        style: textStyle,
        formatter: (text, e, r) =>
          FormatNumber(Number(text), { isEndZeroDecimal: false }),
      },
      title: {
        offset: 32,
        text: unit.x,
        style: textStyle,
      },
      grid: {
        alignTick: false,
        closed: true,
        line: {
          style: {
            stroke: "rgba(238, 238, 238, 0.20)",
            lineWidth: 1,
            cursor: "pointer",
            opacity: 0.6,
          },
        },
      },
    },
    yAxis: {
      label: {
        formatter: (text) => yFieldTexts[text],
        style: textStyle,
      },
      title: yAxixTitle && {
        offset: 60,
        rotate: -7.92,
        text: unit.y,
        style: textStyle,
      },
      grid: {
        closed: true,
        alignTick: false,
        line: {
          style: {
            stroke: "rgba(238, 238, 238, 0.20)",
            lineWidth: 1,
            cursor: "pointer",
            opacity: 0.6,
          },
        },
      },
    },
    tooltip: {
      title: (text) => yFieldTexts[text],
      customItems: (originalItems) => {
        let rs = originalItems.map((org) => {
          const name = yFieldTexts[org.title];
          let value =
            `${FormatNumber(org.value, {
              isEndZeroDecimal: false,
            })} ` + unit.x;
          return {
            ...org,
            title: name,
            name: "Giá trị",
            value,
          };
        });
        return rs;
      },
    },
    annotations,
    onReady: (plot = {}) => {
      try {
        const { height = 0 } = plot.chart;
        setHeight(height);
      } catch {}
    },
  };

  if (loading == true)
    return (
      <Skeleton.Node className="loading-state skeleton" active>
        <BarChartOutlined style={{ fontSize: 50 }} />
      </Skeleton.Node>
    );
  return (
    <SmoothChart ref={parent}>
      {description && (
        <Row className="w-100 d-flex justify-content-center">{description}</Row>
      )}
      <Bar {...config} />
    </SmoothChart>
  );
}

export default BarChart;
