import { post, get } from '@/helpers/httpRequests';
import { bity } from '../config';

const getRates = () => {
  return get(bity.rates);
};

const openOrder = orderInfo => {
  return post(`${bity.server}/order`, orderInfo);
};

const getStatus = orderInfo => {
  return post(`${bity.server}/status`, orderInfo);
};

const login = () => {
  post(`${bity.server}/login`, {}).then(data => {
    return data.token;
  });
};

export { getRates, openOrder, getStatus, login };
