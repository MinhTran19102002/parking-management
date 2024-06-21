import dayjs from 'dayjs';
import EventService from '~/services/EventService';

export const getColumns = ({ pageSize, pageIndex, onEdit, onDelete }, lag) => {
  return [
    {
      title: '#',
      dataIndex: 'key',
      width: 60,
      render: (_, prop, index) => (pageIndex - 1) * pageSize + index + 1
    },
    {
      title: lag('common:time'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => dayjs(text).format('L LTS'),
      sorter: (a, b) => a.createdAt - b.createdAt
    },
    {
      title: lag('common:eventName'),
      dataIndex: 'name',
      key: 'eventName',
      render: (text) => lag(`event:byName:${text}`)
    },
    {
      title: lag('common:position'),
      dataIndex: ['parkingTurn', 'position'],
      key: 'position'
    },
    {
      title: lag('common:fee'),
      dataIndex: ['parkingTurn', 'fee'],
      key: 'fee',
      sorter: (a, b) => a.parkingTurn.fee - b.parkingTurn.fee
    }
  ];
};
