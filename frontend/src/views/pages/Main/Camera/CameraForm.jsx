import React, { useContext, useEffect, useState } from 'react';
import { Form, Modal, Input, Select, Button, Space, Upload } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { CameraApi, UserApi } from '~/api';
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

function CameraForm({ isOpen, onClose, formAction, noChangeAccount, resetAI }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { state, actions } = useContext(AppContext);
  const { onNoti, onMess } = actions;
  const { t: lag, i18n } = useTranslation();
  const [fileList, setFileList] = useState([]);
  const [imageFile, setImageFile] = useState();

  const hanldeClose = (action, values) => {
    form.resetFields();
    onClose({});
  };

  useEffect(() => {
    if (formAction.action === 'edit') {
      form.setFieldsValue({ ...formAction.payload });
      setFileList([formAction.payload.image]);
      setImageFile(formAction.payload.image);
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
      delete values['image'];
      const api = await CameraApi.edit(formAction.payload._id, { ...values });
      if (api) {
        onNoti({ message: lag('common:form:editSuccess'), type: 'success' });
        resetAI();
      }
      onClose({ reload: true, newValues: api });
    } catch (error) {
      ErrorService.hanldeError(error, onNoti);
    } finally {
      setLoading(false);
    }
  };

  const hanldeAdd = async (values) => {
    try {
      delete values['image'];
      if (!values.streamLink) delete values.streamLink;
      setLoading(true);
      const api = await CameraApi.add({
        ...values
        // image: imageFile
      });
      if (api) {
        onNoti({ message: lag('common:form:addSuccess'), type: 'success' });
        resetAI();
      }
      onClose({ reload: true });
    } catch (error) {
      ErrorService.hanldeError(error, onNoti);
    } finally {
      setLoading(false);
    }
  };

  const randomPassword = () => {
    form.setFieldValue('pass', DEFAULT_PASSWORD);
  };

  return (
    <div className="container-fluid pt-3">
      <Form
        form={form}
        onFinish={onFinish}
        disabled={loading}
        {...formItemLayout}
        style={{ maxWidth: 4000 }}>
        <Form.Item name={'cameraId'} label="Camera ID" rules={[{ required: true }]}>
          <Input disabled={formAction.action === 'edit'} placeholder={lag('common:enter')} id="cameraIdInput" />
        </Form.Item>

        <Form.Item name={'streamLink'} label={lag('common:cameraPage:streamLink')}>
          <Input placeholder={lag('common:enter')} id="streamLink" />
        </Form.Item>

        <Form.Item
          name={'type'}
          label={lag('common:type')}
          rules={[{ required: true, message: false }]}>
          <Select
            id="cameraTypeInput"
            placeholder={lag('common:enter')}
            options={CAMERA_TYPES.map((type) => {
              return { value: type, label: lag('common:camera:type:' + type) };
            })}
          />
        </Form.Item>

        <Form.Item
          name={'aiType'}
          label={lag('common:camera:cameraAi:title')}
          rules={[{ message: false }]}>
          <Select
            id="cameraTypeAi"
            placeholder={lag('common:choose')}
            options={state.cameraInfor.aiTypes.map((type) => {
              return { value: type, label: lag('common:camera:cameraAi:types:' + type) };
            })}
            allowClear
          />
        </Form.Item>

        {/* <Form.Item name={'image'} label={lag('common:image')}>
          <Upload
            accept="image/jpeg,image/jpg,image/png,image/webp"
            beforeUpload={(file) => {
              return false;
            }}
            maxCount={1}
            fileList={fileList}
            onChange={({ file, fileList: newFileList }) => {
              setFileList(newFileList);
              setImageFile(file);
            }}
            listType="picture">
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item> */}

        <Form.Item
          wrapperCol={{
            span: 8,
            offset: 16
          }}
          className="mt-4">
          <Space>
            <Button id="btnCancel" onClick={hanldeClose}>
              {lag('common:cancel')}
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
