import { Card, Col, Row, Typography, theme } from 'antd';
import React from 'react';
import CustomedImage from './CustomedImage';
import { useTranslation } from 'react-i18next';

export const CameraCard = ({ dragable, ...props }) => {
  const { img = [], name, cameraId, type, image } = props;
  const { token } = theme.useToken();
  const { t: lag } = useTranslation();

  return (
    <div
      style={{ borderRadius: 8, minWidth: 200 }}
      className="w-100 hover-defaul"
      draggable={dragable}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('cameraData', JSON.stringify(props));
        e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
      }}>
      <Row className="w-100 py-2 px-2" gutter={8}>
        <Col span={24}>
          {dragable && (
            <Typography.Title level={5}>
              {lag('common:mapPage:dragAndDropIntoMap')}
            </Typography.Title>
          )}
          <Typography strong={'true'}>
            <span>{cameraId}</span>
          </Typography>
          <Typography>
            <span type="secondary">{lag('common:name')}:</span> <span>{name}</span>
          </Typography>
          <Typography>
            <span type="secondary">{lag('common:type')}:</span> <span>{type}</span>
          </Typography>
        </Col>
      </Row>
    </div>
  );
};
