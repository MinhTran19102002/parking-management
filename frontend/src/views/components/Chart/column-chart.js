import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { Column } from '@ant-design/plots';
import { Empty, Row, Skeleton } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { SmoothChart } from './style';
import { useTranslation } from 'react-i18next';
import { FormatNumber } from '~/services';
import dayjs from 'dayjs';
import ChartConfig, { DefaultTheme } from './data';
import AppContext from '~/context';
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
  isGroup,
  columnWidthRatio = false,
  defaultSliderState = { start: 0, end: 0.4 }
}) => {
  const { state, actions } = useContext(AppContext);
  const [currTheme, setCurrTheme] = useState(state.theme);
  useEffect(() => {
    setCurrTheme(state.theme);
  }, [state.theme]);
  const columnStyle = {
    radius: isStack || [4, 4, 0, 0]
  };
  const [width, setWidth] = useState();
  const [sliderState, setSliderState] = useState(defaultSliderState);
  const [legendSelected, setLegendSelected] = useState(
    types.reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: true
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
    theme: currTheme,
    data,
    appendPadding,
    xField,
    yField,
    seriesField,
    isGroup,
    animation: false,
    maxColumnWidth,
    minColumnWidth,
    columnStyle,
    isStack,
    autoFit: true,
    columnWidthRatio,
    label: isLabel && {
      formatter: (item, x, y) => {
        const value = item[yField];
        return value > 0 ? FormatNumber(value || 0, { isEndZeroDecimal: false }) : '';
      },
      position: 'middle',
      ...label
    },
    legend: legend && {
      selected: legendSelected,
      position: 'top',
      itemName: {
        formatter: (_, item) => {
          const i = types.find((e) => e === item.value);
          return yFieldTexts[i];
        }
      },
      ...legend
    },
    xAxis: {
      title: {
        text: unit.x
      }
    },
    yAxis: {
      max: max && max * 1.2,
      label: {
        formatter: (text) => FormatNumber(Number(text), { isEndZeroDecimal: false })
      },
      title: {
        text: unit.y
      }
    },
    tooltip: {
      title: (text) => (tooltipTitle ? tooltipTitle(text) : text),
      customItems: (originalItems) => {
        let rs = originalItems.map((org) => {
          const isFind = types.find((t) => t === org.data.type);
          const name = yFieldTexts[isFind];
          let value =
            `${FormatNumber(org.value, {
              isEndZeroDecimal: false
            })} ` + unit.y;

          return {
            ...org,
            name,
            value
          };
        });
        return rs;
      }
    },
    annotations,
    slider: isSliderMemo && {
      ...sliderState,
      ...slider
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
        setSliderState
      });
    }
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
      <div className='layout-flex-center'>
        <Skeleton.Node className="loading-state skeleton" style={{ margin: 'auto' }} active>
          <BarChartOutlined style={{ fontSize: 50 }} />
        </Skeleton.Node>
      </div>
    );

  return (
    <SmoothChart ref={parent}>
      {description && <Row className="w-100 d-flex justify-content-center">{description}</Row>}
      <Column {...config} />
    </SmoothChart>
  );
};
