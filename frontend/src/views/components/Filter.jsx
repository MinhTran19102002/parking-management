import { Col, DatePicker, Form, Input, Select, Space, TimePicker, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const getValue = (name, values, format) => {
  let rs = values[name];
  switch (name) {
    case 'rangeDate':
      if (values.startDay && values.endDay)
        rs = [dayjs(values?.startDay, format), dayjs(values?.endDay, format)];
      break;
    case 'timePickerRange':
      if (values.startTime && values.endTime)
        rs = [dayjs(values?.startTime, format), dayjs(values?.endTime, format)];
      break;
  }

  return rs;
};

const onSubmit = (values = {}) => {
  let rs = {};
  for (let [key, value] of Object.entries(values)) {
    if (value) rs[key] = value;
  }
  return rs;
};

function Filter({ filter, onChange, filterList = [] }) {
  const { t: lag, i18n } = useTranslation();
  const onChangeItem = (name, value) => {
    let newValue = { [name]: value };
    switch (name) {
      case 'rangeDate':
        newValue = {
          startDay: value[0],
          endDay: value[1]
        };
        break;
      case 'timePickerRange':
        newValue = {
          startTime: value[0],
          endTime: value[1]
        };
        break;
    }
    onChange(onSubmit({ ...filter, ...newValue }));
  };
  return (
    <div>
      {filterList.map((item, index) => {
        const { name, inputProps } = item;
        const config = {
          value: getValue(name, filter, inputProps.format)
        };
        return (
          <Space key={name} style={{ marginLeft: index && 16 }} direction="vertical">
            <Typography.Text>{lag('common:' + item.name)}</Typography.Text>
            <InputRender onChange={(value) => onChangeItem(name, value)} item={item} {...config} />
          </Space>
        );
      })}
    </div>
  );
}

const InputRender = ({ item = {}, value, width = 200, onChange }) => {
  let dom = null;
  let { inputProps, type } = item;

  const onChangeEvent = (e) => {
    onChange(e.target.value);
  };
  const onChangeValue = (value) => {
    onChange(value);
  };

  const onClear = () => {
    onChange(null);
  };

  inputProps = {
    ...inputProps,
    defaultValue: value
  };
  if (inputProps.allowClear) inputProps.onClear = onClear;
  switch (type) {
    case 'select':
      dom = <Select onSelect={onChangeValue} {...inputProps} style={{ width: 200 }} />;
      break;

    case 'input':
      dom = <Input onPressEnter={onChangeEvent} {...inputProps} style={{ width: 200 }} />;
      break;

    case 'datePicker':
      dom = <DatePicker onChange={onChangeValue} {...inputProps} />;
      break;

    case 'timePicker':
      dom = (
        <TimePicker
          onChange={(value) => onChangeValue(value.format(inputProps.format))}
          {...inputProps}
        />
      );
      break;
    case 'timePickerRange':
      dom = (
        <TimePicker.RangePicker
          onChange={([t1, t2]) =>
            onChangeValue([t1.format(inputProps.format), t2.format(inputProps.format)])
          }
          {...inputProps}
        />
      );
      break;
    case 'range':
      dom = (
        <DatePicker.RangePicker
          onChange={([t1, t2]) =>
            onChangeValue([t1.format(inputProps.format), t2.format(inputProps.format)])
          }
          {...inputProps}
        />
      );
      break;
  }

  return dom;
};

export default Filter;
