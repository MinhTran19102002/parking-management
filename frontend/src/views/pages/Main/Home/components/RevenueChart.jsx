import { Column } from '@ant-design/plots';
import { Card, DatePicker, Space, Typography, theme } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import CardBlock from '~/views/components/CardBlock';
import { DefaultNumberStatisChart } from '../data';
import { ChartService, ErrorService, FormatNumber } from '~/services';
import dayjs from 'dayjs';
import AppContext from '~/context';
import { MonitorApi } from '~/api';
import { CustomedDateRangePicker } from '~/views/components';
import { useTranslation } from 'react-i18next';
import ColumnChart from '~/views/components/Chart/column-chart';
import { useQuery } from '@tanstack/react-query';
import { PureCard } from '~/views/components/Card';
import ChartSetting from '~/views/components/Card/ChartSetting';

const zones = ['A', 'B', 'C'];

function NumberStatisChart({ xField = 'dateTime', yField = 'value', seriesField = 'type' }) {
  const { t: lag } = useTranslation();
  const { state, actions } = useContext(AppContext);
  const types = state.zones;
  const yFieldTexts = types.reduce((acc, type) => {
    acc[type] = lag('common:zoneName', { zone: type });
    return acc;
  }, {});
  const [setting, setSetting] = useState({ isLabel: true });
  const { isLabel } = setting;

  const [dates, setDates] = useState([dayjs().add(-7, 'd').startOf('d'), dayjs().endOf('d')]);
  const {
    data: { data = [], avg },
    refetch,
    isFetching: loading
  } = useQuery({
    queryKey: ['NumberStaticInout', 'ByDate'],
    initialData: [],
    queryFn: async () => {
      let rs = {};
      try {
        const [start, end] = dates;
        const api = await MonitorApi.getVehicleInOutNumber({
          start: start.format('L'),
          end: end.format('L')
        });
        const xFileds = ChartService.generateRange(start, end, 'date', 'L');
        let avg = 0;
        const newData = [];
        xFileds.map((dateTime) => {
          const item = api.find((el) => dateTime === el.date) || {};
          const dt = item?.data || {};
          types.map((type) => {
            avg += dt[type] || 0;
            newData.push({
              [xField]: dateTime,
              [yField]: dt[type] || 0,
              [seriesField]: type
            });
          });
        });
        avg = avg / Number(dayjs().format('H')) || 0;

        rs = {
          data: newData,
          avg
        };
      } catch (error) {
        console.log(error);
      }
      return rs;
    }
  });

  const config = {
    xField,
    yField,
    data,
    seriesField,
    isGroup: true,
    unit: {
      x: lag('common:times:day'),
      y: lag('common:vehicle')
    },
    loading,
    yFieldTexts,
    types
  };

  useEffect(() => {
    refetch();
  }, [JSON.stringify(state.parkingEvent)]);

  const onChangeDate = (values) => {
    setDates(values);
  };

  return (
    <PureCard
      title={lag('common:dashboard:inoutByDay')}
      extra={
        <Space>
          <CustomedDateRangePicker
            defaultValue={dates}
            onChange={onChangeDate}
            format={'L'}
            bordered={false}
            allowClear={false}
            suffixIcon={false}
            style={{ width: 220 }}
          />
          <ChartSetting initialValues={setting} onChangeSetting={setSetting} />
        </Space>
      }
      className="card-main">
      <ColumnChart {...config} />
    </PureCard>
  );
}

export default NumberStatisChart;
