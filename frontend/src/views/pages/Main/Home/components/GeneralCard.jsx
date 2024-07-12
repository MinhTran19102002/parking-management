import { Gauge } from '@ant-design/plots';
import { Card, Space, Tag, Typography, theme } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { MonitorApi } from '~/api';
import CardBlock from '~/views/components/CardBlock';
import CustomedTag from '~/views/components/CustomedTag';
import AppContext from '~/context';
import { useTranslation } from 'react-i18next';
import { PureCard } from '~/views/components/Card';

function GeneralCard({ zone = 'A' }) {
  const { t: lag } = useTranslation();
  const { token } = theme.useToken();
  const { state, actions } = useContext(AppContext);
  const [data, setData] = useState({
    total: 1,
    occupied: 0,
    unoccupied: 0
  });

  const [currTheme, setCurrTheme] = useState(state.theme);
  useEffect(() => {
    setCurrTheme(state.theme);
  }, [state.theme]);

  const config = {
    theme: currTheme,
    height: 200,
    percent: data.occupied / data.total,
    range: {
      color: [token.colorPrimary, token.colorFillSecondary]
    },
    startAngle: Math.PI,
    endAngle: 2 * Math.PI,
    innerRadius: 0.84,
    min: 0,
    indicator: {
      pointer: null,
      pin: null
    },
    xAxis: {
      grid: {
        line: {
          style: {
            stroke: 'black',
            lineWidth: 24,
            lineDash: [4, 5],
            strokeOpacity: 0.7,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffsetX: 5,
            shadowOffsetY: 5,
            cursor: 'pointer'
          }
        }
      }
    },
    axis: {
      label: {
        offset: 5,
        offsetY: 25,
        style: { fontSize: 14 },
        formatter: (val) => {
          return '';
          if (val === '0') {
            return '0';
          } else if (val === '1') {
            return val * data.total;
          }
        }
      },
      subTickLine: null,
      tickLine: null
    },
    statistic: {
      title: {
        offsetY: -44,
        style: {
          fontSize: 26
        },
        formatter: (e) => {
          return `${data.occupied.toString()}/${data.total}`;
        }
      },
      content: {
        offsetY: -24,
        style: {
          fontSize: '18px',
          lineHeight: '44px',
          color: token.colorTextSecondary
        },
        formatter: () => lag('common:dashboard:generalCard')
      }
    },
    gaugeStyle: {
      lineCap: 'round',
      lineDash: [4, 5],
      strokeOpacity: 0.7,
      shadowColor: token.boxShadowCard,
      shadowBlur: 10,
      shadowOffsetX: 5,
      shadowOffsetY: 5
    }
  };

  const callApi = async () => {
    try {
      const api = await MonitorApi.getStatusByZone(zone);
      if (api) {
        setData({ ...api });
      }
    } catch {}
  };

  useEffect(() => {
    callApi();
  }, [state.parkingEvent]);

  return (
    <PureCard
      title={
        <CustomedTag bordered={false} entity={zone} entityType={'zone'}>
          {lag('common:zoneName', { zone })}
        </CustomedTag>
      }
      className="card-main">
      <Gauge {...config} />
    </PureCard>
  );
}

export default GeneralCard;
