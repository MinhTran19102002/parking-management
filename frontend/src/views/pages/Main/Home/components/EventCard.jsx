import { Card, Col, Flex, Image, Row, Space, Typography, theme } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import IMG_DEVELOPING from '~/assets/images/developing.png';
import CustomedTag from '~/views/components/CustomedTag';
import { JobServices } from '~/services';
import { EventDisplay } from './data';

const eventNames = {
  in: 'Xe vào bãi',
  out: 'Xe ra bãi',
  inSlot: 'Xe vào ô đỗ',
  outSlot: 'Xe rời ô đỗ',
  almost_full: 'Bãi xe sấp đầy',
  parking_full: 'Bãi xe đã đầy'
};

const personInfo = {
  name: 'Chủ xe',
  job: 'Nghề nghiệp',
  department: 'Đơn vị',
  phone: 'SĐT'
};

const labels = {
  zone: 'Khu vực',
  position: 'Vị trí',
  license: 'Biển số xe'
};

const vehicleEvents = ['in', 'out', 'inSlot', 'outSlot'];

function EventCard({ item }) {
  const { token } = theme.useToken();
  let { name, parkingTurn, vehicle, zone, person = {} } = item;
  const color = {
    primary: token.event[name][0],
    secondary: token.event[name][1]
  };
  let subInfo = null;

  const rows = useMemo(() => {
    const displays =
      EventDisplay.find((el) => el.eventType === name)?.displayProps ||
      EventDisplay[0].displayProps;
    const rs = displays.map((display) => {
      let value = 'Không xác định';
      if (display.dataIndex.length > 0) {
        value = JSON.parse(JSON.stringify(item));
        for (let i of display.dataIndex) {
          value = value && value[i];
        }
      }
      return {
        id: display.key,
        label: labels[display.key],
        value,
        display: true
      };
    });
    return rs;
  });

  let isImage = false;
  if (vehicleEvents.find((el) => el === name)) {
    isImage = true;
    const isVisting = !person;

    if (isVisting) {
      subInfo = [
        <Typography.Title level={5} key={'vanglaikhach'}>
          Khách vãng lai
        </Typography.Title>
      ];
    }
  }

  return (
    <Card
      title={
        <Typography.Title level={5} className="my-0">
          {dayjs(item.createdAt, 'x').format('L LTS')}
        </Typography.Title>
      }
      className="event-card"
      style={{
        width: '99%',
        backgroundColor: color.secondary,
        border: `2px solid ${color.primary}`
      }}>
      <div id="eventTag" className="event-tag"></div>
      <Space size="small" align="start" className="px-2">
        {isImage && (
          <Space align="center" direction="vertical" size={1}>
            <Image
              id="eventLisenceImg"
              src={
                parkingTurn?.image
                  ? `${import.meta.env.VITE_DOMAIN}/${import.meta.env.VITE_UPLOADS}/parkingTurn/${
                      parkingTurn?.image
                    }`
                  : IMG_DEVELOPING
              }
              className="p-2"
              preview={false}
              style={{ background: '#FFF', width: 120, height: 120 }}
            />
          </Space>
        )}
        <Space align="start" direction="vertical" size={1}>
          <Typography.Title
            id="eventZone"
            level={5}
            className="mb-0"
            style={{ color: color.primary }}>
            {eventNames[name]}
          </Typography.Title>
          {rows.map(
            (row, ix) =>
              row.display && (
                <Row className="w-100" key={row.label + ix}>
                  <Typography.Text
                    level={5}
                    style={{ fontWeight: 400, fontSize: 14 }}
                    key={'label' + row.label + ix}>
                    <span className="text-label">{row.label}:</span>
                    <span>&nbsp;</span>
                    <span>{row.value}</span>
                  </Typography.Text>
                </Row>
              )
          )}
          {subInfo}
        </Space>
      </Space>
    </Card>
  );
}

export default EventCard;
