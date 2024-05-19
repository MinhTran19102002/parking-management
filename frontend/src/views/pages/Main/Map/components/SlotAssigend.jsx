import React, { useEffect, useMemo, useState } from 'react';
import SlotLayer from './SlotLayer';
import MapLayer from './MapLayer';
import { useQuery } from '@tanstack/react-query';
import { CameraApi } from '~/api';
import CameraLayer from './CameraLayer';
import { SLOTS_C } from '../data/parkingC';
import { SLOTS_B } from '../data/parkingB';
import { SLOTS_A } from '../data/parkingA';
import { GetSlots } from '../data';

const SLOTS = GetSlots();
function SlotAssigend({}) {
  const [zone, setZone] = useState('A');
  const [hoveredSlots, setHoveredSlots] = useState([]);
  const { data: cameras, refetch: refetchCameraUsed } = useQuery({
    queryKey: ['camera', 'used'],
    initialData: [],
    queryFn: async () => {
      try {
        const api = await CameraApi.getByFilter();
        return api.data;
      } catch {}
    }
  });

  const cameraForm = cameras.slice();
  const [selectedCamera, setSelectedCamera] = useState();
  const [selectedSlots, setSelectedSlots] = useState([]);
  const checkableSlots = useMemo(() => {
    if (!selectedCamera) return [];
    const unselectedCamera = cameras.filter((el) => el.cameraId !== selectedCamera) || [];
    const unSlots = unselectedCamera.reduce((acc, curr) => {
      acc.push(...curr.slots);
      return acc;
    }, []);
    return SLOTS.filter((slot) => !unSlots.includes(slot));
  }, [JSON.stringify(selectedCamera)]);

  const onHoverCamera = (camera = {}) => {
    const { slots = [] } = camera;
    setHoveredSlots(slots);
  };

  const onCheckSlot = (isCheck, checkedSlot) => {
    console.log('checkedSlot', isCheck, checkedSlot);
    const selectedCam = cameras.find((el) => el.cameraId === selectedCamera);
    const { slots = [] } = selectedCam;
    const newSlots = isCheck ? [...slots, checkedSlot] : slots.filter((el) => el !== checkedSlot);

    selectedCam.slots = newSlots;
    
  };

  useEffect(() => {
    if (selectedCamera) {
      const { slots = [] } = cameraForm.find((el) => el.cameraId === selectedCamera);
      console.log(cameraForm, selectedCamera, slots);
      setSelectedSlots(slots);
    }
  }, [selectedCamera, JSON.stringify(cameraForm)]);

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
    </div>
  );
}

export default SlotAssigend;
