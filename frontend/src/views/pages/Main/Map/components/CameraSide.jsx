import React, { forwardRef, memo, useEffect, useImperativeHandle, useState } from 'react';
import { CameraSidebarStyled } from '../style';
import { Button, Divider, Flex, List, Skeleton, Space, theme } from 'antd';
import { CameraOutlined, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { CameraCard } from '~/views/components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CameraApi } from '~/api';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'react-i18next';

function CameraSide({ defaultExpand = true, settingMode, defaultData = [] }) {
  const [data, setData] = useState(defaultData);
  const [expand, setExpand] = useState(defaultExpand);
  const { token } = theme.useToken();
  const { t: lag } = useTranslation();

  useEffect(() => {
    setData(defaultData);
  }, [defaultData]);

  return (
    <CameraSidebarStyled style={{ position: 'fixed', top: 120, right: 32, zIndex: 1 }}>
      <Button icon={<CameraOutlined />} onClick={() => setExpand((prev) => !prev)}>
        <Space>
          {lag('common:mapPage:cameraList')}
          {expand ? (
            <CaretDownOutlined style={{ margin: 'auto' }} />
          ) : (
            <CaretUpOutlined style={{ margin: 'auto' }} />
          )}
        </Space>
      </Button>
      <div
        className="fixed-block-content mt-2 px-2 py-2"
        style={{
          display: expand ? 'block' : 'none',
          overflow: 'auto',
          boxShadow: token.boxShadow,
          backgroundColor: token.colorBgBase,
          height: 640,
          width: 400
        }}>
        <InfiniteScroll
          dataLength={data.length}
          loader={
            <Skeleton
              avatar
              paragraph={{
                rows: 1
              }}
              active
            />
          }
          endMessage={<Divider plain>{lag('common:skip')}</Divider>}
          scrollableTarget="scrollableDiv">
          <List
            dataSource={data}
            split
            size="small"
            renderItem={(cameraItem, index) => {
              return (
                <List.Item key={'cameraItem' + index}>
                  <CameraCard {...cameraItem} dragable />
                </List.Item>
              );
            }}
          />
        </InfiniteScroll>
      </div>
    </CameraSidebarStyled>
  );
}

export default memo(CameraSide);
