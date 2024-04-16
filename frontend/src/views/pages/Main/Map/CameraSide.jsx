import React, { useState } from 'react';
import { CameraSidebarStyled } from './style';
import { Button, Divider, Flex, List, Skeleton, Space, theme } from 'antd';
import { CameraOutlined, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { CameraCard } from '~/views/components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CameraApi } from '~/api';
import InfiniteScroll from 'react-infinite-scroll-component';

function CameraSide({ defaultExpand = true, settingMode, data=[] }) {
  const [expand, setExpand] = useState(defaultExpand);
  const { token } = theme.useToken();
  return (
    <CameraSidebarStyled>
      <Button icon={<CameraOutlined />} onClick={() => setExpand((prev) => !prev)}>
        <Space>
          Danh sách camera{' '}
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
          width: 400,
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
          endMessage={<Divider plain>Hết</Divider>}
          scrollableTarget="scrollableDiv">
          <List
            dataSource={data}
            split
            size="small"
            renderItem={(cameraItem, index) => {
              return (
                <List.Item key={'cameraItem' + index}>
                  <CameraCard {...cameraItem} />
                </List.Item>
              );
            }}
          />
        </InfiniteScroll>
      </div>
    </CameraSidebarStyled>
  );
}

export default CameraSide;
