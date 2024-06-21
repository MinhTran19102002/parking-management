import React from 'react';
import { DetailFloorStyled } from '../style';
import { Flex, Typography, Tag, theme } from 'antd';
import CarA from '~/assets/images/blue-car.png';
import dayjs from 'dayjs';
import DetailSlot from './DetailSlot';
import { GetPlotsInfor } from '../data';

function SlotStatus({ zone, slotInfor = {}, slot }) {
  const { slots = [], width = 0, height = 0, veWidth, textStyle } = GetPlotsInfor(zone);
  const { top, left, position, rotate } = slotInfor;
  const { token } = theme.useToken();
  const isDetail = slot?.parkingTurn;
  return slot ? (
    isDetail ? (
      <DetailFloorStyled
        key={position}
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
            {...slotInfor}
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
          src={CarA}
          style={{
            ...slot,
            width: veWidth
          }}
        />
      </DetailFloorStyled>
    ) : (
      <img
        src={CarA}
        style={{
          ...slot,
          width: veWidth,
          opacity: 1
        }}
      />
    )
  ) : (
    <img
      src={CarA}
      style={{
        ...slot,
        width: veWidth,
        opacity: 0
      }}
    />
  );
}

export default SlotStatus;
