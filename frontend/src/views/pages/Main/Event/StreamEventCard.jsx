import React, { useContext, useMemo, useState } from 'react';
import { Button, Divider, Input, Radio, Space, Typography } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { MediaServerApi, ParkingApi } from '~/api';
import { ErrorService } from '~/services';
import AppContext from '~/context';
import { useTranslation } from 'react-i18next';
const DOMAIN = import.meta.env.VITE_DOMAIN_MEDIA;
function _imageEncode(arrayBuffer) {
  let u8 = new Uint8Array(arrayBuffer);
  let b64encoded = btoa(
    [].reduce.call(
      new Uint8Array(arrayBuffer),
      function (p, c) {
        return p + String.fromCharCode(c);
      },
      ''
    )
  );
  let mimetype = 'image/jpeg';
  return 'data:' + mimetype + ';base64,' + b64encoded;
}

export const StreamEventCard = () => {
  const { t: lag } = useTranslation();
  const [stream, setStream] = useState(`${DOMAIN}/image_feed`);
  const [loading, setLoading] = useState(false);
  const { state, actions } = useContext(AppContext);
  const [selectedLicenePlate, setSelectedLicenePlate] = useState();
  const {
    data: { licenses = [], imageSrc, image, imgURL },
    refetch
  } = useQuery({
    initialData: {},
    queryKey: ['Get', 'Data', 'FromStream'],
    queryFn: async () => {
      let rs = {};
      try {
        const [data1, data2] = await Promise.allSettled([
          MediaServerApi.getLicensesFromStream(),
          MediaServerApi.getImageFromStream()
        ]);
        const resp = data2.value;

        const imageApi = await MediaServerApi.captureImageFromStream();
        const arrayBuffer = await imageApi.arrayBuffer();
        const src = _imageEncode(imageApi);

        const blob = new Blob([arrayBuffer], { type: 'image/png' });
        const file = new File([blob], 'image.png', { type: 'image/png' });
        const url = URL.createObjectURL(file);

        rs = {
          licenses: data1.value.result || [],
          imageSrc: url,
          image: file,
          imgURL: url
        };
        init();
      } catch (error) {
        console.log(error);
      }
      return rs;
    }
  });

  const init = () => {
    setSelectedLicenePlate();
  };

  const hanldeImport = async () => {
    try {
      //hanldeImage
      console.log('file', image);
      await ParkingApi.importVehicle({
        licenePlate: selectedLicenePlate,
        image
      });
      actions.onNoti({
        type: 'success',
        message: lag('event:actions:importSuccess'),
        description: selectedLicenePlate
      });
      setImageFile();
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    }
  };

  const hanldeExport = async (values) => {
    try {
      setLoading(true);
      await ParkingApi.exportVehicle({ licenePlate: selectedLicenePlate });
      actions.onNoti({
        type: 'success',
        message: lag('event:actions:exportSuccess'),
        description: selectedLicenePlate
      });
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={'w-100'}>
      <img width={400} src={stream} alt={'No Img'} />
      <Typography.Title level={5}>Stream đã nhập: {stream}</Typography.Title>
      <Input value={stream} onChange={(e) => setStream(e.target.value)} />
      <Button onClick={() => refetch()}>{lag('event:actions:cut')}</Button>
      <Divider />
      <Typography.Title level={5}>{lag('event:actions:cutImage')}:</Typography.Title>
      {useMemo(
        () => (
          <img src={imgURL} width={300} alt="No Image" />
        ),
        [JSON.stringify(imageSrc)]
      )}
      <Typography.Title level={5}>{lag('event:actions:licenePlates')}:</Typography.Title>
      <Radio.Group
        value={selectedLicenePlate}
        onChange={(e) => setSelectedLicenePlate(e.target.value)}
        options={licenses.map((el) => {
          return {
            label: el,
            value: el
          };
        })}
      />
      <Space>
        <Button type="primary" onClick={hanldeImport}>
          {lag('common:actions:import')}
        </Button>
        <Button type="primary" onClick={hanldeExport}>
          {lag('common:actions:export')}
        </Button>
      </Space>
    </div>
  );
};
