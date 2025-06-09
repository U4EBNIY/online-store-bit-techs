import { $authHost } from './index';

export const createOrder = async () => {
  const { data } = await $authHost.post('api/order');
  return data;
};

export const fetchOrders = async () => {
  const { data } = await $authHost.get('api/order');
  return data;
};
