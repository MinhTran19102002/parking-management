import { Card, Col, Row, Typography, theme } from 'antd';
import React from 'react';
import CustomedImage from './CustomedImage';

export const CameraCard = (props) => {
  const { img = [], name, cameraId, type } = props;
  const { token } = theme.useToken();

  return (
    <div
      style={{ borderRadius: 8 }}
      className="w-100 hover-defaul"
      draggable="true"
      drag={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('cameraData', JSON.stringify(props));
        e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
      }}>
      <Row className="w-100 py-2 px-2" gutter={8}>
        <Col span={8}>
          <CustomedImage style={{ width: '100%' }} src={img || img[0]} />
        </Col>
        <Col span={16}>
          <Typography strong={'true'}>
            <span>{cameraId}</span>
          </Typography>
          <Typography>
            <span type="secondary">Tên:</span> <span>{name}</span>
          </Typography>
          <Typography>
            <span type="secondary">Loại:</span> <span>{type}</span>
          </Typography>
        </Col>
      </Row>
    </div>
  );
};
