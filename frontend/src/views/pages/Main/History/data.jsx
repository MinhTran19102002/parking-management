import dayjs from 'dayjs';
import EventService from '~/services/EventService';

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
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => dayjs(text).format('L LTS'),
      sorter: (a, b) => a.createdAt - b.createdAt
    }
  ];
};
