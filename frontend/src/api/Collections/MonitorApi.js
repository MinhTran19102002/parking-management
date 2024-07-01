import { GET, POST } from '../axiosMethods';

const DOMAIN = import.meta.env.VITE_DOMAIN;

export default {
  getStatusByZone: (zone) => {
    const url = `${DOMAIN}/parking/getStatusByZone`;
    return GET({
      url,
      payload: {
        zone
      }
    });
  },

  getVehicleInOutNumber: (payload) => {
    const url = `${DOMAIN}/parkingTurn/Reports/GetVehicleInOutNumber`;
    return GET({
      url,
      payload
    });
  },

  getVehicleToday: (payload) => {
    const url = `${DOMAIN}/parkingTurn/Reports/GetVehicleInOutNumberByHour`;
    return GET({
      url,
      payload
    });
  },

  getRevenue: (payload) => {
    const url = `${DOMAIN}/parkingTurn/Reports/GetRevenue`;
    return GET({
      url,
      payload
    });
  },

  getAllDriver: () => {
    const url = `${DOMAIN}/user/driver`;
    return GET({
      url
    });
  },

  getEvents: (payload) => {
    const url = `${DOMAIN}/parkingTurn/event`;
    return GET({
      url,
      payload
    });
  },

  export: () => {
    const url = `${DOMAIN}/parkingTurn/event/export`;
    return GET({
      url,
      responseType: 'blob'
    });
  },

  getEventsOfDriverByPhone: (phone) => {
    const url = `${DOMAIN}/parkingTurn/event/getByDriver`;
    return GET({
      url,
      payload: {
        phone
      }
    });
  },

  captureImageFromStream: () => {
    const url = `${DOMAIN}/service/imagecap`;
    return GET({
      url
    });
  },

  getLicensesFromStream: () => {
    const url = `${DOMAIN}/service/licenseS`;
    return GET({
      url
    });
  },

  getReportGeneral: (payload) => {
    const url = `${DOMAIN}/report/general`;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            zone: 'A',
            entries: 1234,
            exists: 1243,
            fee: 23123212,
            avgParkTime: 4,
            parkingLotFullCount: 23
          },
          {
            zone: 'B',
            entries: 1234,
            exists: 1243,
            fee: 23123212,
            avgParkTime: 4,
            parkingLotFullCount: 23
          },
          {
            zone: 'C',
            entries: 1234,
            exists: 1243,
            fee: 23123212,
            avgParkTime: 4,
            parkingLotFullCount: 23
          },
          {
            zone: 'D',
            entries: 1234,
            exists: 1243,
            fee: 23123212,
            avgParkTime: 4,
            parkingLotFullCount: 23
          },
          {
            zone: 'E',
            entries: 1234,
            exists: 1243,
            fee: 23123212,
            avgParkTime: 4,
            parkingLotFullCount: 23
          },
          {
            zone: 'F',
            entries: 1234,
            exists: 1243,
            fee: 23123212,
            avgParkTime: 4,
            parkingLotFullCount: 23
          }
        ]);
      }, 1000);
    });
    // return GET({
    //   url,
    //   payload
    // });
  }
};
