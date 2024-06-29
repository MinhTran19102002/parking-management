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
    queryKey: ['NumberStaticInout'],
    initialData: [],
    queryFn: async () => {
      let rs = {};
      try {
        const api = await MonitorApi.getVehicleToday({ date: dayjs().format('L') });
        const xFileds = ChartService.generateRange(
          dayjs().startOf('d'),
          dayjs().endOf('d'),
          'h',
          'H'
        );

        console.log(api);
        let avg = 0;
        const newData = [];
        xFileds.map((dateTime) => {
          const item = api.find((el) => Number(dateTime) === el.hour) || {};
          const dt = item?.data || {};
          console.log(item);
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

  console.log(data, avg);

  const config = {
    xField,
    yField,
    data,
    seriesField,
    isGroup: true,
    unit: {
      x: lag('common:times:hour'),
      y: lag('common:vehicle')
    },
    loading,
    yFieldTexts,
    types,
    tooltipTitle: (text) => text + 'h',
    description: (
      <Typography.Text
        style={{
          color: '#DAA520'
        }}>{`${lag('common:avg')}: ${FormatNumber(avg, { isEndZeroDecimal: false })}`}</Typography.Text>
    )
  };

  useEffect(() => {
    refetch();
  }, [JSON.stringify(state.parkingEvent)]);

  return (
    <PureCard
      title={<Typography.Title level={4}>{lag('common:dashboard:staticCard')}</Typography.Title>}
      extra={
        <Space>
          {/* <CustomedDateRangePicker
            defaultValue={dates}
            onChange={onChangeDate}
            format={'L'}
            bordered={false}
            allowClear={false}
            suffixIcon={false}
            style={{ width: 220 }}
          /> */}
          <ChartSetting initialValues={setting} onChangeSetting={setSetting} />
        </Space>
      }
      className="card-main">
      <ColumnChart {...config} />
    </PureCard>
  );
}

export default NumberStatisChart;
