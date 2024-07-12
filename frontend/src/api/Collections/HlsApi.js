import { DELETE, GET, POST, PUT } from '../axiosMethods';

const DOMAIN = import.meta.env.VITE_DOMAIN_HLS;

export default {
  getAll: () => {
    const url = `${DOMAIN}/streams`;
    return GET({
      url
    });
  },

  addHLS: (payload = {}) => {
    const url = `${DOMAIN}/stream/add`;
    return POST({
      url,
      payload
    });
  },

  deleteHLS: (id = '') => {
    const url = `${DOMAIN}/stream/remove/${id}`;
    return POST({
      url
    });
  },

  live: (id) => {
    const url = `${DOMAIN}/stream/live/${id}`;
    return GET({
      url
    });
  }
};
