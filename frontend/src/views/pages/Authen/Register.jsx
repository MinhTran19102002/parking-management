import React, { useContext, useEffect, useState } from 'react';
import { Form, Modal, Input, Select, Button, Space, Card, theme, Layout, Typography } from 'antd';
import { MinusCircleOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { ErrorService, ValidateService } from '~/services';
import { UserApi } from '~/api';
import { Content } from '~/views/layouts';
import { useNavigate } from 'react-router-dom';
import AppContext from '~/context';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 6
    }
  },
  wrapperCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 18
    }
  }
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 18,
      offset: 6
    }
  }
};
function Register({}) {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { actions } = useContext(AppContext);
  const { onNoti } = actions;

  const navigateLoginPage = () => {
    navigate('/auth/login');
  };
  const hanldeClose = () => {
    navigateLoginPage();
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        account: {
          username: values.phone,
          password: values.password
        }
      };
      delete payload['confirmNewPassword'];
      delete payload['password'];
      const api = await UserApi.addDriver(payload);
      if (api) {
        onNoti({ message: 'Thêm chủ xe thành công', type: 'success' });
      }
      navigateLoginPage();
    } catch (error) {
      ErrorService.hanldeError(error, onNoti);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Content className="d-flex justify-content-center align-items-center w-100 h-100">
      <div
        className="py-4 px-4"
        style={{ backgroundColor: token.colorBgContainer, borderRadius: token.borderRadiusLG }}>
        <Typography.Title level={2} className="text-center">
          Đăng ký tài khoản
        </Typography.Title>
        <Form
          form={form}
          onFinish={onFinish}
          disabled={loading}
          {...formItemLayout}
          style={{ width: 600 }}>
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
            <Input placeholder="0357647771" id="phoneInput" addonBefore={'+84'} />
          </Form.Item>
          <Form.Item name={'address'} label="Địa chỉ" rules={[{ required: true, message: false }]}>
            <Input placeholder="Số 1 Võ Văn Ngân, Linh Chiểu" id="addressInput" />
          </Form.Item>
          <Form.Item label="Nghề nghiệp" name={['job']} rules={[{ required: true }]}>
            <Select id="jobInput">
              <Select.Option id="selectTeacher" value="Teacher">
                Giảng viên
              </Select.Option>
              <Select.Option id="selectStudent" value="Student">
                Sinh viên
              </Select.Option>
              <Select.Option id="selectEmployee" value="Employee">
                Nhân viên
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Đơn vị" name={['department']} rules={[{ required: true }]}>
            <Input placeholder="Công nghệ thông tin" />
          </Form.Item>
          <Form.List name={'licenePlate'}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, ix) => {
                  return (
                    <Form.Item
                      key={'licenePlate' + ix}
                      label={ix === 0 && 'Biển số xe'}
                      required={true}
                      {...(ix !== 0 && formItemLayoutWithOutLabel)}>
                      <Form.Item
                        {...field}
                        key={'vehicle' + ix}
                        name={[field.name]}
                        noStyle
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
                        <Input
                          placeholder="12A-2184"
                          style={{
                            width: '80%'
                          }}
                        />
                      </Form.Item>

                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          className="dynamic-delete-button ms-4"
                          onClick={() => remove(field.name)}
                        />
                      ) : null}
                    </Form.Item>
                  );
                })}
                <Form.Item label="" wrapperCol={{ span: 24 }}>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{
                      width: '100%'
                    }}
                    icon={<PlusOutlined />}>
                    Thêm xe
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item
            label="Mật khẩu"
            name={['password']}
            rules={[
              {
                required: true
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (ValidateService.password(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không đúng định dạng'));
                }
              })
            ]}>
            <Input.Password visibilityToggle={true} />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmNewPassword"
            dependencies={['password']}
            rules={[
              {
                required: true
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không trùng khớp'));
                }
              })
            ]}>
            <Input.Password visibilityToggle={true} />
          </Form.Item>
          <Form.Item
            label={''}
            className="mt-4"
            wrapperCol={{
              offset: 6
            }}>
            <Space>
              <Button id="btnCancel" onClick={hanldeClose}>
                Hủy
              </Button>
              <Button id="btnSubmit" htmlType="submit" type="primary">
                Xác nhận
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </Content>
  );
}

export default Register;
