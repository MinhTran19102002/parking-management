import { useQuery } from '@tanstack/react-query';
import { theme } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MonitorApi } from '~/api';
import { PureCard } from '~/views/components/Card';
import PieChart from '~/views/components/Chart/pie-chart';

function VisistorRate({ id, params, angleField = 'value', colorField = 'type' }) {
  const { t: lag } = useTranslation();
  const { token } = theme.useToken();
  const color = token.colorText;
  const {
    data,
    refetch,
    isRefetching: loading
  } = useQuery({
    queryKey: ['Report', 'VisistorRate'],
    queryFn: async () => {
      let rs = [];
      try {
        const api = await MonitorApi.getVisistorRate(params);
        rs = api;
      } catch {}

      return rs;
    }
  });
  const unit = '';
  const yFieldTexts = {
    visitor: lag('common:undefinedDriver'),
    driver: lag('common:definedDriver')
  };
  const config = {
    angleField,
    colorField,
    yFieldTexts,
    data,
    padding: [20, 240, 0, 24],
    loading,
    unit,
    legend: {
      offsetY: -0,
      offsetX: -80,
      style: {
        fill: color
      }
    },
    style: {
      fill: color,
      color,
    }
  };

  useEffect(() => {
    refetch();
  }, [JSON.stringify(params)]);
  return (
    <PureCard
      title={lag(`common:reportPage:${id}`)}
      classNames={{ body: 'px-0 py-0' }}
      size="small"
      className="card-main">
      <PieChart {...config} />
    </PureCard>
  );
}

export default VisistorRate;
