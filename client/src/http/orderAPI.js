import { $authHost } from './index';

export const createOrder = async () => {
    try {
        const { data } = await $authHost.post('api/order');
        return data;
    } catch (e) {
        console.error('Ошибка при создании заказа:', e);
        throw new Error('Не удалось оформить заказ');
    }
};

export const fetchOrders = async () => {
    try {
        const { data } = await $authHost.get('api/order');
        return data;
    } catch (e) {
        console.error('Ошибка при получении заказов:', e);
        throw new Error('Не удалось получить список заказов');
    }
};
