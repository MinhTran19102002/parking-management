import React, { useState, useEffect, useRef } from "react";
import { DualAxes } from "@ant-design/plots";
import { Skeleton } from "antd";
import { LineChartOutlined } from "@ant-design/icons";
import { BlockColumnChart } from "./style";
import { SmoothChart } from "~/shared/common";
import { FormatNumber } from "~/services";
import defaultConfig, { DefaultTheme } from "./data";

const { style } = defaultConfig;

const label = {
  style,
  autoHide: true,
  autoEllipsis: true,
};

const GetLabel = (isLabel) => isLabel && label;
function DualAxesChart({
  loading,
  data = [],
  xField,
  yField = [],
  unit = {},
  yFieldTexts = {},
  isLabel,
  color = [],
  max = {},
  appendPadding = 4,
  tooltip = {},
  geometryOptions: geometryOptionsProps = [
    {
      geometry: "column",
      isGroup: true,
      seriesField: "leftType",
    },
    {
      geometry: "line",
      seriesField: "rightType",
    },
  ],
  customTitle,
}) {
  const parent = useRef();
  const geometryOptions = geometryOptionsProps.map((geo = {}) => {
    const custom = {};
    if (geo.label)
      geo["label"] = {
        ...GetLabel(isLabel),
        ...geo.label,
      };
    return {
      ...geo,
      ...custom,
    };
  });

  const isSameYUnits = unit.y[yField[0]] === unit.y[yField[1]];
  const config = {
    theme: DefaultTheme,
    data,
    xField,
    yField,
    colorField: "seriesField",
    color,
    animation: false,
    appendPadding,
    xAxis: {
      label: {
        style,
      },
      title: {
        text: unit.x,
        style,
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
      ...yField.reduce((acc, curr, index) => {
        const maxValue = max[curr];
        let currData = {
          min: 0,
          label: { formatter: () => "" },
        };
        if (isSameYUnits && index !== 0) return { ...acc, [curr]: currData };
        currData = {
          ...currData,
          title: {
            text: unit?.y[curr] || "",
            style,
          },
          label: {
            style,
            formatter: (el) => {
              if (Math.round(el) - el === 0) {
                return FormatNumber(el, { isEndZeroDecimal: false });
              }
              return null;
            },
          },
          grid: {
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
        };
        return {
          ...acc,
          [curr]: currData,
        };
      }, {}),
    },
    tooltip: {
      customItems: (originalItems) => {
        let rs = originalItems.map((org) => {
          const { data = {} } = org;
          const rsUnit = Object.keys(unit.y).find((el) =>
            data.hasOwnProperty(el)
          );
          const nameText = org.name;
          const name = yFieldTexts[nameText];
          let value =
            `${FormatNumber(org.value, {
              isEndZeroDecimal: false,
            })} ` + unit.y[rsUnit];
          return {
            ...org,
            name,
            value,
          };
        });
        return rs;
      },
      ...tooltip,
    },
    legend: {
      ...defaultConfig?.legend,
      itemName: {
        style,
        formatter: (_, item) => yFieldTexts[item.name],
      },
    },
    geometryOptions,
  };

  if (loading)
    return (
      <Skeleton.Node active>
        <LineChartOutlined style={{ fontSize: 50 }} />
      </Skeleton.Node>
    );

  return (
    <SmoothChart>
      <BlockColumnChart ref={parent}>
        <DualAxes {...config} />
      </BlockColumnChart>
    </SmoothChart>
  );
}

export default DualAxesChart;
