import axios from 'axios';
import Config from 'Config';
export const host_url = Config.host_url
export const api_port = 3002;
export const socket_port = 7000;

export const getUrls = () => {
  console.log(`${host_url}:${api_port}/get_urls`)
  return axios.get(`${host_url}:${api_port}/get_urls`)
}
