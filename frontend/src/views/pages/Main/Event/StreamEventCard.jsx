import React, { useContext, useState } from 'react';
import { Button, Divider, Input, Radio, Space, Typography } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { MediaServerApi, ParkingApi } from '~/api';
import { ErrorService } from '~/services';
import AppContext from '~/context';

export const StreamEventCard = () => {
  const [stream, setStream] = useState();
  const [loading, setLoading] = useState(false);
  const { state, actions } = useContext(AppContext);
  const [selectedLicenePlate, setSelectedLicenePlate] = useState();
  const {
    data: { licenses = [], image },
    refetch
  } = useQuery({
    initialData: {},
    queryKey: ['Get', 'Data', 'FromStream'],
    queryFn: async () => {
      let rs;
      try {
        const [data1, data2] = await Promise.allSettled(
          MediaServerApi.getLicensesFromStream(),
          MediaServerApi.captureImageFromStream()
        );
        console.log(data1, data2);
        rs = {
          licenses: data1.result || [],
          image: data2
        };
        init();
      } catch {}
      return rs;
    }
  });

  const init = () => {
    setSelectedLicenePlate();
  };

  const hanldeImport = async (values) => {
    try {
      //hanldeImage
      await ParkingApi.importVehicle({
        licenePlate: selectedLicenePlate
      });
      actions.onNoti({
        type: 'success',
        message: 'Nhập xe thành công',
        description: values.licenePlate
      });
      setImageFile();
    } catch (error) {
      console.log(error);
      ErrorService.hanldeError(error, actions.onNoti);
    }
  };

  const hanldeExport = async (values) => {
    try {
      setLoading(true);
      await ParkingApi.exportVehicle({ licenePlate: selectedLicenePlate });
      actions.onNoti({
        type: 'success',
        message: 'Xuất xe thành công',
        description: values.licenePlate.toString()
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
      <Divider />
      <Button onClick={() => refetch()}>Cắt hình</Button>
      <Divider />
      <Typography.Title level={5}>Các biển số xe được nhận diện:</Typography.Title>
      <Radio.Group
        value={selectedLicenePlate}
        options={licenses.map((el) => {
          return {
            label: el,
            value: el
          };
        })}
      />
      <Space>
        <Button type="primary" onClick={hanldeImport}>
          Nhập xe
        </Button>
        <Button type="primary" onClick={hanldeExport}>
          Xuất xe
        </Button>
      </Space>
    </div>
  );
};
