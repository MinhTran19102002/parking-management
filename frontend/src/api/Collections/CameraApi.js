import { DELETE, GET, POST, PUT } from '../axiosMethods';

const DOMAIN = import.meta.env.VITE_DOMAIN;

const CameraApi = {
  getByFilter: (payload) => {
    const url = `${DOMAIN}/camera`;
    return GET({
      url,
      payload
    });
  },

  getUnused: (payload) => {
    const url = `${DOMAIN}/camera/unused`;
    return GET({
      url,
      payload
    });
  },

  add: (payload) => {
    const url = `${DOMAIN}/camera`;
    return POST({
      url,
      payload
    });
  },

  edit: (_id, payload) => {
    const url = `${DOMAIN}/camera?_id=${_id}`;
    return PUT({
      url,
      payload
    });
  },

  delete: (_id) => {
    const url = `${DOMAIN}/camera?_id=${_id}`;
    return DELETE({
      url
    });
  },

  deleteMany: (ids) => {
    const url = `${DOMAIN}/camera/deletes`;
    return POST({
      url,
      payload: {
        ids
      }
    });
  },
};
export default CameraApi;
