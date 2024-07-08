import React, { useContext } from 'react';
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
import { ErrorService } from '~/services';

const dynamicBlock = {};
function Report({}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { actions } = useContext(AppContext);
  const { t: lag } = useTranslation();
  const params = {
    start: dayjs().add(-30, 'd').format('L'),
    end: dayjs().format('L'),
    timeType: 'date'
  };
  for (let [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  const getTileLayout = () => [
    {
      body: <General id="general" params={params} />,
      ...dynamicBlock
    },
    {
      body: <VisistorRate id="visitorRate" params={params} />,
      ...dynamicBlock
    },
    {
      body: <InOutByTime id="inoutByTime" params={params} />,
      ...dynamicBlock
    },
    {
      body: <InoutByJob id="inoutByJob" params={params} />,
      ...dynamicBlock
    },
    {
      body: <TopDriver id="topDriver" params={params} />,
      ...dynamicBlock
    },
    {
      body: <InoutByDepartment id="inoutByUnit" params={params} />,
      ...dynamicBlock
    }
  ];

  const onExport = async () => {
    try {
      const api = await MonitorApi.exportReport(params);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([api]));
      link.download = `output.xlsx`;
      link.click();
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    }
  };

  const onChangeFilter = (values) => {
    setSearchParams(values);
  };
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
