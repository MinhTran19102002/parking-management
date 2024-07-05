import React, { useContext, useEffect } from 'react';
import { UserApi } from '~/api';
import AppContext from '~/context';
import { GetDrivers } from './data';

function DataFaker({}) {
  const { state } = useContext(AppContext);
  const fake = async () => {
    //Fake Driver
    // try {
    //   const data = GetDrivers(state.departments, state.jobs);
    //   const reponse = await Promise.all(data.map((item) => UserApi.addDriver(item)));
    // } catch (error) {
    //   console.log(error);
    // }

    try {
    } catch {}
  };
  useEffect(() => {
    fake();
  }, []);
  return <div></div>;
}

export default DataFaker;
