import axios from 'axios';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 55000
});

axiosClient.interceptors.request.use((config) => {
  config.headers['Authorization'] = `bearer ${Cookies.get('access_token')}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const { response } = error;
    let statusCode = 500;
    let message = 'Lỗi không xác định';
    let data;

    if (response) {
      statusCode = response.status;
      message = response.statusText;

      if (response?.data) {
        data = response.data;
      }
    }

    return Promise.reject({
      statusCode,
      message,
      data
    });
  }
);

export default axiosClient;
