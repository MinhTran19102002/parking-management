import { DELETE, GET, POST, PUT } from '../axiosMethods';

const DOMAIN = import.meta.env.VITE_DOMAIN;

export default {
  get: (payload) => {
    const url = `${DOMAIN}/user/staff`;
    return GET({
      url,
      payload
    });
  },

  add: (payload) => {
    const url = `${DOMAIN}/user/employee`;
    return POST({
      url,
      payload
    });
  },

  delete: (_id) => {
    const url = `${DOMAIN}/user/employee?_id=${_id}`;
    return DELETE({
      url
    });
  },

  deleteMany: (ids) => {
    const url = `${DOMAIN}/user/employee/deletes`;
    return POST({
      url,
      payload: {
        ids
      }
    });
  }
};
