import { Card, Col, Flex, Image, Row, Space, Typography, theme } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import IMG_DEVELOPING from '~/assets/images/developing.png';
import CustomedTag from '~/views/components/CustomedTag';
import { JobServices } from '~/services';

const eventNames = {
  in: 'Xe vào',
  out: 'Xe ra',
  almost_full: 'Bãi xe sấp đầy',
  parking_full: 'Bãi xe đã đầy'
};

const personInfo = {
  name: 'Chủ xe',
  job: 'Nghề nghiệp',
  department: 'Đơn vị',
  phone: 'SĐT'
};

function EventCard({ item }) {
  const { token } = theme.useToken();

  let { name, parkingTurn, vehicle, zone, person = {} } = item;

  const color = {
    primary: token.event[name][0],
    secondary: token.event[name][1]
  };
  let rs = [];
  let i = 0;

  //get Driver info: Department and job
  if (person && person.driver) {
    const { driver } = person;
    person = {
      ...person,
      ...driver
    };
    delete person.driver;
  }

  rs.push(
    <Typography.Title level={5} className="my-0" key={'info' + i}>
      <span className="label">Khu vực</span>
      <span className="value">
        {': '} {item.zone}
      </span>
    </Typography.Title>
  );

  for (const [key, value] of Object.entries(personInfo)) {
    let xValue = person && person[key];
    if (xValue) {
      if (key === 'job') {
        xValue = JobServices.getTextByValue(xValue);
      }
      rs.push(
        <Typography.Text key={'info' + i}>
          <span className="label">{value}</span>
          <span className="value">
            {': '} {xValue}
          </span>
        </Typography.Text>
      );
    }
    i++;
  }

  let isImage = false;

  if (name === 'in' || name === 'out') {
    isImage = true;

    if (rs.length === 0) {
      rs = [
        <Typography.Title level={5} key={'info'}>
          Khách vãng lai
        </Typography.Title>
      ];
    }
  }

  return (
    <Card
      title={
        <Typography.Title level={5} className='my-0'>{dayjs(item.createdAt, 'x').format('L LTS')}</Typography.Title>
      }
      className="event-card"
      style={{
        width: '99%',
        backgroundColor: color.secondary,
        border: `2px solid ${color.primary}`
      }}>
      <div id="eventTag" className="event-tag"></div>
      <Space size={1}>
        {isImage && (
          <Col>
            <Flex vertical={true} align="center" gap={4}>
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
              <Typography.Text id="eventLisencePlate" strong={'true'}>
                {vehicle.licenePlate}
              </Typography.Text>
            </Flex>
          </Col>
        )}
        <Col>
          <Space direction="vertical" size={1}>
            <Typography.Title
              id="eventZone"
              level={5}
              className="mb-0"
              style={{ color: color.primary }}>
              {eventNames[name]}
            </Typography.Title>
            {rs.length > 0 && rs}
            {/* <Typography.Text id="eventDriverName">
              <span className="label">Chủ xe: </span>
              <span className="value">{item.driver.name}</span>
            </Typography.Text>
            <Typography.Text id="eventDriverJob">
              <span className="label">Nghề nghiệp: </span>
              <span className="value">{item.driver.job}</span>
            </Typography.Text>
            <Typography.Text id="eventDriverDepartment">
              <span className="label">Đơn vị: </span>
              <span className="value">{item.driver.department}</span>
            </Typography.Text>
            <Typography.Text id="eventDriverPhone">
              <span className="label">SĐT: </span>
              <span className="value">{item.driver.phone}</span>
            </Typography.Text> */}
          </Space>
        </Col>
      </Space>
    </Card>
  );
}

export default EventCard;
