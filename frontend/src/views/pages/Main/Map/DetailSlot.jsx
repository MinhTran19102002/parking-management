import React, { useEffect, useState } from 'react';
import { Image, Row, Col, Flex, Typography, theme } from 'antd';
import IMG_LISENCE from '~/assets/images/lisence.png';
import { InnerDetailFloorStyled } from './style';
import { FormatNumber, JobServices } from '~/services';
import { CustomedImage } from '~/views/components';
import dayjs from 'dayjs';

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

function DetailSlot({ position, zone, vehicle, driver, image, startTime }) {
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

  console.log(
    `${import.meta.env.VITE_DOMAIN}/${import.meta.env.VITE_UPLOADS}/parkingTurn/${image}`
  );

  return (
    <InnerDetailFloorStyled>
      <Row className="detail-slot" gutter={{ xs: 4, sm: 8, md: 12 }}>
        <Col span={8}>
          <Flex vertical={true} align="center" gap={4}>
            <CustomedImage
              id="eventLisenceImg"
              src={`${import.meta.env.VITE_DOMAIN}/${
                import.meta.env.VITE_UPLOADS
              }/parkingTurn/${image}`}
              preview={false}
              style={{ height: 100 }}
            />
            <Typography.Text id="eventLisencePlate" strong={'true'}>
              {vehicle.licenePlate}
            </Typography.Text>
          </Flex>
        </Col>
        <Col span={16}>
          <Flex justify="space-evenly" vertical={true} align="start">
            {driverInfo}
            <Expense startTime={startTime} />
          </Flex>
        </Col>
      </Row>
    </InnerDetailFloorStyled>
  );
}

const Expense = ({ startTime }) => {
  const [fee, setFee] = useState(20000);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const dateIn = dayjs(startTime);
      const dateOut = dayjs();
      const timeDifference = dateOut - dateIn;
      const hoursDifference = dateOut.diff(dateIn, 'hour', true);
      setTotalTime(hoursDifference);
      if (hoursDifference > 10) {
        const newFee = fee + Math.floor(hoursDifference / 10) * 10000;
        setFee(newFee);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Typography.Text>
        <span className="label">Tổng thời gian đỗ</span>
        <span className="value">
          {': '} {FormatNumber(totalTime, { isEndZeroDecimal: false })} {' Giờ'}
        </span>
      </Typography.Text>
      <Typography.Text>
        <span className="label">Tiền xe</span>
        <span className="value">
          {': '} {FormatNumber(fee, { isEndZeroDecimal: false })} {' VNĐ'}
        </span>
      </Typography.Text>
    </>
  );
};

export default DetailSlot;
