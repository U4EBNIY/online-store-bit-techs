import { $authHost } from './index';

export const addToBasket = async (deviceId) => {
    try {
        const { data } = await $authHost.post('api/basket', { deviceId });
        return data;
    } catch (e) {
        console.error('Ошибка при добавлении в корзину:', e);
        throw new Error('Не удалось добавить товар в корзину');
    }
};

export const fetchBasket = async () => {
    try {
        const { data } = await $authHost.get('api/basket');
        return data;
    } catch (e) {
        console.error('Ошибка при загрузке корзины:', e);
        throw new Error('Не удалось загрузить корзину');
    }
};

export const removeFromBasket = async (basketDeviceId) => {
    try {
        const { data } = await $authHost.delete(`api/basket/${basketDeviceId}`);
        return data;
    } catch (e) {
        console.error('Ошибка при удалении товара из корзины:', e);
        throw new Error('Не удалось удалить товар из корзины');
    }
};
