import axios from 'axios';

export const host_url = 'http://localhost:7000';

export const getUrls = () => {
  return axios.get(host_url)
}
