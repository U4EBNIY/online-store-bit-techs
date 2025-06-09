const { Basket, BasketDevice, Device, Order, OrderDevice } = require('../models/models');
const ApiError = require('../error/ApiError');

class OrderController {
  async createOrder(req, res, next) {
    try {
        const userId = req.user.id;
        console.log('🧾 userId:', userId);

        const basket = await Basket.findOne({ where: { userId } });
        console.log('🧺 basket:', basket?.id);

        const basketDevices = await BasketDevice.findAll({
            where: { basketId: basket.id },
            include: [Device]
        });

        console.log('📦 basketDevices:', basketDevices.map(dev => ({
            id: dev.id,
            deviceId: dev.deviceId,
            device: dev.device?.name,
        })));

        if (!basketDevices.length) {
            return next(ApiError.badRequest('Корзина пуста'));
        }

        const totalPrice = basketDevices.reduce((sum, item) => sum + item.device.price, 0);
        console.log('💰 totalPrice:', totalPrice);

        const order = await Order.create({ userId, totalPrice });

        for (const item of basketDevices) {
            console.log('➡️ Добавляем в заказ:', item.deviceId);
            await OrderDevice.create({
                orderId: order.id,
                deviceId: item.deviceId,
            });
        }

        await BasketDevice.destroy({ where: { basketId: basket.id } });

        return res.json({ message: 'Заказ оформлен', orderId: order.id });

    } catch (e) {
        console.error('❌ Ошибка внутри createOrder:', e);
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
          include: [Device],
        },
      });
      return res.json(orders);
    } catch (e) {
      next(ApiError.internal('Ошибка при получении заказов'));
    }
  }
}
module.exports = new OrderController();
