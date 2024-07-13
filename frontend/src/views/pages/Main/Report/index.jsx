import React, { useContext, useEffect } from 'react';
import InteractiveGridLayout from '~/views/components/InteractiveGridLayout';
import { Content } from '~/views/layouts';
import General from './components/General';
import InOutByTime from './components/InoutByTime';
import InoutByJob from './components/InoutByJob';
import VisistorRate from './components/VisistorRate';
import TopDriver from './components/TopDriver';
import InoutByDepartment from './components/InoutByDepartment';
import { Button, Popconfirm } from 'antd';
import DatePickerWithUnit from '~/views/components/DatePickerWithUnit';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { MonitorApi } from '~/api';
import { FileExcelOutlined } from '@ant-design/icons';
import AppContext from '~/context';
import { ChartService, ErrorService } from '~/services';
import { useQuery } from '@tanstack/react-query';

const dynamicBlock = {};
function Report({}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state, actions } = useContext(AppContext);
  const { departments, jobs } = state;
  const { t: lag } = useTranslation();
  const params = {
    start: dayjs().add(-30, 'd').format('L'),
    end: dayjs().format('L'),
    timeType: 'date'
  };
  for (let [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  const { start, end, timeType } = params;

  const {
    data: generalData,
    refetch: refetchGeneral,
    isRefetching: generalLoading
  } = useQuery({
    queryKey: ['Report', 'General'],
    queryFn: async () => {
      let rs = [];
      try {
        const api = await MonitorApi.getReportGeneral(params);
        rs = state.zones.map((zone) => {
          return (
            api.find((el) => el.zone === zone) || {
              zone,
              entries: 0,
              exists: 0,
              fee: 0,
              averageDuration: 0
            }
          );
        });
      } catch {}
      return rs;
    }
  });

  const {
    data: inoutDepartmentData,
    refetch: refetchDepartment,
    isRefetching: departmentLoading
  } = useQuery({
    queryKey: ['Report', 'InOutByDepartment'],
    queryFn: async () => {
      let rs = [];
      try {
        const xFileds = departments;
        const types = ['turn'];
        const xField = 'department',
          yField = 'value',
          seriesField = 'type';
        const api = await MonitorApi.getInoutByDepartments({ ...params, xFileds, types });
        const newData = [];
        xFileds.map((dateTime) => {
          const item = api.find((el) => dateTime === el[xField]) || {};
          const dt = item?.value;
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

  const {
    data: inoutByJobData,
    refetch: refetchByJob,
    isRefetching: byJobLoading
  } = useQuery({
    queryKey: ['Report', 'InOutByJobs'],
    initialData: [],
    queryFn: async () => {
      let rs = [];
      try {
        const angleField = 'value',
          colorField = 'type';
        const api = await MonitorApi.getInoutByJob({ ...params, jobs });
        rs = api.map((item) => {
          return {
            [colorField]: item.job,
            [angleField]: item.value
          };
        });
      } catch (error) {
        console.log(error);
      }
      return rs;
    }
  });

  const {
    data: inoutByTime,
    refetch: refetchByTime,
    isRefetching: byTimeLoading
  } = useQuery({
    queryKey: ['Report', 'InOutByTime'],
    initialData: [],
    queryFn: async () => {
      let rs = [];
      try {
        const xField = 'date',
          yField = 'value',
          seriesField = 'type';
        const types = ['turn'];
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

  const {
    data: topDriverData,
    refetch: refetchTopDriver,
    isRefetching: topDriverLoading
  } = useQuery({
    initialData: [],
    queryKey: ['Report', 'TopDriver'],
    queryFn: async () => {
      let rs = [];
      try {
        const api = await MonitorApi.getMostParkedVehicle(params);
        rs = api.map((item) => {
          return {
            licenePlate: item.vehicle.licenePlate,
            name: item.driver.name,
            turn: item.turn
          };
        });
      } catch {}
      return rs;
    }
  });

  const {
    data: visistorData,
    refetch: refetchVisistorData,
    isRefetching: visistorLoading
  } = useQuery({
    initialData: [],
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

  const getTileLayout = () => [
    {
      body: <General id="general" params={params} data={generalData} loading={generalLoading} />,
      ...dynamicBlock
    },
    {
      body: (
        <VisistorRate
          data={visistorData}
          loading={visistorLoading}
          id="visitorRate"
          params={params}
        />
      ),
      ...dynamicBlock
    },
    {
      body: (
        <InOutByTime data={inoutByTime} loading={byTimeLoading} id="inoutByTime" params={params} />
      ),
      ...dynamicBlock
    },
    {
      body: (
        <InoutByJob data={inoutByJobData} loading={byJobLoading} id="inoutByJob" params={params} />
      ),
      ...dynamicBlock
    },
    {
      body: (
        <TopDriver data={topDriverData} loading={topDriverLoading} id="topDriver" params={params} />
      ),
      ...dynamicBlock
    },
    {
      body: (
        <InoutByDepartment
          data={inoutDepartmentData}
          loading={departmentLoading}
          id="inoutByUnit"
          params={params}
        />
      ),
      ...dynamicBlock
    }
  ];

  const onExport = async () => {
    try {
      const api = await MonitorApi.exportReport(params);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([api]));
      link.download = `Report_${params.timeType}_${params.start}_${params.end}.xlsx`;
      link.click();
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    }
  };

  const onChangeFilter = (values) => {
    setSearchParams(values);
  };

  useEffect(() => {
    refetchGeneral();
    refetchDepartment();
    refetchByJob();
    refetchByTime();
    refetchTopDriver();
    refetchVisistorData();
  }, [JSON.stringify(params)]);
  return (
    <Content className="w-100 py-3">
      <InteractiveGridLayout
        title={
          <DatePickerWithUnit
            name={['timeType', 'start', 'end']}
            {...params}
            unit={params.timeType}
            onChange={onChangeFilter}
          />
        }
        extra={
          <Popconfirm
            title={lag('common:popup:sure')}
            onConfirm={onExport}
            okText={lag('common:confirm')}
            cancelText={lag('common:cancel')}>
            <Button icon={<FileExcelOutlined />} onClick={onExport}>
              {lag('common:dashboard:exportReport')}
            </Button>
          </Popconfirm>
        }
        layoutKey="Report"
        rowHeight={80}>
        {getTileLayout().map((el, ix) => (
          <div key={`card${ix}`}>{el.body}</div>
        ))}
      </InteractiveGridLayout>
    </Content>
  );
}

export default Report;
