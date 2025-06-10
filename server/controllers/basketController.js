const { Basket, BasketDevice, Device, Brand } = require('../models/models');
const ApiError = require('../error/ApiError');

class BasketController {
    async addDevice(req, res, next) {
        try {
            const userId = req.user.id;
            const { deviceId } = req.body;

            if (!deviceId) {
                return next(ApiError.badRequest('Не передан ID девайса'));
            }

            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return next(ApiError.badRequest("Корзина не найдена"));
            }

            const device = await Device.findByPk(deviceId);
            if (!device) {
                return next(ApiError.badRequest("Устройство не найдено"));
            }

            const basketDevice = await BasketDevice.create({ basketId: basket.id, deviceId });
            return res.json(basketDevice);
        } catch (err) {
            console.error("Ошибка addDevice:", err);
            next(ApiError.internal('Ошибка при добавлении в корзину'));
        }
    }

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
                        include: [Brand],
                    },
                ],
            });

            return res.json(basketDevices);
        } catch (err) {
            console.error("Ошибка getBasket:", err);
            next(ApiError.internal('Ошибка при получении корзины'));
        }
    }

    async removeDevice(req, res, next) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return next(ApiError.badRequest("Некорректный ID товара"));
            }

            const removed = await BasketDevice.destroy({ where: { id } });
            if (!removed) {
                return next(ApiError.badRequest('Товар не найден в корзине'));
            }

            return res.json({ message: 'Товар удален из корзины' });
        } catch (err) {
            console.error("Ошибка removeDevice:", err);
            next(ApiError.internal('Ошибка при удалении товара из корзины'));
        }
    }
}

module.exports = new BasketController();
