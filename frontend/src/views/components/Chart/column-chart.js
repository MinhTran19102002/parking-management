import React, { useState, useEffect, useRef, useMemo } from "react";
import { Column } from "@ant-design/plots";
import { Row, Skeleton } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import { BlockColumnChart } from "./style";
import { SmoothChart } from "~/shared/common";
import { useTranslation } from "react-i18next";
import { FormatNumber } from "~/services";
import dayjs from "dayjs";
import ChartConfig from "./data";
const { textStyle, grid, slider, onReady, scrollbar } = ChartConfig;

export default ({
  id,
  data = [],
  xField,
  yField,
  seriesField,
  types = [],
  color = [],
  yFieldTexts,
  loading,
  unit,
  legend = {},
  isLabel,
  tooltipTitle,
  appendPadding = [0, 0, 0, 0],
  height = 220,
  minColumnWidth = 12,
  maxColumnWidth = 30,
  isStack,
  description,
  annotations,
  isSlider,
  label = {},
  max,
  isScrollbar,
  columnWidthRatio = false,
  defaultSliderState = { start: 0, end: 0.4 },
}) => {
  const columnStyle = {
    radius: isStack || [4, 4, 0, 0],
  };
  const [width, setWidth] = useState();
  const [sliderState, setSliderState] = useState(defaultSliderState);
  const [legendSelected, setLegendSelected] = useState(
    types.reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: true,
      };
    }, {})
  );

  const columnCount = useMemo(
    () =>
      data.reduce((acc = [], curr) => {
        const currInAccByXField = acc.find((el) => el[xField] === curr[xField]);
        if (!currInAccByXField) acc.push(curr);
        return acc;
      }, []).length,
    [JSON.stringify(data)]
  );
  const isSliderMemo = useMemo(() => {
    return Math.floor(width / columnCount) <= minColumnWidth;
  }, [width, columnCount, minColumnWidth]);
  const parent = useRef(null);
  const config = {
    data,
    appendPadding,
    xField,
    yField,
    seriesField,
    animation: false,
    maxColumnWidth,
    minColumnWidth,
    columnStyle,
    isStack,
    autoFit: true,
    color,
    columnWidthRatio,
    connectedArea: {
      style: (oldStyle, element) => {
        return {
          fill: "rgba(255, 255, 255, 0.25)",
          stroke: oldStyle.fill,
          lineWidth: 0.5,
        };
      },
    },
    label: isLabel && {
      formatter: (item, x, y) => {
        const value = item[yField];
        return value > 0
          ? FormatNumber(value || 0, { isEndZeroDecimal: false })
          : "";
      },
      style: {
        ...textStyle,
      },
      position: "middle",
      ...label,
    },
    legend: legend && {
      selected: legendSelected,
      position: "top",
      itemName: {
        style: textStyle,
        formatter: (_, item) => {
          const i = types.find((e) => e === item.value);
          return yFieldTexts[i];
        },
      },
      ...legend,
    },
    xAxis: {
      label: {
        style: textStyle,
      },
      title: {
        text: unit.x,
        style: textStyle,
      },
      grid,
    },
    yAxis: {
      max: max && max * 1.2,
      label: {
        formatter: (text) =>
          FormatNumber(Number(text), { isEndZeroDecimal: false }),
        style: textStyle,
      },
      title: {
        text: unit.y,
        style: textStyle,
      },
      grid,
    },
    tooltip: {
      title: (text) => (tooltipTitle ? tooltipTitle(text) : text),
      customItems: (originalItems) => {
        let rs = originalItems.map((org) => {
          const isFind = types.find((t) => t === org.data.type);
          const name = yFieldTexts[isFind];
          let value =
            `${FormatNumber(org.value, {
              isEndZeroDecimal: false,
            })} ` + unit.y;

          return {
            ...org,
            name,
            value,
          };
        });
        return rs;
      },
    },
    annotations,
    slider: isSliderMemo && {
      ...sliderState,
      ...slider,
    },
    scrollbar: isScrollbar && { ...scrollbar },
    onReady: (plot = {}) => {
      try {
        const { width = 0 } = plot.chart;
        setWidth(width);
      } catch {}
      onReady(plot, {
        legendSelected,
        setLegendSelected,
        setSliderState,
      });
    },
  };

  // useEffect(() => {
  //   if (!loading) {
  //     const observer = new ResizeObserver((entries) => {
  //       const children = parent.current.querySelectorAll("canvas");
  //       if (children[0]) {
  //         children[0].style.height = entries[0].contentRect.height - 70 + "px";
  //       }
  //     });
  //     observer.observe(parent.current);
  //     return () => parent.current && observer.unobserve(parent.current);
  //   }
  // }, [loading]);

  if (loading)
    return (
      <Skeleton.Node className="loading-state skeleton" style={{ margin: "auto" }} active>
        <BarChartOutlined style={{ fontSize: 50 }} />
      </Skeleton.Node>
    );
  return (
    <SmoothChart ref={parent}>
      {description && (
        <Row className="w-100 d-flex justify-content-center">{description}</Row>
      )}
      <Column {...config} />
    </SmoothChart>
  );
};
