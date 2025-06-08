import {$authHost} from './index'; // если используешь авторизованный запрос

export const addToBasket = async (deviceId) => {
    const { data } = await $authHost.post('api/basket', { deviceId });
    return data;
};

export const fetchBasket = async () => {
    const { data } = await $authHost.get('api/basket');
    return data;
};

export const removeFromBasket = async (basketDeviceId) => {
    const { data } = await $authHost.delete(`api/basket/${basketDeviceId}`);
    return data;
};
