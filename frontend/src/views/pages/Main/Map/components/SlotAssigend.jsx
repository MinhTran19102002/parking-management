import React, { useContext, useEffect, useMemo, useState } from 'react';
import SlotLayer from './SlotLayer';
import MapLayer from './MapLayer';
import { useQuery } from '@tanstack/react-query';
import { CameraApi } from '~/api';
import CameraLayer from './CameraLayer';
import { SLOTS_C } from '../data/parkingC';
import { SLOTS_B } from '../data/parkingB';
import { SLOTS_A } from '../data/parkingA';
import { GetSlots } from '../data';
import { Button, Flex, Space } from 'antd';
import AppContext from '~/context';
import { ErrorService } from '~/services';
import { useTranslation } from 'react-i18next';

const SLOTS = GetSlots();
function SlotAssigend({ onCancel, triggerUpdateCamera, zone }) {
  const { actions } = useContext(AppContext);
  const [hoveredSlots, setHoveredSlots] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState();
  const [selectedSlots, setSelectedSlots] = useState([]);
  const { t: lag } = useTranslation();
  const checkableSlots = useMemo(() => {
    if (!selectedCamera) return [];
    const unselectedCamera = cameras.filter((el) => el.cameraId !== selectedCamera) || [];
    const unSlots = unselectedCamera.reduce((acc, curr) => {
      acc.push(...(curr.slots || []));
      return acc;
    }, []);
    return SLOTS.filter((slot) => !unSlots.includes(slot));
  }, [JSON.stringify(selectedCamera)]);

  const onHoverCamera = (camera = {}) => {
    const { slots = [] } = camera;
    setHoveredSlots(slots);
  };

  const onCheckSlot = (isCheck, checkedSlot) => {
    const index = cameras.findIndex((el) => el.cameraId === selectedCamera);
    if (index !== -1) {
      const selectedCam = cameras[index];
      const { slots = [] } = selectedCam;
      const newSlots = isCheck ? [...slots, checkedSlot] : slots.filter((el) => el !== checkedSlot);
      selectedCam.slots = newSlots;
      const newCameras = cameras.slice();
      newCameras[index] = selectedCam;
      setCameras(newCameras);
    }
  };

  useEffect(() => {
    if (selectedCamera) {
      const { slots = [] } = cameras.find((el) => el.cameraId === selectedCamera);
      setSelectedSlots(slots);
    }
  }, [selectedCamera, JSON.stringify(cameras)]);

  const callApi = async () => {
    try {
      const api = await CameraApi.getByFilter();
      setCameras(api.data || []);
    } catch {}
  };

  useEffect(() => {
    callApi();
  }, [triggerUpdateCamera]);

  const submit = async () => {
    try {
      await CameraApi.editMany(cameras);
      actions.onNoti({ message: 'Chỉnh sửa camera thành công', type: 'success' });
      setSelectedCamera(null);
      onCancel();
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    }
  };

  return (
    <div id="slotAssigned" style={{ position: 'relative' }}>
      <SlotLayer
        zone={zone}
        checkedSlots={selectedSlots}
        hoveredSlots={hoveredSlots}
        onCheckSlot={onCheckSlot}
        checkable
        checkableSlots={checkableSlots}
      />
      <MapLayer zone={zone} />
      <CameraLayer
        zone={zone}
        data={cameras}
        selectable
        onClick={(cameraId) => setSelectedCamera((pre) => pre !== cameraId && cameraId)}
        onHoverCamera={onHoverCamera}
        selectedCameraId={selectedCamera}
      />

      <Flex className="w-100 mt-4">
        <Space style={{ marginLeft: 'auto' }}>
          <Button onClick={onCancel}>{lag('common:cancel')}</Button>
          <Button onClick={submit} type="primary">
            Xác nhận
          </Button>
        </Space>
      </Flex>
    </div>
  );
}

export default SlotAssigend;
