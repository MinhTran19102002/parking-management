import dayjs from 'dayjs';
import EventService from '~/services/EventService';
import { CustomedImage } from '~/views/components';

export const getColumns = ({ pageSize, pageIndex, onEdit, onDelete }) => {
  return [
    {
      title: '#',
      dataIndex: 'key',
      width: 60,
      render: (_, prop, index) => (pageIndex - 1) * pageSize + index + 1
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => dayjs(text).format('L LTS'),
      sorter: (a, b) => a.createdAt - b.createdAt
    },
    {
      title: 'Tên sự kiện',
      dataIndex: 'name',
      key: 'eventName',
      render: (text) => EventService.getEventLabel(text),
      sorter: (a, b) => a.createdAt - b.createdAt
    },
    {
      title: 'Vị trí',
      dataIndex: ['parkingTurn', 'position'],
      key: 'position'
    },
    {
      title: 'Phí',
      dataIndex: ['parkingTurn', 'fee'],
      key: 'fee',
      sorter: (a, b) => a.parkingTurn.fee - b.parkingTurn.fee
    },
    {
      title: 'Chủ xe',
      dataIndex: ['person', 'name'],
      key: 'fee'
    },
    {
      title: 'SĐT',
      dataIndex: ['person', 'phone'],
      key: 'fee'
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (_, item) => <CustomedImage src={item?.parkingTurn?.image} width={40} height={40} />
    }
  ];
};
