import { useQuery } from '@tanstack/react-query';
import { List, Row } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MonitorApi } from '~/api';
import { FormatNumber } from '~/services';
import { PureCard } from '~/views/components/Card';

function TopDriver({ id, params, data = [], loading }) {
  const { t: lag } = useTranslation();
  return (
    <PureCard title={lag(`common:reportPage:${id}`)} className="card-main">
      <div
        id="scrollableDiv"
        className="mt-2"
        style={{
          height: 'auto',
          overflow: 'hidden'
        }}>
        <InfiniteScroll scrollableTarget="scrollableDiv" dataLength={data.length}>
          <List
            size="small"
            dataSource={data}
            renderItem={(item, index) => {
              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={index + 1}
                    title={`${item.licenePlate}`}
                    description={`${item.name}, ${FormatNumber(Number(item.turn).toFixed(), { isEndZeroDecimal: false })} ${lag('common:turn').toLocaleLowerCase()}`}
                  />
                </List.Item>
              );
            }}
          />
        </InfiniteScroll>
      </div>
    </PureCard>
  );
}

export default TopDriver;
