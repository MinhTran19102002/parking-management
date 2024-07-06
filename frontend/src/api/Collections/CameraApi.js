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
    let form = new FormData();
    for (const key in payload) {
      const value = payload[key];
      if (Array.isArray(value)) {
        const arrayKey = `${key}[]`;
        value.forEach((v) => {
          console.log(v);
          form.append(arrayKey, v);
        });
      } else {
        form.append(key, value);
      }
    }
    console.log(...form);
    const url = `${DOMAIN}/camera`;
    return POST({
      url,
      payload: payload,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  edit: (_id, payload) => {
    const url = `${DOMAIN}/camera?_id=${_id}`;
    return PUT({
      url,
      payload
    });
  },

  editMany: (cameras) => {
    const url = `${DOMAIN}/camera/updateS`;
    const payload = cameras.map((cameraItem) => {
      delete cameraItem.updatedAt;
      delete cameraItem.createdAt;
      return cameraItem;
    });
    return POST({
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

  editAiCamera: (payload) => {
    // payload = {type, cameraId}
    const url = `${DOMAIN}/config/ConfigCamera`;
    return PUT({
      url,
      payload
    });
  }
};
export default CameraApi;
