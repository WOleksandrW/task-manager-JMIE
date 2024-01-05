import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5050/',
  headers: {
    accept: 'application/json'
  }
});

instance.interceptors.request.use(
  function (config) {
    config.headers['authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
    return config;
  },
  function (error) {
    console.log('Error');
    return Promise.reject(error);
  }
);

export default instance;
