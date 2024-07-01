import React, { memo } from 'react';
import { DatePicker, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const DEFAULT_FORMAT = 'DD/MM/YYYY';
const DAY = 'date';
const MONTH = 'month';
const YEAR = 'year';

const getProps = (unit) => {
  let start;
  let end;
  let format = 'L';
  const picker = unit;

  switch (unit) {
    case DAY:
      start = dayjs().subtract(30, 'days').format(DEFAULT_FORMAT);
      end = dayjs().format(DEFAULT_FORMAT);
      format = 'DD/MM/YYYY';
      break;
    case MONTH:
      format = 'MM/YYYY';
      start = dayjs().subtract(12, 'months').startOf('month').format(format);
      end = dayjs().endOf('month').format(format);
      break;
    case YEAR:
      format = 'YYYY';
      start = dayjs().subtract(5, 'years').startOf('year').format(format);
      end = dayjs().endOf('year').format(format);
      break;
  }

  return {
    start,
    end,
    format,
    picker
  };
};

function DatePickerWithUnit({
  name = ['timeType', 'startDate', 'endDate'],
  unit,
  start,
  end,
  onChange
}) {
  const [unitName, startName, endName] = name;
  const { t: lag } = useTranslation();
  const dpProps = getProps(unit);
  const changeUnit = (value) => {
    const { start, end } = getProps(value);
    onChange({
      [unitName]: value,
      [startName]: start,
      [endName]: end
    });
  };

  const changeDate = (dates) => {
    const values = dates.map((date) => date.format(dpProps.format));
    onChange({
      [unitName]: unit,
      [startName]: values[0],
      [endName]: values[1]
    });
  };

  return (
    <Space.Compact size={'middle'}>
      <Select
        id="selectUnit"
        value={unit}
        style={{ width: 120 }}
        onChange={changeUnit}
        placeholder="Đơn vị"
        options={GetUnitSelect(lag)}
      />

      <DatePicker.RangePicker
        id={'pickerDateRange'}
        allowEmpty={false}
        value={[dayjs(start, dpProps.format), dayjs(end, dpProps.format)]}
        format={dpProps.format}
        onChange={changeDate}
        style={{ width: 240 }}
        picker={dpProps.picker}
      />
    </Space.Compact>
  );
}

const GetUnitSelect = (t) => [
  {
    id: 'optionDateUnit',
    value: 'date',
    label: t('common:times:date')
  },
  {
    id: 'optionMonthUnit',
    value: 'month',
    label: t('common:times:month')
  }
];

export default DatePickerWithUnit;
