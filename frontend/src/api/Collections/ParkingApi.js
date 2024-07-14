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

  getStatusByDriver: (payload) => {
    const url = `${DOMAIN}/parking/getStatusByDriver`;
    return GET({
      url,
      payload
    });
  },

  importVehicle: (payload) => {
    const { licenePlate, position, zone } = payload;
    delete payload.position;
    delete payload.zone;
    const path = '/createPakingTurnWithoutZoneAndPosition';
    const url = `${DOMAIN}/parkingTurn${path}`;

    return POST({
      url,
      payload,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  importSlotVehicle: (payload) => {
    const url = `${DOMAIN}/parkingTurn/carInSlot`;

    return POST({
      url,
      payload
    });
  },

  exportSlotVehicle: (payload) => {
    const url = `${DOMAIN}/parkingTurn/carOutSlot`;

    return POST({
      url,
      payload
    });
  },

  exportVehicle: (payload) => {
    const url = `${DOMAIN}/parkingTurn/outPaking`;
    3;
    return POST({
      url,
      payload
    });
  }
};
