const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const { Device, DeviceInfo } = require('../models/models');
const ApiError = require('../error/ApiError');

class DeviceController {
  async create(req, res, next) {
    try {
      const { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;

      if (!img) {
        return next(ApiError.badRequest('Файл изображения не передан'));
      }

      const fileName = uuid.v4() + ".jpg";
      await img.mv(path.resolve(__dirname, '..', 'static', fileName));

      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName
      });

      if (info) {
        const parsedInfo = JSON.parse(info);
        parsedInfo.forEach(i =>
          DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: device.id
          })
        );
      }

      return res.json(device);
    } catch (e) {
      console.error('Ошибка при создании устройства:', e);
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    let { brandId, typeId, limit, page } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;
    let devices;

    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({ limit, offset });
    }
    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({ where: { brandId }, limit, offset });
    }
    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({ where: { typeId }, limit, offset });
    }
    if (brandId && typeId) {
      devices = await Device.findAndCountAll({ where: { brandId, typeId }, limit, offset });
    }

    return res.json(devices);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: 'info' }]
    });

    return res.json(device);
  }

  async delete(req, res) {
    const { id } = req.params;
    const device = await Device.findByPk(id);
    if (!device) {
      return res.status(404).json({ message: 'Товар не найден' });
    }

    // удалить изображение
    const imgPath = path.resolve(__dirname, '..', 'static', device.img);
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }

    await device.destroy();
    return res.json({ message: 'Товар удалён' });
  }

  // ✅ новый метод: обновление товара
  async update(req, res, next) {
  try {
    const { id } = req.params;
    const { name, price, info } = req.body;
    const device = await Device.findByPk(id);

    if (!device) {
      return next(ApiError.notFound('Товар не найден'));
    }

    // Обработка нового изображения
    let fileName = device.img;
    if (req.files?.img) {
      const { img } = req.files;
      fileName = uuid.v4() + ".jpg";
      const filePath = path.resolve(__dirname, '..', 'static', fileName);
      await img.mv(filePath);

      // удалить старое изображение
      const oldImgPath = path.resolve(__dirname, '..', 'static', device.img);
      if (fs.existsSync(oldImgPath)) {
        fs.unlinkSync(oldImgPath);
      }
    }

    // Обновляем базовые поля
    device.name = name || device.name;
    device.price = price || device.price;
    device.img = fileName;
    await device.save();

    // Обновляем характеристики (удаляем старые и создаём новые)
    if (info) {
      await DeviceInfo.destroy({ where: { deviceId: id } }); // удаляем старые
      const parsedInfo = JSON.parse(info);
      for (const i of parsedInfo) {
        await DeviceInfo.create({
          title: i.title,
          description: i.description,
          deviceId: device.id,
        });
      }
    }

    return res.json(device);
  } catch (e) {
    console.error('Ошибка при обновлении устройства:', e);
    next(ApiError.badRequest(e.message));
  }
}

}

module.exports = new DeviceController();
