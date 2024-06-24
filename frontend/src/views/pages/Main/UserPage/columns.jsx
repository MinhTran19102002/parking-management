import React from 'react';
import { Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export default ({ pageSize, pageIndex, onEdit, onDelete }, lag) => {
  return [
    {
      title: '#',
      dataIndex: 'key',
      width: 60,
      render: (_, prop, index) => (pageIndex - 1) * pageSize + index + 1
    },
    {
      title: lag('common:name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name - b.name
    },
    {
      title: lag('common:phone'),
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: lag('common:address'),
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: lag('common:createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (_, record, index) => dayjs(record.createdAt).format('L')
    },
    {
      title: '',
      dataIndex: 'actions',
      key: 'actions',
      width: 120,
      render: (_, record, ix) => (
        <Space>
          <Button
            id={`btnEdit${ix}`}
            icon={<EditOutlined />}
            type="text"
            onClick={() => {
              onEdit(record);
            }}
          />
          <Button
            id={`btnDelete${ix}`}
            icon={<DeleteOutlined />}
            type="text"
            onClick={() => {
              onDelete(record);
            }}
          />
        </Space>
      )
    }
  ];
};
