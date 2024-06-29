import { TileLayout } from '@progress/kendo-react-layout';
import { Col, Layout, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { PageHeader } from '~/views/components';
import { Content, Footer, Header } from '~/views/layouts';
import { DefaultPosition } from './data';
import { GeneralCard, NumberStatisChart } from './components';
import RevenueChart from './components/RevenueChart';
import EventBlock from '~/views/components/Event';

const dynamicBlock = {
  resizable: false,
  reorderable: false,
  className: 'hide-header'
};

function Home({}) {
  const tileLayoutRef = useRef(null);
  const [layoutItems, setLayoutItems] = useState([]);

  const hanldeLayout = () => {
    const rs = [
      {
        body: <GeneralCard zone="A" />,
        ...dynamicBlock
      },
      {
        body: <GeneralCard zone="B" />,
        ...dynamicBlock
      },
      {
        body: <GeneralCard zone="C" />,
        ...dynamicBlock
      },
      {
        body: <NumberStatisChart />,
        ...dynamicBlock
      },
      {
        body: <RevenueChart />,
        ...dynamicBlock
      }
    ];

    setLayoutItems(rs);
  };

  useEffect(() => {
    hanldeLayout();
  }, []);

  return (
    <Content className="w-100 py-3">
      <Row id="dashboard-block" gutter={16}>
        <Col className="gutter-row" span={16}>
          <TileLayout
            ref={tileLayoutRef}
            columns={12}
            rowHeight={4}
            gap={{ rows: 16, columns: 16 }}
            id={'dashboardLayout'}
            positions={DefaultPosition}
            items={layoutItems}
            style={{
              padding: 0,
              width: '100%'
            }}
          />
        </Col>
        <Col className="gutter-row" span={8}>
          <EventBlock />
        </Col>
      </Row>
    </Content>
  );
}

export default Home;
