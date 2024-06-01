import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Layout, Flex, Radio, theme, Spin } from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import { TransformBlock } from './style';
import { MapInteractionCSS } from 'react-map-interaction';
import { useSearchParams } from 'react-router-dom';
import AppContext from '~/context';
import { CameraApi, ParkingApi } from '~/api';
import { useQuery } from '@tanstack/react-query';
import SlotLayer from '../../Main/Map/components/SlotLayer';
import MapLayer from '../../Main/Map/components/MapLayer';
import Typography from 'antd/es/typography/Typography';

function Map({}) {
  const { token } = theme.useToken();
  const { state, actions } = useContext(AppContext);
  let [searchParams, setSearchParams] = useSearchParams();
  const { data: slots, refetch: refetchSlots } = useQuery({
    queryKey: ['map', 'slots', 'drivers'],
    initialData: [],
    queryFn: async () => {
      let rs = [];
      try {
        setLoading(true);
        const api = await ParkingApi.getStatusByDriver({ zone, phone: '0357647771' });
        rs = api.slots;
      } catch {
      } finally {
        setLoading(false);
      }
      return rs;
    }
  });
  console.log(slots);
  const zone = searchParams.get('zone') || 'A';
  const [loading, setLoading] = useState(false);
  const [hoverCamera, setHoverCamera] = useState();
  const [hoveredSlots, setHoveredSlots] = useState([]);

  // const { data: cameraUnused, refetch: refetchCameraUnused } = useQuery({
  //   queryKey: ['camera', 'unused'],
  //   initialData: [],
  //   queryFn: async () => {
  //     if (settingMode)
  //       try {
  //         const api = await CameraApi.getUnused();
  //         return api.data;
  //       } catch {}
  //     return [];
  //   }
  // });

  const { data: cameras, refetch: refetchCameraUsed } = useQuery({
    queryKey: ['camera', 'used'],
    initialData: [],
    queryFn: async () => {
      try {
        const api = await CameraApi.getByFilter();
        return api.data;
      } catch {}
      return [];
    }
  });

  const onChangeZone = (e) => {
    setSearchParams({ zone: e.target.value });
  };

  useEffect(() => {
    refetchSlots();
  }, [zone, state.parkingEvent]);

  const onHoverCamera = (camera = {}) => {
    const { slots = [] } = camera;
    setHoveredSlots(slots);
  };
  return (
    <Layout className="px-4">
      <Header className="border-1" title={'Bản đồ'} />
      <Content className="w-100 py-3">
        <Flex justify="space-between">
          <Radio.Group defaultValue={zone} buttonStyle="solid" onChange={onChangeZone}>
            <Radio.Button value="A">Khu A</Radio.Button>
            <Radio.Button value="A1">Khu A1</Radio.Button>
            <Radio.Button value="B">Khu B</Radio.Button>
            <Radio.Button value="B1">Khu B1</Radio.Button>
            <Radio.Button value="C">Khu C</Radio.Button>
            <Radio.Button value="C1">Khu C1</Radio.Button>
          </Radio.Group>
        </Flex>
        <Typography.Title></Typography.Title>
        <TransformBlock
          className="mt-2 overflow-hidden"
          style={{ backgroundColor: token.neutral5 }}>
          <Spin spinning={loading} wrapperClassName="h-100 w-100">
            <MapInteractionCSS minScale={0.4} maxScale={2}>
              <div className="map-wrapper">
                <SlotLayer zone={zone} vehicles={slots} hoveredSlots={hoveredSlots} />
                <MapLayer zone={zone} />
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
