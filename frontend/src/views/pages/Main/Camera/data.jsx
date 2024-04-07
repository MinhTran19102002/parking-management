import dayjs from 'dayjs';
import React from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
export const hanldeColumes = ({ pageIndex, pageSize, onEdit, onDelete }) => [
  {
    title: '#',
    dataIndex: 'key',
    width: 60,
    render: (_, prop, index) => (pageIndex - 1) * pageSize + index + 1
  },
  {
    title: 'Hình ảnh',
    dataIndex: 'images',
    key: 'images',
    render: (_, item) => (
      <Avatar.Group shape="square">
        {item.images.map((img) => (
          <Avatar
            src={img}
            style={{
              backgroundColor: '#fde3cf'
            }}
          />
        ))}
      </Avatar.Group>
    )
  },
  {
    title: 'CameraId',
    dataIndex: 'CameraId',
    render: (_, item) => <Avatar size={48} src={item.cameraId} />,
    sorter: (a, b) => a.name - b.name
  },
  {
    title: 'Tên',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name - b.name
  },

  {
    title: 'Loại',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: 'Khu vực',
    dataIndex: 'zone',
    key: 'zone'
  },
  {
    title: 'Ngày mua',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (_, item) => dayjs(item.createdAt).format('L')
  },
  {
    title: 'Ngày chỉnh sửa',
    dataIndex: 'updateAt',
    key: 'updateAt',
    render: (_, item) => dayjs(item.updateAt).format('L')
  }
];
