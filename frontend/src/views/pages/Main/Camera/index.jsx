import React, { useContext, useEffect, useRef, useState } from 'react';
import { Card, Row, Table, Typography, Space, Button, Modal, Pagination, Input } from 'antd';
import { Content } from '~/views/layouts';
import {
  PlusOutlined,
  DeleteFilled,
  ExclamationCircleFilled,
  TrophyFilled
} from '@ant-design/icons';
import { CameraApi } from '~/api';
import { useSearchParams } from 'react-router-dom';
import AppContext from '~/context';
import { ErrorService } from '~/services';
import { hanldeColumes } from './data';
import CameraForm from './CameraForm';
import { useTranslation } from 'react-i18next';

function Camera({}) {
  const { actions } = useContext(AppContext);
  const [data, setData] = useState({
    data: [],
    totalCount: 0,
    totalPage: 0
  });
  const { totalCount, totalPage } = data;

  const [searchParams, setSearchParams] = useSearchParams({
    pageSize: '10',
    pageIndex: '1'
  });
  const pageIndex = Number(searchParams.get('pageIndex'));
  const pageSize = Number(searchParams.get('pageSize'));
  const params = { pageSize, pageIndex };
  for (let [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(false);
  const [selectedRows, setSeletedRows] = useState([]);
  const [formAction, setFormAction] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const [openFormEdit, setOpenFormEdit] = useState(false);
  const { t: lag } = useTranslation();

  const callApi = async () => {
    try {
      setLoading(true);
      const api = await CameraApi.getByFilter(params);
      setData({
        ...api
      });
      isMounted.current = true;
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    } finally {
      setLoading(false);
      setSeletedRows([]);
    }
  };

  useEffect(() => {
    callApi();
  }, [searchParams.toString()]);

  useEffect(() => {
    if (isMounted.current) {
      if (pageIndex > totalPage && pageIndex > 1) {
        setSearchParams({ ...params, pageIndex: totalPage });
      }
    }
  }, [data]);

  const onAdd = () => {
    setFormAction({
      action: 'add',
      actionText: lag('common:add'),
      title: lag('common:form:addCamera')
    });
    setOpenForm(true);
  };

  const onEdit = (values) => {
    setFormAction({
      action: 'edit',
      actionText: lag('common:edit'),
      title: lag('common:form:editCamera'),
      payload: { ...values }
    });
    setOpenForm(true);
  };

  const onDelete = async (values) => {
    try {
      setLoading(true);
      const api = await CameraApi.delete(values._id);
      setData(api);
      actions.onNoti({
        message: lag('common:deleteSuccess'),
        type: 'success'
      });
      resetAI();
      callApi();
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteMany = async () => {
    Modal.confirm({
      title: lag('common:popup:sure'),
      icon: <ExclamationCircleFilled />,
      content: lag('common:popup:dc'),
      okText: lag('common:popup:aggree'),
      okType: 'danger',
      cancelText: lag('common:cancel'),
      onOk() {
        hanldeDeleteMany();
      }
    });
  };

  const hanldeDeleteMany = async () => {
    try {
      actions.onMess({
        content: lag('common:form:deleting'),
        type: 'loading',
        duration: 1
      });
      const ids = selectedRows.map((e) => e._id);
      const api = await CameraApi.deleteMany(ids);
      setData(api);
      resetAI();
      actions.onNoti({
        message: lag('common:form:deleteAllSuccess'),
        type: 'success'
      });
      callApi();
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    } finally {
    }
  };

  const hanldeCloseForm = ({ reload }) => {
    setOpenForm(false);
    if (reload) callApi();
  };

  const onEnterFilter = (e) => {
    const { value, name } = e.target;
    setSearchParams({ ...params, [name]: value.toString().trim() });
  };

  const onChangeFilter = (e) => {
    const { value, name } = e.target;
    if (!value) {
      delete params[name];
      setSearchParams({ ...params });
    }
  };

  const rowSelection = {
    onChange: (_, selectedRows) => {
      setSeletedRows(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name
    })
  };

  const resetAI = async () => {
    try {
      await CameraApi.resetAi();
    } catch (error) {
      ErrorService.hanldeError(error, actions.onNoti);
    } finally {
    }
  };

  return (
    <Content className="w-100 py-3">
      <Modal
        title={formAction.title}
        open={openForm}
        onCancel={() => {
          setOpenForm(false);
        }}
        destroyOnClose={true}
        classNames={{ footer: 'd-none' }}>
        <CameraForm
          formAction={formAction}
          onClose={hanldeCloseForm}
          noChangeAccount={formAction.action === 'edit'}
          onNoti={actions.onNoti}
          onMess={actions.onMess}
          resetAI={resetAI}
        />
      </Modal>
      <Card
        title={
          <Typography.Title type="primary" level={4} className="mb-0">
            {lag('common:cameraPage:cameraList')}
          </Typography.Title>
        }
        extra={
          <Space>
            {selectedRows.length > 0 && (
              <Button
                id="btnDeleteMany"
                type="primary"
                icon={<DeleteFilled />}
                onClick={onDeleteMany}
                danger></Button>
            )}
            <Button id="btnAdd" type="primary" icon={<PlusOutlined />} onClick={onAdd}>
              {lag('common:add')}
            </Button>
          </Space>
        }
        className="box">
        <Row className="mt-2 mb-4 w-100">
          <Space>
            <Input
              style={{
                width: 320
              }}
              name="cameraId"
              placeholder={lag('common:name')}
              defaultValue={params.cameraId}
              onPressEnter={onEnterFilter}
              onChange={onChangeFilter}
              allowClear={true}
            />
          </Space>
        </Row>
        <Table
          columns={hanldeColumes({ pageIndex, pageSize, onEdit, onDelete }, lag)}
          dataSource={data.data || []}
          rowKey={(record) => record._id}
          pagination={false}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection
          }}
          loading={loading}
          scroll={{ y: 600, scrollToFirstRowOnChange: true }}
        />
        <Row className="mt-4 w-100" justify={'end'}>
          {data.totalCount ? (
            <Pagination
              total={totalCount}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
              pageSize={pageSize}
              current={pageIndex}
              loading={loading}
              showSizeChanger={true}
              pageSizeOptions={[10, 20, 30]}
              onChange={(page, pageSize) => {
                setSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  pageIndex: page,
                  pageSize
                });
              }}
            />
          ) : null}
        </Row>
      </Card>
    </Content>
  );
}

export default Camera;
