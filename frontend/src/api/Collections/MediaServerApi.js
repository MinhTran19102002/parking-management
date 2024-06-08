import { GET, POST } from '../axiosMethods';

const DOMAIN = import.meta.env.VITE_DOMAIN_MEDIA;

export default {
  captureImageFromStream: () => {
    const url = `${DOMAIN}/imagecap`;
    return fetch({
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },

  getLicensesFromStream: () => {
    const url = `${DOMAIN}/licenseS`;
    return fetch({
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
