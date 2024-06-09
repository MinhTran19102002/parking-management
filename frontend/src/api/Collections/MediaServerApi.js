import { GET, POST } from '../axiosMethods';

const DOMAIN = import.meta.env.VITE_DOMAIN_MEDIA;

export default {
  captureImageFromStream: () => {
    const url = `${DOMAIN}/imagecap`;
    return GET({ url, responseType: "blob", headers: { "Content-Type": "image/png", } })
  },

  getLicensesFromStream: () => {
    const url = `${DOMAIN}/licenseS`;
    return GET({ url })
  },

  getImageFromStream: () => {
    const url = `${DOMAIN}/imagecap`;
    return new Promise(resolve => {
      resolve(url);
    });
  }
};
