import axios from 'axios';

export const host_url = 'http://localhost:3002';

export const getUrls = () => {
  return axios.get(`${host_url}/get_urls`)
}
