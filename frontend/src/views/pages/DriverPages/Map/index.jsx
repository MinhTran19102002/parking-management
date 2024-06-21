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
import { useTranslation } from 'react-i18next';

function Map({}) {
  const { token } = theme.useToken();
  const { state, actions } = useContext(AppContext);
  let [searchParams, setSearchParams] = useSearchParams();
  const { t: lag } = useTranslation();
  const { data: slotsData, refetch: refetchSlots } = useQuery({
    queryKey: ['map', 'slots', 'drivers'],
    initialData: [],
    queryFn: async () => {
      let rs = [];
      try {
        setLoading(true);
        const api = await ParkingApi.getStatusByDriver({ phone: '0357647771' });
        rs = api.reduce((acc, curr) => {
          acc.push(
            ...curr.slots.map((slot) => {
              return {
                ...slot,
                zone: curr.zone
              };
            })
          );
          return acc;
        }, []);
      } catch {
      } finally {
        setLoading(false);
      }
      return rs;
    }
  });
  const personalSlot = slotsData.find((slot) => slot.parkingTurn);
  const zone = searchParams.get('zone') || 'A';
  const slots = slotsData.filter((slot) => slot?.zone === zone);
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
    <Content className="w-100 py-3">
      <Flex justify="space-between">
        <Radio.Group defaultValue={zone} buttonStyle="solid" onChange={onChangeZone}>
          {state.zones.map((zone) => (
            <Radio.Button value={zone}>{lag('common:zoneName', { zone })}</Radio.Button>
          ))}
        </Radio.Group>
      </Flex>
      {personalSlot ? (
        <Typography.Title level={2} className="mt-2">
          {lag('common:yourCarStatus', { ...personalSlot })}
        </Typography.Title>
      ) : (
        <Typography.Title level={2}>{lag('common:yourCarStatus:carNotZone')}</Typography.Title>
      )}

      <TransformBlock className="mt-2 overflow-hidden" style={{ backgroundColor: token.neutral5 }}>
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
  );
}

export default Map;
