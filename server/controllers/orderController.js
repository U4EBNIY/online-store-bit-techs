const { Order, OrderDevice, Basket, BasketDevice, Device } = require('../models/models');
const ApiError = require('../error/ApiError');

class OrderController {
  async createOrder(req, res, next) {
    try {
      const userId = req.user.id;
      const basket = await Basket.findOne({ where: { userId } });

      const basketDevices = await BasketDevice.findAll({
        where: { basketId: basket.id },
        include: [Device],
      });

      if (!basketDevices.length) {
        return next(ApiError.badRequest('Корзина пуста'));
      }

      const totalPrice = basketDevices.reduce((sum, item) => sum + item.device.price, 0);
      const order = await Order.create({ userId, totalPrice });

      for (const item of basketDevices) {
        await OrderDevice.create({
          orderId: order.id,
          deviceId: item.deviceId,
        });
      }

      // Очистка корзины
      await BasketDevice.destroy({ where: { basketId: basket.id } });

      return res.json({ message: 'Заказ оформлен', orderId: order.id });
    } catch (e) {
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
