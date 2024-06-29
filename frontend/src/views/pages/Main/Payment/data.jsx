import { Tag } from 'antd';
import dayjs from 'dayjs';
import { FormatNumber } from '~/services';
import EventService from '~/services/EventService';
import { CustomedImage } from '~/views/components';

export const getColumns = ({ pageSize, pageIndex, onEdit, onDelete }, lag) => {
  return [
    {
      title: '#',
      dataIndex: 'key',
      width: 60,
      render: (_, prop, index) => (pageIndex - 1) * pageSize + index + 1
    },
    {
      title: lag('common:payment:createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => dayjs(text).format('L LTS')
    },
    {
      title: lag('common:licenePlate'),
      dataIndex: 'licenePlate',
      key: 'licenePlate'
    },
    {
      title: lag('common:fee'),
      dataIndex: 'fee',
      key: 'fee',
      render: (text) => FormatNumber(text, { isEndZeroDecimal: false })
    },
    {
      title: lag('common:isPay'),
      dataIndex: 'isPay',
      key: 'isPay',
      render: (isPay) => (
        <Tag color={isPay ? 'success' : 'error'}>
          {isPay ? lag('common:payment:isPay') : lag('common:payment:isNotPay')}
        </Tag>
      )
    },
    {
      title: lag('common:payment:registerStart'),
      dataIndex: 'startDay',
      key: 'startDay',
      render: (text) => dayjs(text).format('L LTS')
    },
    {
      title: lag('common:payment:endDate'),
      dataIndex: 'endDay',
      key: 'endDay',
      render: (text) => dayjs(text).format('L LTS')
    }
  ];
};
