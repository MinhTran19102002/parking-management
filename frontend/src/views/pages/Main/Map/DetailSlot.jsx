import React from 'react';
import { Image, Row, Col, Flex, Typography, theme } from 'antd';
import IMG_LISENCE from '~/assets/images/lisence.png';
import { InnerDetailFloorStyled } from './style';
import { JobServices } from '~/services';
import { CustomedImage } from '~/views/components';

const eventNames = {
  in: 'Xe vào',
  out: 'Xe ra'
};

const personInfo = {
  name: 'Chủ xe',
  job: 'Nghề nghiệp',
  department: 'Đơn vị',
  phone: 'SĐT'
};

function DetailSlot({ position, zone, vehicle, driver, image }) {
  const { token } = theme.useToken();
  const { colorTextSecondary } = token;

  // driver = {
  //   name: 'fjgsljgs',
  //   adress: 'TP HCM',
  //   phone: '1234567890',
  //   email: 'minhtc1910@gmail.com',
  //   job: 'Giảng viên'
  // };

  // vehicle = {
  //   _id: '654a1fd36a0751a7e7c0b9ef',
  //   driverId: '6555eeb9e570d29a3c1f67ab',
  //   licenePlate: '12A-2171',
  //   type: 'Car',
  //   createdAt: 1699356625436,
  //   updatedAt: null,
  //   _destroy: false
  // };

  let driverInfo = [];

  driver = {
    ...driver,
    ...driver?.driver
  };
  let i = 0;
  for (const [key, value] of Object.entries(personInfo)) {
    let xValue = (driver && driver[key]) || 'Không xác định';
    if (key === 'job') {
      xValue = JobServices.getTextByValue(xValue);
    }
    driverInfo.push(
      <Typography.Text key={'info' + i}>
        <span className="label">{value}</span>
        <span className="value">
          {': '} {xValue}
        </span>
      </Typography.Text>
    );
    i++;
  }

  console.log(`${import.meta.env.VITE_DOMAIN}/${import.meta.env.VITE_UPLOADS}/parkingTurn/${image}`);

  return (
    <InnerDetailFloorStyled>
      <Row className="detail-slot" gutter={{ xs: 4, sm: 8, md: 12 }}>
        <Col span={8}>
          <Flex vertical={true} align="center" gap={4}>
            <CustomedImage
              id="eventLisenceImg"
              src={`${import.meta.env.VITE_DOMAIN}/${import.meta.env.VITE_UPLOADS}/parkingTurn/${image}`}
              preview={false}
            />
            <Typography.Text id="eventLisencePlate" strong>
              {vehicle.licenePlate}
            </Typography.Text>
          </Flex>
        </Col>
        <Col span={16}>
          <Flex justify="space-evenly" vertical={true} align="start">
            {driverInfo}
          </Flex>
        </Col>
      </Row>
    </InnerDetailFloorStyled>
  );
}

export default DetailSlot;
