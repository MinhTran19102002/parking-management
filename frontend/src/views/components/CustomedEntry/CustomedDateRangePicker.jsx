import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function CustomedDateRangePicker({ limit = [14, 'd'], ...restProps }) {
  const { value } = restProps;
  const [disabledDate, setDisabledDate] = useState(false);
  const { t: lag } = useTranslation();

  const onCalendarChange = (values, _, info) => {
    const [start, end] = values;
    const { range } = info;

    if (range === 'start') {
      const newDisable = (current) => {
        return current && current > (start.add(14, 'd') || curr > dayjs());
      };
      setDisabledDate(newDisable);
    } else {
    }
  };

  return (
    <DatePicker.RangePicker
      {...restProps}
      onCalendarChange={onCalendarChange}
      disabledDate={(current) => {
        return current > dayjs();
      }}
      presets={[
        {
          label: lag('common:timePicker:7'),
          value: [dayjs().add(-7, 'd'), dayjs()]
        },
        {
          label: lag('common:timePicker:14'),
          value: [dayjs().add(-14, 'd'), dayjs()]
        },
        {
          label: lag('common:timePicker:21'),
          value: [dayjs().add(-21, 'd'), dayjs()]
        },
        {
          label: lag('common:timePicker:1Month'),
          value: [dayjs().add(-1, 'M'), dayjs()]
        }
      ]}
    />
  );
}

export default CustomedDateRangePicker;
