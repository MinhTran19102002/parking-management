import React, { useEffect } from 'react';
import { Button, Card, Col, Layout, Result, Row } from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import { useQuery } from '@tanstack/react-query';
import { CameraApi, HlsApi } from '~/api';
import VideoBlock from '~/views/components/VideoBlock';
import { useTranslation } from 'react-i18next';
const HLS_DOMAIN = import.meta.env.VITE_DOMAIN_HLS;

function CameraStream({}) {
  const { t: lag } = useTranslation();
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

  const { data: hlsData, refetch: refetchHLS } = useQuery({
    queryKey: ['HlsSetting', 'Check'],
    initialData: [],
    queryFn: async () => {
      let rs = [];
      try {
        const api = await HlsApi.getAll();
        rs = Object.keys(api).reduce((acc, curr) => {
          const item = api[curr];
          acc.push({
            cameraId: curr,
            rtspUrl: item.rtsp_url,
            hlsPostfix: item.hls_postfix
          });
          return acc;
        }, []);
      } catch (error) {
        console.log(error);
      }
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
    refetchHLS();
  }, []);
  return (
    <Content className="w-100 py-3">
      <Row className="w-100" gutter={[8, 8]}>
        {cameras.map((camera = {}, index) => {
          const { streamLink, cameraId } = camera;
          const link = `${HLS_DOMAIN}/stream/${cameraId}/index.m3u8`;
          return (
            streamLink && (
              <Col key={camera.cameraId} {...colProps}>
                <Card size="small" title={camera.cameraId}>
                  {/*  {camera.streamLink ? (
                  <VideoBlock src={camera.streamLink} />
                ) : (
                  <Result title="Stream Camera chưa được cài đặt" />
                )} */}
                  {hlsData.find((el) => el.cameraId === camera.cameraId) ? (
                    <VideoBlock src={link} />
                  ) : (
                    <Result subTitle={lag('common:cameraPage:unInstall')} />
                  )}
                </Card>
              </Col>
            )
          );
        })}
      </Row>
    </Content>
  );
}

export default CameraStream;
