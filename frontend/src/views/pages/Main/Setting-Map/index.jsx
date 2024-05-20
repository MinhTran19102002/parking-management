import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Layout, Flex, Radio, theme, Spin, Space, Button, Modal } from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import { TransformBlock } from './style';
import { MapInteractionCSS } from 'react-map-interaction';
import { useSearchParams } from 'react-router-dom';
import AppContext from '~/context';
import { CameraApi, ParkingApi } from '~/api';
import CameraLayer from '../Map/components/CameraLayer';
import { SettingOutlined } from '@ant-design/icons';
import { DISABLED_MAP_INTERACTION } from '../Map/data';
import CameraSide from '../Map/components/CameraSide';
import { useQuery } from '@tanstack/react-query';
import CameraSetting from '../Map/components/CameraSetting';
import MapLayer from '../Map/components/MapLayer';
import SlotLayer from '../Map/components/SlotLayer';
import SlotAssigend from '../Map/components/SlotAssigend';
import { ErrorService } from '~/services';

function SettingMap({}) {
  const { token } = theme.useToken();
  const { colorBgContainer } = token;
  const { state, actions } = useContext(AppContext);
  let [searchParams, setSearchParams] = useSearchParams();
  const [slots, setSlots] = useState([]);
  const zone = searchParams.get('zone') || 'A';
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(false);
  const cameraSettingRef = useRef(null);
  const [cameraForm, setCameraForm] = useState([]);
  const [settingMode, setSettingMode] = useState(false);
  const [cameraUnused, setCameraUnused] = useState([]);
  const [hoveredSlots, setHoveredSlots] = useState([]);
  const [openAssignedSlotModal, setOpenAssignedSlotModal] = useState(false);

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

  const { data: totalCameras, refetch: refetchCameraUsed } = useQuery({
    queryKey: ['camera', 'used'],
    initialData: [],
    queryFn: async () => {
      try {
        const api = await CameraApi.getByFilter();
        return api.data;
      } catch {}
    }
  });

  const cameraUsed = useMemo(() => {
    return totalCameras.filter((el) => el.zone);
  }, [totalCameras]);

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

  const hanldeMapSetting = useCallback(() => {
    cameraSettingRef.current.onEditManyCameras();
  });

  useEffect(() => {
    refetchCameraUsed();
  }, [settingMode]);

  const onDropCamera = (e) => {
    e.preventDefault();
    const cameraDroped = JSON.parse(e.dataTransfer.getData('cameraData'));
    cameraSettingRef.current.addCameraToZone(cameraDroped, zone);

    //remove camera
    const newUnusedCameras = cameraUnused.filter(
      (cameraItem) => cameraItem.cameraId !== cameraDroped.cameraId
    );
    setCameraUnused(newUnusedCameras);
  };

  const editManyCameras = useCallback(async (cameras) => {
    try {
      const api = await CameraApi.editMany(cameras);
      actions.onMess({ type: 'success', content: 'Cập nhật camera thành công' });
      setSettingMode(false);
    } catch {
      actions.onMess({ type: 'error', content: 'Cập nhật camera thấp bại' });
    }
  }, []);

  useEffect(() => {
    if (totalCameras.length > 0 && settingMode) {
      setCameraUnused(totalCameras.filter((item) => !item.zone));
    }
  }, [JSON.stringify(totalCameras), settingMode]);

  const onRemoveCameraFormMap = (newCamera) => {
    const rs = cameraUnused.slice();
    rs.push(newCamera);
    setCameraUnused(rs);
  };

  const onHoverCamera = (camera = {}) => {
    const { slots = [] } = camera;
    setHoveredSlots(slots);
  };

  return (
    <Layout className="px-4">
      <Modal
        title="Cài đặt camera và ô đỗ"
        width="fit-content"
        footer={null}
        open={openAssignedSlotModal}
        onCancel={() => setOpenAssignedSlotModal(false)}>
        <SlotAssigend
          zone={zone}
          triggerUpdateCamera={openAssignedSlotModal}
          onCancel={() => setOpenAssignedSlotModal(false)}
        />
      </Modal>
      <Header className="border-1" title={'Cài đặt bản đồ'} />
      <Content className="w-100 py-3">
        <Flex justify="space-between">
          <Space>
            <Radio.Group defaultValue={zone} buttonStyle="solid" onChange={onChangeZone}>
              <Radio.Button value="A">Khu A</Radio.Button>
              <Radio.Button value="A1">Khu A1</Radio.Button>
              <Radio.Button value="B">Khu B</Radio.Button>
              <Radio.Button value="B1">Khu B1</Radio.Button>
              <Radio.Button value="C">Khu C</Radio.Button>
              <Radio.Button value="C1">Khu C1</Radio.Button>
            </Radio.Group>
            <Button type="primary" onClick={() => setOpenAssignedSlotModal(true)}>
              Cài đặt ô đỗ
            </Button>
          </Space>
          <Space>
            {!settingMode ? (
              <Button icon={<SettingOutlined />} onClick={() => setSettingMode(true)}>
                Cài đặt
              </Button>
            ) : (
              <Space>
                <Button onClick={() => setSettingMode(false)}>Hủy bỏ</Button>
                <Button type="primary" onClick={hanldeMapSetting}>
                  Xác nhận
                </Button>
              </Space>
            )}
          </Space>
        </Flex>
        <TransformBlock
          className="mt-2 overflow-hidden"
          style={{ backgroundColor: token.neutral5 }}>
          <Spin spinning={loading} wrapperClassName="h-100 w-100">
            {settingMode && <CameraSide defaultData={cameraUnused} />}
            <MapInteractionCSS
              {...DISABLED_MAP_INTERACTION(settingMode)}
              minScale={0.4}
              maxScale={2}>
              <div
                className="map-wrapper"
                onDrop={onDropCamera}
                onDragOver={(e) => e.preventDefault()}>
                {settingMode ? (
                  <CameraSetting
                    settingMode={settingMode}
                    zone={zone}
                    cameraUsed={cameraUsed}
                    setCameraUnused={setCameraUnused}
                    ref={cameraSettingRef}
                    editManyCameras={editManyCameras}
                    onRemoveCameraFormMap={onRemoveCameraFormMap}
                  />
                ) : (
                  <CameraLayer
                    zone={zone}
                    settingMode={settingMode}
                    data={totalCameras}
                    onHoverCamera={onHoverCamera}
                  />
                )}
                <SlotLayer zone={zone} hoveredSlots={hoveredSlots} />
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

export default SettingMap;
