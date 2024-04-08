import React, { useContext, useEffect, useState } from 'react';
import { Form, Modal, Input, Select, Button, Space, Upload } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { UserApi } from '~/api';
import { ErrorService, ValidateService } from '~/services';
import AppContext from '~/context';
import EmployeeApi from '~/api/Collections/EmployeeApi';
import { CAMERA_TYPES } from './data';
import { useTranslation } from 'react-i18next';

const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 18 }
  }
};

const DEFAULT_PASSWORD = 'Parking@123';

function CameraForm({ isOpen, onClose, formAction, noChangeAccount }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { state, actions } = useContext(AppContext);
  const { onNoti, onMess } = actions;
  const { t: lag, i18n } = useTranslation();

  const hanldeClose = (action, values) => {
    form.resetFields();
    onClose({});
  };

  useEffect(() => {
    if (formAction.action === 'edit') {
      form.setFieldsValue({ ...formAction.payload });
    } else {
    }
  }, [formAction]);

  const onFinish = (values) => {
    if (formAction.action === 'add') {
      hanldeAdd(values);
    } else {
      hanldeEdit(values);
    }
  };

  const hanldeEdit = async (values) => {
    try {
      setLoading(true);
      delete values.account;
      delete values.user;
      const api = await UserApi.edit(formAction.payload._id, values);
      if (api) {
        onNoti({ message: 'Chỉnh sửa nhân viên thành công', type: 'success' });
      }
      onClose({ reload: true, newValues: api });
    } catch (error) {
      ErrorService.hanldeError(error, onNoti);
    } finally {
      setLoading(false);
    }
  };

  const hanldeAdd = async (values) => {
    console.log('hanlde Add', values);
    // try {
    //   setLoading(true);
    //   const api = await EmployeeApi.add(values);
    //   if (api) {
    //     onNoti({ message: 'Thêm nhân viên thành công', type: 'success' });
    //   }
    //   onClose({ reload: true });
    // } catch (error) {
    //   ErrorService.hanldeError(error, onNoti);
    // } finally {
    //   setLoading(false);
    // }
  };

  const randomPassword = () => {
    form.setFieldValue('pass', DEFAULT_PASSWORD);
  };

  const fileList = [
    {
      uid: '0',
      name: 'xxx.png',
      status: 'uploading',
      percent: 33
    },
    {
      uid: '-1',
      name: 'yyy.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: '-2',
      name: 'zzz.png',
      status: 'error'
    }
  ];

  return (
    <div className="container-fluid pt-3">
      <Form
        form={form}
        onFinish={onFinish}
        disabled={loading}
        {...formItemLayout}
        style={{ maxWidth: 4000 }}>
        <Form.Item name={'cameraId'} label="Camera ID" rules={[{ required: true }]}>
          <Input placeholder="Nhập Camera ID" id="cameraIdInput" />
        </Form.Item>

        <Form.Item name={'Tên'} label="Tên" rules={[{ required: true }]}>
          <Input placeholder="Nhập tên" id="nameInput" />
        </Form.Item>

        <Form.Item name={'type'} label="Kiểu" rules={[{ required: true, message: false }]}>
          <Select
            id="cameraTypeInput"
            placeholder="Chọn kiểu camera"
            options={CAMERA_TYPES.map((type) => {
              return { value: type, label: lag('common:camera:type:' + type) };
            })}
          />
        </Form.Item>

        <Form.Item name="images" label="Hình ảnh">
          <Upload
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            beforeUpload={(file) => {
              return false;
            }}
            listType="picture">
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        {/* <Form.Item
          name={'user'}
          label="Tên tài khoản"
          validateDebounce={1000}
          rules={[{ required: true, message: false }]}>
          <Input placeholder="example" id="usernameinput" disabled={noChangeAccount} />
        </Form.Item>

        {!noChangeAccount && (
          <Form.Item label="Mật khẩu" wrapperCol={{ span: 24 }}>
            <Space.Compact className="w-100">
              <Form.Item
                name={'pass'}
                rules={[{ required: true, message: false }]}
                wrapperCol={{ span: 24 }}
                className="w-100">
                <Input.Password
                  placeholder="Example@123"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
              <Button icon={<RedoOutlined />} onClick={randomPassword} />
            </Space.Compact>
          </Form.Item>
        )} */}

        <Form.Item
          wrapperCol={{
            span: 8,
            offset: 16
          }}
          className="mt-4">
          <Space>
            <Button id="btnCancel" onClick={hanldeClose}>
              Hủy
            </Button>
            <Button id="btnSubmit" htmlType="submit" type="primary">
              {formAction.actionText}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CameraForm;
