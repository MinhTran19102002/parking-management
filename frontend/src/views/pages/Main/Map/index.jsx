import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Layout, Flex, Radio, theme, Spin } from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import { TransformBlock } from './style';
import { MapInteractionCSS } from 'react-map-interaction';
import { useSearchParams } from 'react-router-dom';
import AppContext from '~/context';
import { CameraApi, ParkingApi } from '~/api';
import CameraLayer from './components/CameraLayer';
import VehicleLayer from './components/VehicleLayer';
import { DISABLED_MAP_INTERACTION } from './data';
import CameraSide from './components/CameraSide';
import { useQuery } from '@tanstack/react-query';
import CameraSetting from './components/CameraSetting';
import MapLayer from './components/MapLayer';
import SlotLayer from './components/SlotLayer';
import VideoBlock from '~/views/components/VideoBlock';

function Map({}) {
  const { token } = theme.useToken();
  const { state, actions } = useContext(AppContext);
  let [searchParams, setSearchParams] = useSearchParams();
  const [slots, setSlots] = useState([]);
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
    callApi();
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
            <Radio.Button value="B">Khu B</Radio.Button>
            <Radio.Button value="C">Khu C</Radio.Button>
          </Radio.Group>
        </Flex>
        <TransformBlock
          className="mt-2 overflow-hidden"
          style={{ backgroundColor: token.neutral5 }}>
          <Spin spinning={loading} wrapperClassName="h-100 w-100">
            <MapInteractionCSS minScale={0.4} maxScale={2}>
              <div className="map-wrapper">
                <CameraLayer zone={zone} data={cameras} onHoverCamera={onHoverCamera} />
                <MapLayer zone={zone} />
                <SlotLayer zone={zone} vehicles={slots} hoveredSlots={hoveredSlots} />
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
