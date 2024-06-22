import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Form, Input, Layout, Radio, Row, Upload, Select, Switch } from 'antd';
import { Content, Footer, Header } from '~/views/layouts';
import AppContext from '~/context';
import { ParkingApi, UserApi } from '~/api';
import { ErrorService, ValidateService } from '~/services';
import { SLOTS_A } from '../Map/data/parkingA';
import { SLOTS_B } from '../Map/data/parkingB';
import { SLOTS_C } from '../Map/data/parkingC';
import { UploadOutlined } from '@ant-design/icons';
import StreamEvents from './StreamEvents';

const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 24 }
  }
};

const zones = ['A', 'B', 'C'];

function Event({}) {
  const { state, actions } = useContext(AppContext);
  const [drivers, setDrivers] = useState([]);
  const [parkings, setParkings] = useState({});
  const [importForm] = Form.useForm();
  const [exportForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isSelect, setIsSelect] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [imageFile, setImageFile] = useState();
  const occupiedSlots = useMemo(() => {
    const { A: zoneA, B: zoneB, C: zoneC } = parkings;
    return [...(zoneA?.slots || []), ...(zoneB?.slots || []), ...(zoneC?.slots || [])];
  }, [parkings]);

  const callApi = async () => {
    try {
      const api = await Promise.all([
        UserApi.getDrivers({}),
        ParkingApi.getStatus({ zone: 'A' }),
        ParkingApi.getStatus({ zone: 'B' }),
        ParkingApi.getStatus({ zone: 'C' })
      ]);

      const [newDrivers, parkingA, parkingB, parkingC] = api;
      setDrivers(newDrivers.data);
      setParkings({
        A: parkingA[0],
        B: parkingB[0],
        C: parkingC[0]
      });
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    }
  };
  const hanldeImport = async (values) => {
    try {
      //hanldeImage
      delete values['image'];
      await ParkingApi.importVehicle({
        ...values,
        image: imageFile
      });
      actions.onNoti({
        type: 'success',
        message: 'Nhập xe thành công',
        description: values.licenePlate
      });
      importForm.resetFields();
      setImageFile();
    } catch (error) {
      console.log(error);
      ErrorService.hanldeError(error, actions.onNoti);
    }
  };

  const hanldeExport = async (values) => {
    try {
      setLoading(true);
      const apis = values.licenePlate.map((el) => {
        return ParkingApi.exportVehicle({ licenePlate: el });
      });
      await Promise.allSettled(apis);
      actions.onNoti({
        type: 'success',
        message: 'Xuất xe thành công',
        description: values.licenePlate.toString()
      });

      exportForm.resetFields();
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    callApi();
  }, [state.parkingEvent]);

  return (
    <Content className="w-100 py-3">
      <StreamEvents />
      {/* <Row gutter={16}>
      <Col span={24} xl={12}>
        <Form
          name="importVehicleForm"
          form={importForm}
          onFinish={hanldeImport}
          disabled={loading}
          layout="vertical"
          {...formItemLayout}
          style={{ maxWidth: 4000 }}>
          <Card
            title="Nhập xe"
            extra={
              <Form.Item className="mb-0">
                <Button htmlType="submit" type="primary">
                  Nhập
                </Button>
              </Form.Item>
            }>
            <Form.Item>
              <Switch
                checkedChildren="Chọn"
                unCheckedChildren="Nhập"
                checked={isSelect}
                onChange={(checked) => {
                  setIsSelect(checked);
                }}
              />
            </Form.Item>
            <Form.Item
              name="licenePlate"
              label="Biển số xe"
              rules={[
                { required: true, message: false },
                ({}) => ({
                  validator(_, value) {
                    if (ValidateService.licensePlate(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject({ message: 'Sai định dạng (VD: 12A-2184)' });
                  }
                })
              ]}>
              {isSelect ? (
                <Select showSearch>
                  {drivers.map((el, ix) => (
                    <Select.Option
                      key={'optionlicenePlate' + ix}
                      value={el.driver.vehicle[0].licenePlate}>
                      {el.driver.vehicle[0].licenePlate}
                    </Select.Option>
                  ))}
                </Select>
              ) : (
                <Input placeholder="A1-013" />
              )}
            </Form.Item>
            <Form.Item name="zone" label="Khu vực">
              <Radio.Group>
                {zones.map((el, ix) => (
                  <Radio.Button key={'radio' + el + ix} value={el}>
                    {'Khu ' + el}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item shouldUpdate={(pre, curr) => pre.zone !== curr.zone}>
              {({ getFieldValue }) => {
                let posList = [];
                const currZone = getFieldValue('zone');
                const slots = parkings[currZone]?.slots || [];
                switch (currZone) {
                  case 'A':
                    posList = SLOTS_A;
                    break;
                  case 'B':
                    posList = SLOTS_B;
                    break;
                  case 'C':
                    posList = SLOTS_C;
                    break;
                }

                const rs = posList.map((el, ix) => {
                  const { position } = el;
                  const isOccupied = slots.findIndex((e) => e.position === position);
                  return (
                    <Radio
                      key={'radio' + el.position + ix}
                      value={el.position}
                      disabled={isOccupied !== -1}>
                      {el.position}
                    </Radio>
                  );
                });

                return (
                  <Form.Item name="position" label="Vị trí">
                    <Radio.Group>{rs}</Radio.Group>
                  </Form.Item>
                );
              }}
            </Form.Item>
            <Form.Item name="image" label="Hình ảnh biển số xe">
              <Upload
                accept="image/jpeg,image/jpg,image/png,image/webp"
                beforeUpload={(file) => {
                  return false;
                }}
                fileList={fileList}
                onChange={({ file, fileList: newFileList }) => {
                  setFileList(newFileList);
                  setImageFile(file);
                }}
                listType="picture">
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Card>
        </Form>
      </Col>
      <Col span={24} xl={12}>
        <Form
          name="exportVehicleForm"
          form={exportForm}
          onFinish={hanldeExport}
          disabled={loading}
          layout="vertical"
          {...formItemLayout}
          style={{ maxWidth: 4000 }}>
          <Card
            title="Xuất xe"
            extra={
              <Form.Item className="mb-0">
                <Button htmlType="submit" type="primary" danger>
                  Xuất
                </Button>
              </Form.Item>
            }>
            <Form.Item
              name="licenePlate"
              label="Biển số xe"
              rules={[{ required: true, message: false }]}>
              <Select mode="multiple" showSearch>
                {occupiedSlots.map((el, ix) => () => {
                  return (
                    <Select.Option
                      key={'option' + el?.parkingTurn?.vehicles?.licenePlate + ix}
                      value={el?.parkingTurn?.vehicles?.licenePlate}>
                      {el?.parkingTurn?.vehicles[0]?.licenePlate}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Card>
        </Form>
      </Col>
    </Row> */}
    </Content>
  );
}

export default Event;
