import React from 'react';
import { useTranslation } from 'react-i18next';
import { PureCard } from '~/views/components/Card';

function TopDriver({ id }) {
  const { t: lag } = useTranslation();
  return <PureCard title={lag(`common:reportPage:${id}`)}></PureCard>;
}

export default TopDriver;
