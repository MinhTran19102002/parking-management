import React, { useContext, useEffect } from 'react';
import { UserApi } from '~/api';
import AppContext from '~/context';
import { GetDrivers } from './data';

function DataFaker({}) {
  const { state } = useContext(AppContext);
  const fake = async () => {
    try {
      const api = UserApi.addDriver();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fake();
    console.log(GetDrivers(state.departments, state.jobs));
  }, []);
  return <div></div>;
}

export default DataFaker;
