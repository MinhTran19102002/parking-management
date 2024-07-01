import React, { useContext, useEffect, useRef, useState } from 'react';
import { BlockPieChart, SmoothChart } from './style';
import { FormatNumber } from '~/services';
import ChartConfig, { DefaultTheme } from './data';
import { Pie } from '@ant-design/plots';
import AppContext from '~/context';
import { PieChartOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd';
const { textStyle, grid, slider, onReady, scrollbar } = ChartConfig;
export default ({
  angleField,
  colorField,
  data = [],
  unit = 'kWh',
  colors = ['#6C62E5', '#27B180', '#17ACD3', '#A738F2', '#737B8C'],
  t,
  i18n,
  width,
  height,
  yFieldTexts,
  padding = 0,
  appendPadding = 0,
  legend = {},
  loading,
  style
}) => {
  const { state, actions } = useContext(AppContext);
  const [currTheme, setCurrTheme] = useState(state.theme);
  useEffect(() => {
    setCurrTheme(state.theme);
  }, [state.theme]);
  const total = data.reduce((acc, curr) => acc + curr[angleField], 0);
  const parent = useRef(null);
  const config = {
    theme: currTheme,
    data,
    animation: false,
    angleField,
    colorField,
    autoFit: true,
    radius: 1,
    innerRadius: 0.54,
    renderer: 'svg',
    padding,
    appendPadding,
    pieStyle: {
      cfg: {
        strokeOpacity: 0.7,
        lineWidth: 0.64
      }
    },
    meta: {
      value: {
        formatter: (v) => `${FormatNumber(v)} ${unit}`
      }
    },
    label: {
      type: 'inner',
      offset: '-50%',
      autoRotate: false,
      formatter: (item) => {
        let value = item.percent * 100;
        return value >= 5 ? Math.round(value) + '%' : '';
      }
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: yFieldTexts[datum[colorField]],
          value: `${FormatNumber(datum[angleField])} ${unit}`
        };
      }
    },
    legend: {
      position: 'right',
      offsetX: -100,
      itemSpacing: 0,
      itemName: {
        formatter: (text) => {
          return yFieldTexts[text];
        },
        style: {
          fontSize: 12
        }
      },
      itemValue: {
        formatter: (_, __, index) => {
          return `${FormatNumber(data[index][angleField])} ${unit}`;
        },
        style: {
          fontSize: 14,
          ...legend.style
        }
      },
      ...legend
    },
    content: {
      offsetY: 2,
      style: {
        fontSize: 12,
        fontWeight: 300,
        whiteSpace: 'nowrap !important'
      }
    },
    statistic: {
      title: false,
      content: {
        style: {
          fontSize: 20,
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          ...style
        },
        content: `${FormatNumber(total)} ${unit}`
      }
    },
    state: {
      active: {
        animate: { duration: 100, easing: 'easeLinear' },
        style: {
          lineWidth: 1,
          stroke: '#ffff',
          strokeOpacity: 0.7
        }
      }
    },
    interactions: [
      {
        type: 'element-active'
      }
    ]
  };

  if (loading)
    return (
      <div className="layout-flex-center">
        <Skeleton.Node className="loading-state skeleton" style={{ margin: 'auto' }} active>
          <PieChartOutlined style={{ fontSize: 50 }} />
        </Skeleton.Node>
      </div>
    );

  return (
    <SmoothChart ref={parent}>
      <Pie {...config} />
    </SmoothChart>
  );
};
