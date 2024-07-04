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

function InoutByTime({ id, xField = 'date', yField = 'value', seriesField = 'type', params = {} }) {
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
  const {
    data,
    refetch,
    isRefetching: loading
  } = useQuery({
    queryKey: ['Report', 'InOutByTime'],
    queryFn: async () => {
      let rs = [];
      try {
        const format = ChartService.getFormatByTimetype(params.timeType);
        const xFileds = ChartService.generateRange(
          dayjs(start, format),
          dayjs(end, format),
          timeType,
          format
        );
        const api = await MonitorApi.getInoutByTime({ ...params, xFileds, types });
        const newData = [];
        xFileds.map((dateTime) => {
          const item = api.find((el) => dateTime === el[xField]) || {};
          const dt = item?.count;
          types.map((type) => {
            newData.push({
              [xField]: dateTime,
              [yField]: Number(dt) || 0,
              [seriesField]: type
            });
          });
        });

        rs = newData;
      } catch (error) {
        console.log(error);
      }

      return rs;
    }
  });
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

  useEffect(() => {
    refetch();
  }, [JSON.stringify(params)]);
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