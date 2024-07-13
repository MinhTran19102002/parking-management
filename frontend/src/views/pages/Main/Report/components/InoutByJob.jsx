import { useQuery } from '@tanstack/react-query';
import { theme } from 'antd';
import React, { useContext, useEffect, useTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { MonitorApi } from '~/api';
import AppContext from '~/context';
import { PureCard } from '~/views/components/Card';
import PieChart from '~/views/components/Chart/pie-chart';

function InoutByJob({ id, angleField = 'value', colorField = 'job', data = [], loading }) {
  const { t: lag } = useTranslation();
  const { token } = theme.useToken();
  const color = token.colorText;
  const { state } = useContext(AppContext);
  let { jobs } = state;
  jobs = [...jobs, 'other'];
  const types = jobs.slice();

  const unit = lag('common:turn');
  const yFieldTexts = types.reduce((acc, type) => {
    acc[type] = lag('common:jobs:' + type);
    return acc;
  }, {});
  const config = {
    angleField,
    colorField,
    yFieldTexts,
    data,
    padding: [20, 240, 0, 0],
    loading,
    unit,
    legend: {
      offsetY: 0,
      style: {
        fill: color
      }
    },
    style: {
      fill: color,
      color
    },
    height: 180
  };

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

export default InoutByJob;
