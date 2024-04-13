import { GET, POST, PUT } from '../axiosMethods';

const DOMAIN = import.meta.env.VITE_DOMAIN;

export default {
  createNew: (payload) => {
    const url = `${DOMAIN}/parking/createParking`;
    return POST({
      url,
      payload
    });
  },

  getStatus: (payload) => {
    const url = `${DOMAIN}/parking/getStatus`;
    return GET({
      url,
      payload
    });
  },

  importVehicle: (payload) => {
    const { licenePlate, position, zone } = payload;
    let path = '/createPakingTurn';
    if (!position) {
      path = '/createPakingTurnWithoutPosition';
      if (!zone) {
        path = '/createPakingTurnWithoutZoneAndPosition';
      }
    }
    console.log('importVehicle', payload);
    const url = `${DOMAIN}/parkingTurn${path}`;

    return POST({
      url,
      payload,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  exportVehicle: (payload) => {
    const url = `${DOMAIN}/parkingTurn/outPaking`;

    return POST({
      url,
      payload
    });
  }
};
