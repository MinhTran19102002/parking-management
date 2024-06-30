import { Col, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Content } from '~/views/layouts';
import { GeneralCard, NumberStatisChart } from './components';
import RevenueChart from './components/RevenueChart';
import EventBlock from '~/views/components/Event';
import InteractiveGridLayout from '~/views/components/InteractiveGridLayout';

const dynamicBlock = {
  resizable: false,
  reorderable: false,
  className: 'hide-header'
};

function Home({}) {
  const tileLayoutRef = useRef(null);
  const [layoutItems, setLayoutItems] = useState([]);

  const getTileLayout = () => [
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

  const hanldeLayout = () => {
    const rs = [];

    setLayoutItems(rs);
  };

  useEffect(() => {
    hanldeLayout();
  }, []);

  return (
    <Content className="w-100 py-3">
      <Row id="dashboard-block" gutter={16}>
        <Col className="gutter-row" span={16}>
          <InteractiveGridLayout layoutKey="Dashboard" rowHeight={80}>
            {getTileLayout().map((el, ix) => (
              <div key={`card${ix}`}>{el.body}</div>
            ))}
          </InteractiveGridLayout>
        </Col>
        <Col className="gutter-row" span={8}>
          <EventBlock />
        </Col>
      </Row>
    </Content>
  );
}

export default Home;
