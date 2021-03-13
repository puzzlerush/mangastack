import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production' ?
  process.env.REACT_APP_BACKEND_URL : 'http://localhost:5000';

const config = { baseURL };

const instance = axios.create(config);

export default instance;