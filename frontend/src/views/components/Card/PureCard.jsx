import React from 'react';
import { CustomedCard } from './style';
import { Flex, Popover, Row, Space, Typography } from 'antd';
import Icon, { MenuOutlined, MoreOutlined } from '@ant-design/icons';
import { Button } from 'antd';

function PureCard({
  title,
  extra,
  children,
  disableExtra,
  classNames = {},
  className = '',
  setting,
  onChangeSetting,
  ...props
}) {
  return (
    <CustomedCard
      title={title}
      extra={
        <Space>
          {extra}{' '}
          <div className="draggable-handle cursor-move">
            <Icon component={MenuOutlined} style={{fontSize: 20}} />
          </div>
        </Space>
      }
      className={`border h-100 ${className}`}
      {...props}
      classNames={classNames}>
      {children}
    </CustomedCard>
  );
}

export default PureCard;
