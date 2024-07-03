import React, { useEffect } from 'react';
import { Button, Card, Col, Layout, Result, Row } from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import { useQuery } from '@tanstack/react-query';
import { CameraApi } from '~/api';
import VideoBlock from '~/views/components/VideoBlock';

function CameraStream({}) {
  const { data, refetch } = useQuery({
    queryKey: ['cameras', 'all'],
    initialData: {},
    queryFn: async () => {
      let rs;
      try {
        const api = await CameraApi.getByFilter({});
        rs = api;
      } catch {}
      return rs;
    }
  });
  const { data: cameras = [] } = data;

  const colProps = {
    span: 24,
    sm: 24,
    md: 12,
    xl: 8,
    xxl: 6
  };

  useEffect(() => {
    refetch();
  }, []);
  return (
    <Content className="w-100 py-3">
      <Row className="w-100" gutter={[8, 8]}>
        {cameras.map((camera = {}, index) => {
          return (
            <Col key={camera.cameraId} {...colProps}>
              <Card title={camera.cameraId}>
                {camera.streamLink ? (
                  <VideoBlock src={camera.streamLink} />
                ) : (
                  <Result title="Stream Camera chưa được cài đặt" />
                )}
              </Card>
            </Col>
          );
        })}
      </Row>
    </Content>
  );
}

export default CameraStream;
