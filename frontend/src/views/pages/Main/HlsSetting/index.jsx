import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Flex, Layout, Modal, Space, Table } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HlsApi } from '~/api';
import CustomedTable from '~/views/components/Table';
import HlsForm from './HlsForm';
import AppContext from '~/context';
import { ErrorService } from '~/services';

function HlsSetting({}) {
  const { t: lag } = useTranslation();
  const [editForm, setEditForm] = useState({
    isOpen: false,
    initialData: null
  });
  const [formAction, setFormAction] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const { actions } = useContext(AppContext);

  const {
    data,
    refetch,
    isFetching: loading
  } = useQuery({
    queryKey: ['HlsSetting', 'Data'],
    initialData: [],
    queryFn: async () => {
      let rs = [];
      try {
        const api = await HlsApi.getAll();
        rs = Object.keys(api).reduce((acc, curr) => {
          const item = api[curr];
          acc.push({
            cameraId: curr,
            rtspUrl: item.rtsp_url,
            hlsPostfix: item.hls_postfix
          });
          return acc;
        }, []);
      } catch (error) {
        console.log(error);
      }
      return rs;
    }
  });
  useEffect(() => {
    refetch();
  }, []);

  const onAdd = () => {
    setFormAction({
      action: 'add',
      actionText: lag('common:add'),
      title: lag('common:add')
    });
    setOpenForm(true);
  };

  const onEdit = (cameraId) => {
    const values = data.find((el) => el.cameraId === cameraId) || {};
    setFormAction({
      action: 'edit',
      actionText: lag('common:edit'),
      title: lag('common:edit'),
      payload: { ...values }
    });
    setOpenForm(true);
  };

  const hanldeCloseForm = ({ reload }) => {
    setOpenForm(false);
    if (reload) refetch();
  };

  const onSubmit = async (values) => {
    const { action } = formAction;
    try {
      if (action === 'add') {
        await HlsApi.addHLS(values);
        actions.onNoti({ message: lag('common:form:addSuccess'), type: 'success' });
      } else if (action === 'edit') {
        //Edit
      }
      refetch();
      setOpenForm(false);
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    }
  };

  const onDelete = async (values) => {
    try {
      actions.onMess({
        content: lag('common:form:deleting'),
        type: 'loading',
        duration: 1
      });
      const api = await HlsApi.deleteHLS(values);
      actions.onNoti({
        message: lag('common:form:deleting'),
        type: 'success'
      });
      refetch();
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    }
  };

  return (
    <Layout className="mt-4">
      <Flex justify="end">
        <Button type="primary" onClick={onAdd}>
          {lag('common:add')}
        </Button>
      </Flex>
      <Modal
        title={formAction.title}
        open={openForm}
        onCancel={() => {
          setOpenForm(false);
        }}
        destroyOnClose={true}
        classNames={{ footer: 'd-none' }}>
        <HlsForm
          lag={lag}
          formAction={formAction}
          isOpen={openForm}
          onClose={hanldeCloseForm}
          onNoti={actions.onNoti}
          onMess={actions.onMess}
          onSubmit={onSubmit}
        />
      </Modal>
      <br />
      <Table
        dataSource={data}
        columns={[
          {
            title: 'Camera Id',
            dataIndex: ['cameraId'],
            key: 'cameraId'
          },
          {
            title: 'RTSP URL',
            dataIndex: ['rtspUrl'],
            key: 'rtspUrl'
          },
          {
            title: 'HLS path',
            dataIndex: ['hlsPostfix'],
            key: 'hlsPostfix',
            render: (text) => import.meta.env.VITE_DOMAIN_HLS + text
          },
          {
            title: '',
            key: 'actions',
            render: (_, record, ix) => {
              return (
                <Space>
                  <Button
                    id={`btnEdit${ix}`}
                    icon={<EditOutlined />}
                    type="text"
                    onClick={() => {
                      onEdit(record.cameraId);
                    }}
                  />
                  <Button
                    id={`btnDelete${ix}`}
                    icon={<DeleteOutlined />}
                    type="text"
                    onClick={() => {
                      onDelete(record.cameraId);
                    }}
                  />
                </Space>
              );
            }
          }
        ]}
      />
    </Layout>
  );
}

export default HlsSetting;
