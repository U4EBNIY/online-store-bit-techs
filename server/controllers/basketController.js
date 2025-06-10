const { Basket, BasketDevice, Device, Brand } = require('../models/models');
const ApiError = require('../error/ApiError');

class BasketController {
    // Добавление товара в корзину
    async addDevice(req, res, next) {
        try {
            const userId = req.user.id;
            const { deviceId } = req.body;

            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return next(ApiError.badRequest("Корзина не найдена"));
            }

            const basketDevice = await BasketDevice.create({ basketId: basket.id, deviceId });
            return res.json(basketDevice);
        } catch (err) {
            next(ApiError.internal('Ошибка при добавлении в корзину'));
        }
    }

    // Получение содержимого корзины
    async getBasket(req, res, next) {
        try {
            const userId = req.user.id;
            const basket = await Basket.findOne({ where: { userId } });

            if (!basket) {
                return next(ApiError.badRequest("Корзина не найдена"));
            }

            const basketDevices = await BasketDevice.findAll({
                where: { basketId: basket.id },
                include: [
                    {
                        model: Device,
                        include: [Brand], // 🔧 добавили загрузку бренда
                    },
                ],
            });

            return res.json(basketDevices);
        } catch (err) {
            next(ApiError.internal('Ошибка при получении корзины'));
        }
    }

    // Удаление товара из корзины
    async removeDevice(req, res, next) {
        try {
            const { id } = req.params; // id basketDevice
            const removed = await BasketDevice.destroy({ where: { id } });
            if (!removed) {
                return next(ApiError.badRequest('Товар не найден в корзине'));
            }
            return res.json({ message: 'Товар удален из корзины' });
        } catch (err) {
            next(ApiError.internal('Ошибка при удалении товара из корзины'));
        }
    }
}

module.exports = new BasketController();
