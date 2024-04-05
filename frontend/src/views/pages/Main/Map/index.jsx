import React, { Suspense, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Layout, Flex, Radio, theme, Typography, Tag, Spin, Skeleton, Space } from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import { DetailFloorStyled, TransformBlock } from './style';
import { MapInteractionCSS } from 'react-map-interaction';
import { useSearchParams } from 'react-router-dom';
import { SLOTS_A } from './parkingA';
import { SLOTS_B } from './parkingB';
import { SLOTS_C } from './parkingC';
import CarA from '~/assets/images/blue-car.png';
import CarB from '~/assets/images/blue-car.png';
import CarC from '~/assets/images/blue-car.png';
import MapA from '~/assets/images/mapA.svg?react';
import MapB from '~/assets/images/mapB.svg?react';
import MapC from '~/assets/images/mapC.svg?react';
import MapA1 from '~/assets/images/mapA1.svg?react';
import MapB1 from '~/assets/images/mapB1.svg?react';
import MapC1 from '~/assets/images/mapC1.svg?react';
import Moto from '~/assets/images/TealMoto.svg?react';
import dayjs from 'dayjs';
import DetailSlot from './DetailSlot';
import AppContext from '~/context';
import { ParkingApi } from '~/api';

function Map({}) {
  const { token } = theme.useToken();
  const { colorBgContainer } = token;
  const { state, actions } = useContext(AppContext);
  let [searchParams, setSearchParams] = useSearchParams();
  const [slots, setSlots] = useState([]);
  const zone = searchParams.get('zone') || 'A';
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(false);
  const onChangeZone = (e) => {
    setSearchParams({ zone: e.target.value });
  };

  const callApi = async () => {
    try {
      setLoading(true);
      const api = await ParkingApi.getStatus({ zone });
      const newSlots = api[0].slots;
      setSlots(newSlots);
    } catch {
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // callApi();
  }, [state.parkingEvent]);

  useEffect(() => {
    // callApi();
  }, [zone]);

  return (
    <Layout className="px-4">
      <Header className="border-1" title={'Bản đồ'} />
      <Content className="w-100 py-3">
        <Space>
          <Radio.Group defaultValue={zone} buttonStyle="solid" onChange={onChangeZone}>
            <Radio.Button value="A">Khu A</Radio.Button>
            <Radio.Button value="A1">Khu A1</Radio.Button>
            <Radio.Button value="B">Khu B</Radio.Button>
            <Radio.Button value="B1">Khu B1</Radio.Button>
            <Radio.Button value="C">Khu C</Radio.Button>
            <Radio.Button value="C1">Khu C1</Radio.Button>
          </Radio.Group>
        </Space>
        <TransformBlock
          className="mt-2 overflow-hidden"
          style={{ backgroundColor: token.neutral5 }}>
          <Spin spinning={loading} wrapperClassName="h-100 w-100">
            <MapInteractionCSS minScale={0.4} maxScale={2}>
              <div className="map-wrapper">
                {useMemo(() => {
                  let vehicles;
                  let newWidth = 50;
                  let currMap;
                  switch (zone) {
                    case 'A':
                      vehicles = SLOTS_A;
                      newWidth = 52;
                      currMap = CarA;
                      break;
                    case 'B':
                      vehicles = SLOTS_B;
                      newWidth = 76;
                      currMap = CarB;
                      break;
                    case 'C':
                      vehicles = SLOTS_C;
                      newWidth = 68;
                      currMap = CarC;
                      break;
                  }

                  let map;
                  switch (zone) {
                    case 'A':
                      map = <MapA />;
                      break;
                    case 'B':
                      map = <MapB />;
                      break;
                    case 'C':
                      map = <MapC />;
                      break;
                    case 'A1':
                      map = <MapA1 />;
                    case 'B1':
                      map = <MapB1 />;
                    case 'C1':
                      map = <MapC1 />;
                  }

                  const newSlots = slots.map((slot, ix) => {
                    const [vehicle] = vehicles.filter((e) => e.position === slot.position);
                    if (vehicle) {
                      const { top, left, position, rotate } = vehicle;
                      const width = newWidth;
                      return (
                        <React.Fragment key={position + ix}>
                          <DetailFloorStyled
                            key={position + ix}
                            title={
                              <Flex justify="space-between">
                                <Typography.Title
                                  id="location"
                                  level={5}
                                  className="detail-slot-title my-0"
                                  style={{ color: token.green7 }}>
                                  {`Khu ${zone} - ${position}`}
                                </Typography.Title>
                                <Tag color="cyan">
                                  {dayjs(slot?.parkingTurn?.start, 'x').format('L LTS')}
                                </Tag>
                              </Flex>
                            }
                            content={
                              <DetailSlot
                                {...vehicle}
                                zone={zone}
                                vehicle={slot?.parkingTurn?.vehicles}
                                driver={slot?.parkingTurn?.persons}
                              />
                            }
                            overlayInnerStyle={{
                              border: '1px solid',
                              borderColor: token.cyan,
                              backgroundColor: token.cyan1,
                              boxShadow: token.boxShadowSecondary
                            }}
                            getPopupContainer={() => document.querySelector('#root')}>
                            <img
                              id={position}
                              key={zone + position + ix}
                              {...vehicle}
                              className="image-container"
                              src={currMap}
                              style={{
                                transform: `rotate(${rotate}deg)`,
                                width,
                                top,
                                left
                              }}
                            />
                          </DetailFloorStyled>
                        </React.Fragment>
                      );
                    }
                  });

                  return (
                    <>
                      {map} {newSlots}
                    </>
                  );
                }, [slots, zone])}
              </div>
            </MapInteractionCSS>
          </Spin>
        </TransformBlock>
      </Content>
      <Footer />
    </Layout>
  );
}

export default Map;
