import React from 'react';
import InteractiveGridLayout from '~/views/components/InteractiveGridLayout';
import { Content } from '~/views/layouts';
import General from './components/General';
import InOutByTime from './components/InoutByTime';
import InoutByJob from './components/InoutByJob';
import VisistorRate from './components/VisistorRate';
import TopDriver from './components/TopDriver';
import InoutByDepartment from './components/InoutByDepartment';
import { Button } from 'antd';
import DatePickerWithUnit from '~/views/components/DatePickerWithUnit';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

const dynamicBlock = {};
function Report({}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = {
    start: dayjs().add(-30, 'd').format('L'),
    end: dayjs().format('L'),
    unit: 'date'
  };
  for (let [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  const getTileLayout = () => [
    {
      body: <General id="general" />,
      ...dynamicBlock
    },
    {
      body: <VisistorRate id="visitorRate" />,
      ...dynamicBlock
    },
    {
      body: <InOutByTime id="inoutByTime" />,
      ...dynamicBlock
    },
    {
      body: <InoutByJob id="inoutByJob" />,
      ...dynamicBlock
    },
    {
      body: <TopDriver id="topDriver" />,
      ...dynamicBlock
    },
    {
      body: <InoutByDepartment id="inoutByUnit" />,
      ...dynamicBlock
    }
  ];

  const onChangeFilter = (values) => {
    setSearchParams(values);
  };
  return (
    <Content className="w-100 py-3">
      <InteractiveGridLayout
        title={
          <DatePickerWithUnit
            name={['unit', 'start', 'end']}
            {...params}
            onChange={onChangeFilter}
          />
        }
        layoutKey="Dashboard"
        rowHeight={80}>
        {getTileLayout().map((el, ix) => (
          <div key={`card${ix}`}>{el.body}</div>
        ))}
      </InteractiveGridLayout>
    </Content>
  );
}

export default Report;
