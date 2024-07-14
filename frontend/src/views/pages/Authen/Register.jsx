import React, { useContext, useEffect, useState } from 'react';
import { Form, Modal, Input, Select, Button, Space, Card, theme, Layout, Typography } from 'antd';
import { MinusCircleOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { ErrorService, ValidateService } from '~/services';
import { UserApi } from '~/api';
import { Content } from '~/views/layouts';
import { useNavigate } from 'react-router-dom';
import AppContext from '~/context';
import { useTranslation } from 'react-i18next';

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
  const { state } = useContext(AppContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { actions } = useContext(AppContext);
  const { onNoti } = actions;
  const { t: lag } = useTranslation();

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
          {lag('common:register')}
        </Typography.Title>
        <Form
          form={form}
          onFinish={onFinish}
          disabled={loading}
          {...formItemLayout}
          style={{ width: 800 }}>
          <Form.Item name={'name'} label={lag('common:fullName')} rules={[{ required: true }]}>
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
            label={lag('common:phone')}
            validateDebounce={1000}
            rules={[
              { required: true, message: false },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (ValidateService.phone(value)) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error(lag('common:form:wrongFormat')));
                }
              })
            ]}>
            <Input placeholder="0357647771" id="phoneInput" addonBefore={'+84'} />
          </Form.Item>
          <Form.Item
            name={'address'}
            label={lag('common:address')}
            rules={[{ required: true, message: false }]}>
            <Input placeholder="Số 1 Võ Văn Ngân, Linh Chiểu" id="addressInput" />
          </Form.Item>
          <Form.Item label={lag('common:job')} name={['job']} rules={[{ required: true }]}>
            <Select id="jobInput">
              {state.jobs.map((job) => (
                <Select.Option id="selectTeacher" key={job} value={job}>
                  {lag(`common:jobs:${job}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={lag('common:department')}
            name={['department']}
            rules={[{ required: true }]}>
            <Select
              options={state.departments.map((de) => {
                return {
                  value: de,
                  label: lag(`department:${de}`)
                };
              })}
            />
          </Form.Item>
          <Form.List name={'licenePlate'}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, ix) => {
                  return (
                    <Form.Item
                      key={'licenePlate' + ix}
                      label={ix === 0 && lag('common:licenePlate')}
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
                              return Promise.reject({
                                message: `${lag('common:form:wrongFormat')} (VD: 12A-2184)`
                              });
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
                    {lag('common:form:addCar')}
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
                  return Promise.reject(new Error(lag('common:form:formatPassword')));
                }
              })
            ]}>
            <Input.Password visibilityToggle={true} />
          </Form.Item>
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
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(lag('common:form:passwordNotSame')));
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
                {lag('common:cancel')}
              </Button>
              <Button id="btnSubmit" htmlType="submit" type="primary">
                {lag('common:confirm')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </Content>
  );
}

export default Register;
