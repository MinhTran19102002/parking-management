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
    const url = `${DOMAIN}/parkingTurn/Reports/general`;
    return GET({
      url,
      payload
    });
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
    const url = `${DOMAIN}/parkingTurn/Reports/inoutByJob`;
    return GET({
      url,
      payload
    });
  },

  getInoutByDepartments: (payload) => {
    const url = `${DOMAIN}/parkingTurn/Reports/inoutByDepa`;
    return GET({
      url,
      payload
    });
  },

  getMostParkedVehicle: (payload) => {
    const url = `${DOMAIN}/parkingTurn/Reports/mostParkedVehicle`;
    return GET({
      url,
      payload
    });
  },

  exportReport: (payload) => {
    const url = `${DOMAIN}/parkingTurn/Reports/exportReport`;
    return GET({
      url,
      payload,
      responseType: 'blob'
    });
  }
};
