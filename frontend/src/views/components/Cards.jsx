import { Card, Col, Row, Typography, theme } from 'antd';
import React from 'react';
import CustomedImage from './CustomedImage';

export const CameraCard = ({ img = [], name, cameraId, type }) => {
  const { token } = theme.useToken();

  return (
    <div style={{borderRadius: 8}} className="w-100 hover-default">
      <Row className="w-100 py-2 px-2" gutter={8}>
        <Col span={8}>
          <CustomedImage style={{ width: '100%' }} src={img || img[0]} />
        </Col>
        <Col span={16}>
          <Typography strong>
            <span>{cameraId}</span>
          </Typography>
          <Typography>
            {' '}
            <span type="secondary">Tên</span>
            <span>{name}</span>
          </Typography>
          <Typography>{type}</Typography>
        </Col>
      </Row>
    </div>
  );
};
