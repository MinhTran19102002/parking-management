import { DELETE, GET, POST, PUT } from '../axiosMethods';

const DOMAIN = import.meta.env.VITE_DOMAIN;

export default {
  get: (payload) => {
    const url = `${DOMAIN}/user/staff/filter`;
    return GET({
      url,
      payload
    });
  },

  add: (payload) => {
    const url = `${DOMAIN}/user/staff`;
    return POST({
      url,
      payload,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  delete: (_id) => {
    const url = `${DOMAIN}/user/staff?_id=${_id}`;
    return DELETE({
      url
    });
  },

  deleteMany: (ids) => {
    const url = `${DOMAIN}/user/staff/deletes`;
    return POST({
      url,
      payload: {
        ids
      }
    });
  }
};
