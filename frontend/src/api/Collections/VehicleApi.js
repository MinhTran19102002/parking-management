import { POST } from '../axiosMethods';

const DOMAIN = import.meta.env.VITE_DOMAIN;

const VehicleApi = {
  active: (payload) => {
    const url = `${DOMAIN}/vehicle/active`;
    return POST({ url, payload });
  },
  inActive: (payload) => {
    const url = `${DOMAIN}/vehicle/inActive`;
    return POST({ url, payload });
  },
  registerPayment: (payload) => {
    const url = `${DOMAIN}/payment/register`;
    return POST({ url, payload });
  },
  pay: (payload) => {
    const url = `${DOMAIN}/payment/create_payment`;
    return POST({
      url,
      payload,
    });
  },
  savePayment: (payload) => {
    const url = `${DOMAIN}/payment/save_payment`;
    return POST({
      url,
      payload,
    });
  },
};
export default VehicleApi;
