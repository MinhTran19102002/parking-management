import { POST } from '../axiosMethods';

const DOMAIN = import.meta.env.VITE_DOMAIN;

const VehicleApi = {
  active: (payload) => {
    const url = `${DOMAIN}/vehicle/active`;
    return POST({ url, payload });
  }
};
export default VehicleApi;
