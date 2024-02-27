import React, { useContext, useEffect, useState } from 'react';
import { Form, Modal, Input, Select, Button, Space, Card } from 'antd';
import { UserApi } from '~/api';
import { ErrorService, ValidateService } from '~/services';
import AppContext from '~/context';
import EmployeeApi from '~/api/Collections/EmployeeApi';
import { RedoOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 18 }
  }
};

const DEFAULT_PASSWORD = 'Parking@123';

function UserForm({ isOpen, onClose, formAction, noChangeAccount, role = 'Manager' }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { state, actions } = useContext(AppContext);
  const { onNoti, onMess } = actions;

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
      delete values.pass;
      const api = await UserApi.editManager(formAction.payload._id, values);
      if (api) {
        onNoti({ message: 'Chỉnh sửa người dùng thành công', type: 'success' });
      }
      onClose({ reload: true, newValues: api });
    } catch (error) {
      ErrorService.hanldeError(error, onNoti);
    } finally {
      setLoading(false);
    }
  };

  const hanldeAdd = async (values) => {
    const account = {
      username: values?.user,
      password: values?.pass
    };

    try {
      values.account = account;
      delete values.user;
      delete values.pass;
      setLoading(true);
      const api = await UserApi.addManager(values);
      if (api) {
        onNoti({ message: 'Thêm người dùng thành công', type: 'success' });
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
        <Form.Item name={'name'} label="Họ và tên" rules={[{ required: true }]}>
          <Input placeholder="Nguyễn Văn A" id="nameInput" />
        </Form.Item>

        <Form.Item
          name={'email'}
          label="Email"
          rules={[{ required: true, message: false }, { type: 'email' }]}>
          <Input placeholder="example@gmail.com" id="emailInput" />
        </Form.Item>

        <Form.Item
          name={'phone'}
          label="Số điện thoại"
          validateDebounce={1000}
          rules={[
            { required: true, message: false },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (ValidateService.phone(value)) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error('Sai định dang, SĐT phải là 10 số'));
              }
            })
          ]}>
          <Input placeholder="0357647771" id="phoneInput" addonBefore={'+87'} />
        </Form.Item>
        <Form.Item name={'address'} label="Địa chỉ" rules={[{ required: true, message: false }]}>
          <Input placeholder="Số 1 Võ Văn Ngân, Linh Chiểu" id="addressInput" />
        </Form.Item>
        <Form.Item
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
        )}

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

export default UserForm;
