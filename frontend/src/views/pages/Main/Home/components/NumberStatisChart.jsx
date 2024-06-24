import { Column } from '@ant-design/plots';
import { Card, DatePicker, Space, Typography, theme } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import CardBlock from '~/views/components/CardBlock';
import { DefaultNumberStatisChart } from '../data';
import { ChartService, ErrorService } from '~/services';
import dayjs from 'dayjs';
import AppContext from '~/context';
import { MonitorApi } from '~/api';
import { CustomedDateRangePicker } from '~/views/components';
import { useTranslation } from 'react-i18next';

const zones = ['A', 'B', 'C'];

function NumberStatisChart({}) {
  const { state, actions } = useContext(AppContext);
  const [data, setData] = useState([]);
  const { t: lag } = useTranslation();
  const [dates, setDates] = useState([dayjs().add(-7, 'd').startOf('d'), dayjs().endOf('d')]);
  const defaultConfig = ChartService.defaultConfig;
  const { token } = theme.useToken();
  const color = [token['purple'], token['magenta'], token['orange2']];
  const unit = {
    x: lag('common:times:day'),
    y: lag('common:vehicle')
  };

  const [currTheme, setCurrTheme] = useState(state.theme);
  useEffect(() => {
    setCurrTheme(state.theme);
  }, [state.theme]);

  const config = {
    ...defaultConfig,
    height: 200,
    theme: currTheme,
    data,
    xField: 'date',
    yField: 'value',
    seriesField: 'zone',
    isGroup: true,
    yAxis: {
      title: {
        text: unit.y,
        style: ChartService.textStyle
      }
    },
    legend: {
      position: 'top',
      itemName: {
        formatter: (text) => {
          return lag('common:zoneName', { zone: text });
        }
      }
    },
    tooltip: {
      title: (e) => {
        return e;
      },
      customItems: (originalItems) => {
        let rs = originalItems.map((org) => {
          return {
            ...org,
            name: lag('common:zoneName', { zone: org.name }),
            value: org.data.isData ? `${org.value} ${unit.y}` : lag('common:underfined')
          };
        });
        return rs;
      }
    }
  };

  const onChangeDate = (dates, dateStrings) => {
    setDates(dates);
  };

  const callApi = async () => {
    try {
      let [startDate, endDate] = dates;
      const dateArr = ChartService.generateRange(startDate, endDate, 'd', 'L');
      //object d
      startDate = startDate.format('L'); //DD/MM/YYYY 20/11/2023
      endDate = endDate.format('L');
      const api = await MonitorApi.getVehicleInOutNumber({ startDate, endDate });
      const result = api.sort((a, b) => dayjs(a.date, 'L') - dayjs(b.date, 'L'));
      //hanlde Data

      const newData = [];
      const defaultValue = 0;
      dateArr.map((date) => {
        let value = null;
        const [el] = result.slice(0, 1);

        if (el && el.date === date) {
          result.shift();
          zones.map((zone) => {
            value = el.data[zone] || defaultValue;

            newData.push({
              date,
              value,
              zone,
              isData: true
            });
          });
        } else {
          zones.map((zone) => {
            value = defaultValue;
            newData.push({
              date,
              value,
              zone,
              isData: false
            });
          });
        }
      });

      setData(newData);
    } catch (error) {
      // ErrorService.hanldeError(error, actions.onNoti);
    }
  };

  useEffect(() => {
    callApi();
  }, [dates, state.parkingEvent]);

  return (
    <Card
      title={<Typography.Title level={4}>{lag('common:dashboard:staticCard')}</Typography.Title>}
      extra={
        <Space>
          <Typography.Text>{lag('common:time')}</Typography.Text>
          <CustomedDateRangePicker
            defaultValue={dates}
            onChange={onChangeDate}
            format={'L'}
            bordered={false}
            allowClear={false}
            suffixIcon={false}
            style={{ width: 220 }}
          />
        </Space>
      }
      className="card-main">
      <CardBlock>
        <div className="px-4">
          <Column {...config} />
        </div>
      </CardBlock>
    </Card>
  );
}

export default NumberStatisChart;
