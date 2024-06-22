import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, Form, Input, Space, Typography } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, RedoOutlined } from '@ant-design/icons';
import AppContext from '~/context';
import { ErrorService, ValidateService } from '~/services';
import { UserApi } from '~/api';
import { useTranslation } from 'react-i18next';

function PasswordForm({ account, isOpen, onClose, noChangeAccount }) {
  const [form] = Form.useForm();
  const { state, actions } = useContext(AppContext);
  const { onNoti, onMess } = actions;
  const [loading, setLoading] = useState(false);
  const { t: lag } = useTranslation();
  const hanldeClose = (action, values) => {
    form.resetFields();
    onClose({});
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      delete values.confirmNewPassword;
      const newPayloay = {
        ...account,
        ...values
      };
      const api = await UserApi.changePassword({ ...newPayloay });
      if (api) {
        onMess({ content: 'Chỉnh sửa nhân viên thành công', type: 'success' });
      }

      onClose({
        afterAction: () => {
          actions.onSetChangePassword();
          actions.logout();
        }
      });
      // onClose();
    } catch (error) {
      ErrorService.hanldeError(error, onNoti);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      autoComplete="off"
      style={{
        maxWidth: 600
      }}
      disabled={loading}
      onFinish={onFinish}
      layout="vertical">
      <div className="py-2">
        {/* <Form.Item
          name={'username'}
          label="Tên tài khoản"
          validateDebounce={1000}
          rules={[{ required: true, message: false }]}>
          <Input placeholder="example" id="usernameinput" disabled={noChangeAccount} />
        </Form.Item> */}
        <Form.Item
          label={lag('common:oldPassword')}
          name="password"
          rules={[
            {
              required: true
            }
          ]}>
          <Input.Password visibilityToggle={true} />
        </Form.Item>

        <Form.Item
          label={lag('common:newPassword')}
          name="newPassword"
          rules={[
            {
              required: true
            },
            ({ getFieldValue }) => ({
              validator(_, value) {f
                if (ValidateService.password(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(lag('common:form:formatPassword')));
              }
            })
          ]}>
          <Input.Password visibilityToggle={true} />
        </Form.Item>

        {/* Field */}
        <Form.Item
          label={lag('common:confirmNewPassword')}
          name="confirmNewPassword"
          dependencies={['password']}
          rules={[
            {
              required: true
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(lag('common:form:passwordNotSame')));
              }
            })
          ]}>
          <Input.Password visibilityToggle={true} />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            span: 8,
            offset: 16
          }}
          className="mt-4">
          <Space>
            <Button onClick={hanldeClose}>{lag('common:cancel')}</Button>
            <Button htmlType="submit" type="primary">
              {lag('common:confirm')}
            </Button>
          </Space>
        </Form.Item>
      </div>
    </Form>
  );
}

export default PasswordForm;
