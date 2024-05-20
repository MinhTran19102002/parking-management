import React, { useEffect, useState } from 'react';
import { SLOTS_C } from '../data/parkingC';
import { SLOTS_B } from '../data/parkingB';
import { SLOTS_A } from '../data/parkingA';
import { Checkbox, Flex, Space, Typography } from 'antd';
import CarA from '~/assets/images/blue-car.png';
import { SlotStyled } from '../../Setting-Map/style';
import SlotStatus from './SlotStatus';
import { GetPlotsInfor } from '../data';

function SlotLayer({
  zone,
  vehicles = [],
  hoveredSlots = [],
  checkable,
  onCheckSlot,
  checkableSlots = [],
  checkedSlots = []
}) {
  const [mapProps, setMapProps] = useState(GetPlotsInfor(zone));
  const { slots = [], width = 0, height = 0, veWidth, textStyle } = mapProps;

  const newSlots = slots.map((el) => {
    return {
      ...el,
      rotate: el.rotate - 90
    };
  });

  useEffect(() => {
    setMapProps(GetPlotsInfor(zone));
  }, [zone]);

  return (
    <div id="slotsLayer">
      {slots.map((slot, ix) => {
        const { rotate } = slot;
        const { position } = slot;
        const isHovered = hoveredSlots.find((el) => el === position);
        const vehicle = vehicles.find((el) => el.position === position);
        const config = {
          slot,
          width,
          height,
          vehicle,
          zone,
          rotate,
          textStyle
        };
        return (
          <InteractionSlot key={position} {...config} isHovered={isHovered}>
            {checkable && checkableSlots.find((slot) => slot === position) && (
              <Checkbox
                checked={checkedSlots.find((slot) => slot === position)}
                style={{ position: 'absolute', top: 0, left: 4 }}
                onChange={(e) => onCheckSlot(e.target.checked, position)}
                size="large"
              />
            )}
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
          </InteractionSlot>
        );
      })}
    </div>
  );
}

const InteractionSlot = ({ slot, width, height, children, isHovered }) => {
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    setIsHover(isHovered);
  }, [isHovered]);

  const hoverCSS = isHover
    ? {
        borderColor: `#000`,
        backgroundColor: '#c0bdbd'
      }
    : {};

  const onHover = (e, newValue) => {
    setIsHover(newValue);
  };

  return (
    <SlotStyled
      onMouseOver={(e) => onHover(e, true)}
      onMouseOut={(e) => onHover(e, false)}
      key={slot.position}
      style={{
        position: 'absolute',
        width,
        height,
        ...slot,
        transform: `rotate(${slot.rotate}deg)`,
        padding: '2px 0',
        ...hoverCSS
      }}>
      {children}
    </SlotStyled>
  );
};

export default SlotLayer;
