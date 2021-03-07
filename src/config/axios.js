import axios from 'axios';

const config = {
  baseURL: process.env.REACT_APP_BACKEND_URL
};

const instance = axios.create(config);

export default instance;