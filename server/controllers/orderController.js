const { Basket, BasketDevice, Device, Order, OrderDevice, Brand } = require('../models/models');
const ApiError = require('../error/ApiError');

class OrderController {
    async createOrder(req, res, next) {
        try {
            const userId = req.user.id;

            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return next(ApiError.badRequest("Корзина не найдена"));
            }

            const basketDevices = await BasketDevice.findAll({
                where: { basketId: basket.id },
                include: [{ model: Device }],
            });

            const validBasketDevices = basketDevices.filter(bd => bd.device);
            if (validBasketDevices.length === 0) {
                return next(ApiError.badRequest("В корзине нет доступных товаров для оформления заказа"));
            }

            const totalPrice = validBasketDevices.reduce((sum, bd) => sum + bd.device.price, 0);

            const order = await Order.create({ userId, totalPrice });

            for (const bd of validBasketDevices) {
                await OrderDevice.create({ orderId: order.id, deviceId: bd.device.id });
            }

            await BasketDevice.destroy({ where: { basketId: basket.id } });

            return res.json({ message: 'Заказ оформлен', orderId: order.id });
        } catch (err) {
            console.error("Ошибка внутри createOrder:", err);
            next(ApiError.internal('Ошибка при оформлении заказа'));
        }
    }

    async getUserOrders(req, res, next) {
        try {
            const userId = req.user.id;

            const orders = await Order.findAll({
                where: { userId },
                include: {
                    model: OrderDevice,
                    include: {
                        model: Device,
                        include: [Brand], // ⬅️ Можно включить бренд, если нужно на клиенте
                    },
                },
            });

            return res.json(orders);
        } catch (err) {
            console.error("Ошибка getUserOrders:", err);
            next(ApiError.internal('Ошибка при получении заказов'));
        }
    }
}

module.exports = new OrderController();
