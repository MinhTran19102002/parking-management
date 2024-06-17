import { Col, DatePicker, Form, Input, Select, Space, TimePicker, Typography } from 'antd';
import React, { useEffect } from 'react';

function Filter({ filter, onChange, filterList = [] }) {
  useEffect(() => {}, [JSON.stringify(filter)]);
  const onChangeItem = (value) => {
    console.log('On Chanegitem', value);
  };
  return (
    <div>
      {filterList.map((item, index) => {
        const { name } = item;
        const config = {
          value: filter[name]
        };
        return (
          <Space style={{ marginLeft: index && 16 }} direction="vertical">
            <Typography.Text>{item.name}</Typography.Text>
            <InputRender onChange={onChangeItem} item={item} {...config} />
          </Space>
        );
      })}
    </div>
  );
}

const InputRender = ({ item = {}, value, width = 200 }) => {
  let dom = null;
  let { inputProps, type } = item;
  inputProps = {
    ...inputProps,
    value
  };
  switch (type) {
    case 'select':
      dom = <Select {...inputProps} style={{ width: 200 }} />;
      break;

    case 'input':
      dom = <Input {...inputProps} style={{ width: 200 }} />;
      break;

    case 'datePicker':
      dom = <DatePicker {...inputProps} />;
      break;

    case 'timePicker':
      dom = <TimePicker {...inputProps} />;
      break;

    case 'range':
      dom = <DatePicker.RangePicker {...inputProps} />;
      break;
  }

  return dom;
};

export default Filter;
