const { Basket, BasketDevice, Device, Order, OrderDevice } = require('../models/models');
const ApiError = require('../error/ApiError');

class OrderController {
async createOrder(req, res, next) {
  try {
    const userId = req.user.id;
    const basket = await Basket.findOne({ where: { userId } });

    if (!basket) {
      return next(ApiError.badRequest("Корзина не найдена"));
    }

    // Получаем товары корзины, фильтруем те, где device не найден
    const basketDevices = await BasketDevice.findAll({
      where: { basketId: basket.id },
      include: [{ model: Device }]
    });

    // Отфильтруем basketDevices, у которых device !== null
    const validBasketDevices = basketDevices.filter(bd => bd.device);

    if (validBasketDevices.length === 0) {
      return next(ApiError.badRequest("В корзине нет доступных товаров для оформления заказа"));
    }

    // Считаем общую стоимость по validBasketDevices
    const totalPrice = validBasketDevices.reduce((sum, bd) => sum + bd.device.price, 0);

    // Создаем заказ
    const order = await Order.create({ userId, totalPrice });

    // Добавляем товары в OrderDevice
    for (const bd of validBasketDevices) {
      await OrderDevice.create({ orderId: order.id, deviceId: bd.device.id });
    }

    // Можно очистить корзину или оставить как есть
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
