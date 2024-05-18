import { SLOTS_C } from '../data/parkingC';
import { SLOTS_B } from '../data/parkingB';
import { SLOTS_A } from '../data/parkingA';
import { DetailFloorStyled } from '../style';
import React from 'react';
import { Flex, Typography, Tag, theme } from 'antd';
import CarA from '~/assets/images/blue-car.png';
import CarB from '~/assets/images/blue-car.png';
import CarC from '~/assets/images/blue-car.png';
import dayjs from 'dayjs';
import DetailSlot from './DetailSlot';

function VehicleLayer({ slots, zone }) {
  const { token } = theme.useToken();
  let vehicles = [];
  let newWidth = 50;
  let currMap;
  let veWidth = 0;
  let height = 100;
  let textStyle = {}  ;
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

  return (
    <div id="vehicleLayer">
      {slots.map((slot, ix) => {
        const [vehicle] = vehicles.filter((e) => e.position === slot.position);
        if (vehicle) {
          const { top, left, position, rotate } = vehicle;
          const width = newWidth;
          return (
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
                  <Tag color="cyan">{dayjs(slot?.parkingTurn?.start, 'x').format('L LTS')}</Tag>
                </Flex>
              }
              content={
                <DetailSlot
                  {...vehicle}
                  zone={zone}
                  vehicle={slot?.parkingTurn?.vehicles}
                  driver={slot?.parkingTurn?.persons}
                  image={slot?.parkingTurn?.image}
                  startTime={slot?.parkingTurn?.start}
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
                className="image-container"
                src={CarA}
                style={{
                  transform: `rotate(${rotate}deg)`,
                  width,
                  top,
                  left
                }}
              />
            </DetailFloorStyled>
          );
        }
      })}
    </div>
  );
}

export default VehicleLayer;
