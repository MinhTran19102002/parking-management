import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MonitorApi } from '~/api';
import AppContext from '~/context';
import { ChartService } from '~/services';
import { PureCard } from '~/views/components/Card';
import ChartSetting from '~/views/components/Card/ChartSetting';
import ColumnChart from '~/views/components/Chart/column-chart';

function InoutByTime({ id, xField = 'date', yField = 'value', seriesField = 'type', data=[], loading, params }) {
  const { start, end, timeType } = params;
  const [setting, setSetting] = useState({ isLabel: true });
  const { isLabel } = setting;
  const { t: lag } = useTranslation();
  const { state } = useContext(AppContext);
  const types = ['turn'];
  const yFieldTexts = types.reduce((acc, type) => {
    acc[type] = lag('common:' + type);
    return acc;
  }, {});
  const unit = '';
  const config = {
    xField,
    yField,
    data,
    seriesField,
    unit: {
      x: lag('common:times:' + timeType),
      y: lag('common:turn')
    },
    loading,
    yFieldTexts,
    isGroup: true,
    types,
    isLabel,
    label: {
      position: 'top'
    }
  };
  return (
    <PureCard
      title={lag(`common:reportPage:${id}`)}
      className="card-main"
      extra={<ChartSetting initialValues={setting} onChangeSetting={setSetting} />}>
      <ColumnChart {...config} />
    </PureCard>
  );
}

export default InoutByTime;
