import React, { useContext, useEffect } from 'react';
import { ParkingApi, UserApi } from '~/api';
import AppContext from '~/context';
import { GetDrivers, GetParkingsTurn } from './data';

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
      const parkingTurns = await Promise.all(GetParkingsTurn());

      // const inApi = parkingTurns.map((el) => {
      //   return ParkingApi.importVehicle(el);
      // });

      const inSlotApi = Promise.all(
        parkingTurns.map((el) => {
          return ParkingApi.exportSlotVehicle({
            licenePlate: el.licenePlate
          });
        })
      );
      console.log(inApi);
    } catch {}
  };
  useEffect(() => {
    fake();
  }, []);
  return <div></div>;
}

export default DataFaker;
