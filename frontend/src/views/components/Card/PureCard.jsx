import React from 'react';
import { CustomedCard } from './style';
import { Flex, Popover, Row, Space, Typography } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { Button } from 'antd';

function PureCard({
  title,
  extra,
  children,
  disableExtra,
  classNames = {},
  className = '',
  setting,
  onChangeSetting
}) {
  return (
    <CustomedCard title={title} extra={extra} className={`border h-100 ${className}`}>
      {children}
    </CustomedCard>
  );
}

export default PureCard;
