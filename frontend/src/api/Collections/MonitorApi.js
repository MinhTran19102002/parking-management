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
  },

  getVisistorRate: (payload) => {
    const url = `${DOMAIN}/parkingTurn/Reports/visistorRate`;
    return GET({
      url,
      payload
    });
  },

  getInoutByTime: (payload) => {
    const url = `${DOMAIN}/parkingTurn/Reports/inoutByTime`;
    return GET({
      url,
      payload
    });
  },

  getInoutByJob: (payload) => {
    const url = `${DOMAIN}/report/inoutByJob`;
    const { jobs } = payload;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          jobs.map((job) => {
            return {
              job,
              value: Math.random() * 1000
            };
          })
        );
      }, 1000);
    });
    // return GET({
    //   url,
    //   payload
    // });
  },

  getInoutByDepartments: (payload) => {
    const url = `${DOMAIN}/report/inoutByDepartment`;
    const { xFileds } = payload;
    const data = xFileds.reduce((acc, department) => {
      acc.push({
        department,
        turn: Number(Math.random() * 1000).toFixed()
      });

      return acc;
    }, []);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 1000);
    });
    // return GET({
    //   url,
    //   payload
    // });
  },

  getMostParkedVehicle: (payload) => {
    const url = `${DOMAIN}/report/mostParkedVehicle`;
    const data = [];
    for (let i = 0; i < 30; i++) {
      data.push({
        vehicle: {
          licenePlate: '12A-3214',
          type: 'Car'
        },
        driver: {
          name: 'Trần Trung Hậu'
        },
        data: {
          turn: Math.random() * 10000
        }
      });
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 1000);
    });
    // return GET({
    //   url,
    //   payload
    // });
  }
};
