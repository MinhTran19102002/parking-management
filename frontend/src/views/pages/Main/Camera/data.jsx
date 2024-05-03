import dayjs from 'dayjs';
import React from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Avatar, Image, Space, Button, Typography } from 'antd';
import CustomedImage from '~/views/components/CustomedImage';

export const CAMERA_TYPES = ['normal', 'cam360'];

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
        {item.images?.map((img) => (
          <CustomedImage
            style={{ width: 60, height: 60, objectFit: 'cover', border: '1.6px solid #fff' }}
            src={img}
          />
        ))}
      </Avatar.Group>
    )
  },
  {
    title: 'CameraId',
    dataIndex: 'cameraId',
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
    key: 'zone',
    render: (text) => text || 'Chưa lắp'
  },
  {
    title: 'Luồng stream',
    dataIndex: 'streamLink',
    key: 'streamLink',
    render: (text) => (text ? <Typography.Link href={text}>Link</Typography.Link> : 'Chưa cài đặt')
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

export const CAMERAS = [
  {
    cameraId: 'CAM_02321',
    name: 'Camera khu A 01',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyFSaaO5lff7ydLlEzzGWu-PF-w-YKFyEJIES5E-vQ_A&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLQ7hiG7aMR8jHNiXYq--zclEzbagSBP4XjHXQCPckhV8mmvqiK5wGKcunuMXCvPdm7Lo&usqp=CAU'
    ],
    type: 'cam360',
    zone: null,
    slots: [],
    location: null,
    createAt: dayjs().format(),
    updateAt: dayjs().format()
  }
];
