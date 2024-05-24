import React, { useEffect, useState } from 'react';
import { Form, Modal, Input, Select, Button, Space, Card } from 'antd';
import { MinusCircleOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { ErrorService, ValidateService } from '~/services';
import { UserApi } from '~/api';

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

function DriverForm({ isOpen, onClose, formAction = {}, onNoti, onMess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const hanldeClose = () => {
    form.resetFields();
    onClose({});
  };

  useEffect(() => {
    if (formAction.action === 'edit') {
      const { payload } = formAction;
      let licenePlate = [];
      if (payload.vehicle) {
        licenePlate = payload.vehicle?.map((el) => el.licenePlate);
      }
      delete payload.vehicle;
      form.setFieldsValue({ ...payload, licenePlate });
    }
  }, [formAction]);

  const hanldeEdit = async (values) => {
    try {
      setLoading(true);
      const api = await UserApi.editDriver(formAction.payload._id, values);
      if (api) {
        onNoti({ message: 'Chỉnh sửa chủ xe thành công', type: 'success' });
      }
      onClose({ reload: true });
    } catch (error) {
      ErrorService.hanldeError(error, onNoti);
    } finally {
      setLoading(false);
    }
  };

  const hanldeAdd = async (values) => {
    try {
      setLoading(true);
      const api = await UserApi.addDriver(values);
      if (api) {
        onNoti({ message: 'Thêm chủ xe thành công', type: 'success' });
      }
      onClose({ reload: true });
    } catch (error) {
      ErrorService.hanldeError(error, onNoti);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    if (formAction.action === 'add') {
      hanldeAdd(values);
    } else {
      hanldeEdit(values);
    }
  };

  return (
    <div className="container-fluid pt-3">
      <Form form={form} onFinish={onFinish} disabled={loading} {...formItemLayout}>
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

        {/* <Form.List name="vehicle">
        {(fields, { add, remove }) => (
          <div
            style={{
              display: 'flex',
              rowGap: 16,
              flexDirection: 'column'
            }}>
            {fields.map((field) => (
              <Card
                size="small"
                title={`Xe ${field.name + 1}`}
                key={field.key}
                extra={
                  <CloseOutlined
                    onClick={() => {
                      remove(field.name);
                    }}
                  />
                }>
                <Form.Item label="Biển số xe" name={[field.name, 'licenePlate']}>
                  <Input />
                </Form.Item>
                <Form.Item label="Loại xe" name={[field.name, 'type']}>
                  <Input />
                </Form.Item>
              </Card>
            ))}

            <Form.Item
              shouldUpdate={(pre, curr) => pre.vehicle !== curr.vehicle}
              wrapperCol={{ span: 24 }}>
              {({ getFieldValue }) => {
                const currVeh = getFieldValue('vehicle');
                const disabled = (currVeh?.length || 0) >= 2;
                return (
                  <Button disabled={disabled} type="dashed" onClick={() => add()} block>
                    + Thêm một xe
                  </Button>
                );
              }}
            </Form.Item>
          </div>
        )}
      </Form.List> */}

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

export default DriverForm;
