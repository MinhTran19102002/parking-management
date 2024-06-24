import { Button, Divider, Flex, Popconfirm, Row, Skeleton, Space, Typography, theme } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { List } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import EventCard from './EventCard';
import { MonitorApi } from '~/api';
import { ErrorService } from '~/services';
import AppContext from '~/context';
import { useContext } from 'react';
import { FileExcelOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

let pageSize = 30;
const loadMoreCount = 10;
function EventBlock({}) {
  const { state, actions } = useContext(AppContext);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const { token } = theme.useToken();
  const [pageIndex, setPageIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const isMounted = useRef(false);
  const { t: lag } = useTranslation();
  const { geekblue6, blue2, colorTextSecondary, colorText, gold2, gold7 } = token;
  const inColor = {
    primary: geekblue6,
    secondary: blue2
  };
  const outColor = {
    primary: gold7,
    secondary: gold2
  };
  const onScroll = (e) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === 400) {
      appendData();
    }
  };

  const callApi = async (pageIndex, pageSize, hanldeData) => {
    try {
      const api = await MonitorApi.getEvents({ pageSize, pageIndex });
      setData(api.data);
      setTotalCount(api.totalCount);
    } catch (error) {
      // ErrorService.hanldeError(error, actions.onNoti);
    } finally {
    }
  };

  const onLoadMore = async () => {
    callApi(pageIndex, (data.length += loadMoreCount), (newData) => {
      setData(newData);
    });
  };

  useEffect(() => {
    callApi(pageIndex, pageSize, (newData) => {
      setData(newData);
    });
  }, [state.parkingEvent]);

  const onExport = async () => {
    try {
      const api = await MonitorApi.export();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([api]));
      link.download = `output.xlsx`;
      link.click();
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    }
  };

  return (
    <div>
      <Row justify="space-between" className="pe-4">
        <Typography.Title level={4}>Sự kiện</Typography.Title>
        <Popconfirm
          title={lag('common:popup:sure')}
          onConfirm={onExport}
          okText={lag('common:confirm')}
          cancelText={lag('common:cancel')}>
          <Button icon={<FileExcelOutlined />} size="large">
            {lag('common:dashboard:exportReport')}
          </Button>
        </Popconfirm>
      </Row>
      <div
        id="scrollableDiv"
        className="mt-2"
        style={{
          height: 'calc(100vh - 172px)',
          overflow: 'auto'
        }}>
        <InfiniteScroll
          dataLength={data.length}
          hasMore={data.length < totalCount}
          next={onLoadMore}
          loader={
            <Skeleton
              avatar
              paragraph={{
                rows: 1
              }}
              active
            />
          }
          endMessage={<Divider plain>{lag('common:dashboard:noEvent')}</Divider>}
          scrollableTarget="scrollableDiv">
          <List
            dataSource={data}
            split={false}
            renderItem={(item, index) => {
              const color = item.type === 'in' ? inColor : outColor;
              return (
                <List.Item key={item.email + index}>
                  <EventCard item={item} />
                </List.Item>
              );
            }}
          />
        </InfiniteScroll>
      </div>
      {/* <List split={false}>
        <VirtualList
          data={data}
          height={720}
          onScroll={onScroll}
          rowKey={(d) => {
            console.log(d);
            return 1;
          }}>
          {(item, index) => {
            const color = item.type === 'in' ? inColor : outColor;
            return (
              <List.Item>

              </List.Item>
            );
          }}
        </VirtualList>
      </List> */}
    </div>
  );
}

export default EventBlock;
