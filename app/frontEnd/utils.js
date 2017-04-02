import axios from 'axios';

export const host_url = process.env.NODE_ENV == 'production' ? 'http://www.manojsinghnegi.com' : 'http://localhost';
export const api_port = 3002;
export const socket_port = 7000;

export const getUrls = () => {
  return axios.get(`${host_url}:${api_port}/get_urls`)
}
