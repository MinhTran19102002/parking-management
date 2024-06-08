import { GET, POST } from '../axiosMethods';

const DOMAIN = import.meta.env.VITE_DOMAIN_MEDIA;

export default {
  captureImageFromStream: () => {
    const url = `${DOMAIN}/imagecap`;
    return fetch(url,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },

  getLicensesFromStream: () => {
    const url = `${DOMAIN}/licenseS`;
    return fetch(url,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, POST, DELETE, OPTIONS',
       'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': 86400,
        mode: 'no-cors',
      }
    });
  }
};
