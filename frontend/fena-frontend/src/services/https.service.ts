import axios from 'axios';

const httpService = axios.create({
  baseURL:
    process.env.REACT_APP_NODE_ENV === 'production'
      ? process.env.REACT_APP_API_URL
      : process.env.REACT_APP_API_URL_DEV
});

// Set default headers
httpService.defaults.headers.common['x-access-token'] =
  process.env.API_KEY_SECRET;

const setTokenBearer = (token: string) => {
  httpService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export { httpService, setTokenBearer };
