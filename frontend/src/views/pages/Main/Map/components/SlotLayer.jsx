import React, { useEffect, useState } from 'react';
import { SLOTS_C } from '../data/parkingC';
import { SLOTS_B } from '../data/parkingB';
import { SLOTS_A } from '../data/parkingA';
import { Flex, Space, Typography } from 'antd';
import CarA from '~/assets/images/blue-car.png';
import { SlotStyled } from '../../Setting-Map/style';
import SlotStatus from './SlotStatus';

const getSlots = (zone) => {
  let vehicles = [];
  let newWidth = 0;
  let veWidth = 0;
  let height = 100;
  let textStyle = {};
  switch (zone) {
    case 'A':
      vehicles = SLOTS_A;
      newWidth = 40;
      height = 68;
      veWidth = 24;
      textStyle = {
        fontSize: 11
      };
      break;
    case 'B':
      vehicles = SLOTS_B;
      newWidth = 56;
      height = 90;
      veWidth = 34;
      break;
    case 'C':
      vehicles = SLOTS_C;
      newWidth = 54;
      height = 90;
      veWidth = 34;
      break;
  }

  return { slots: vehicles, width: newWidth, height, veWidth, textStyle };
};
function SlotLayer({ zone, vehicles = [] }) {
  const [mapProps, setMapProps] = useState(getSlots(zone));
  const { slots = [], width = 0, height = 0, veWidth, textStyle } = mapProps;

  const newSlots = slots.map((el) => {
    return {
      ...el,
      rotate: el.rotate - 90
    };
  });

  useEffect(() => {
    setMapProps(getSlots(zone));
  }, [zone]);

  return (
    <div id="slotsLayer">
      {slots.map((slot, ix) => {
        const { rotate } = slot;
        const { position } = slot;
        const vehicle = vehicles.find((el) => el.position === position);
        return (
          <SlotStyled
            key={slot.position}
            style={{
              position: 'absolute',
              width,
              height,
              ...slot,
              transform: `rotate(${slot.rotate}deg)`,
              padding: '2px 0'
            }}>
            <Flex vertical direction="vertical" align="center" size={0} className="w-100 h-100">
              <SlotStatus zone={zone} slotInfor={slot} slot={vehicle} />
              <Typography.Text
                className="slot-id"
                style={{
                  ...textStyle,
                  lineHeight: '100%',
                  transform: `rotate(${rotate === -180 ? 180 : 0}deg)`
                }}>
                {slot.position}
              </Typography.Text>
            </Flex>
          </SlotStyled>
        );
      })}
    </div>
  );
}

export default SlotLayer;
