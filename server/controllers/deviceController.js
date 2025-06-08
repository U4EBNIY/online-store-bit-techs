const uuid = require('uuid');
const path = require('path');
const {Device, DeviceInfo} = require('../models/models');
const ApiError = require('../error/ApiError');
const {type} = require('os');

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
        let {brandId, typeId, limit, page} = req.query;
        page = page || 1;
        limit = limit || 9;
        let offset = page * limit - limit;
        let devices;
        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({limit, offset});
        }
        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({where: {brandId}, limit, offset});
        }
        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({where: {typeId}, limit, offset});
        }
        if (brandId && typeId) {
            devices = await Device.findAndCountAll({where: {brandId, typeId}, limit, offset});
        }
        return res.json(devices);
    }

    async getOne(req, res) {
        const {id} = req.params;
        const device = await Device.findOne(
            {
                where: {id},
                include: [{model: DeviceInfo, as: 'info'}]
            },

        )
        return res.json(device);
    }

    async delete(req, res) {
    const { id } = req.params;
    const device = await Device.findByPk(id);
    if (!device) {
        return res.status(404).json({ message: 'Товар не найден' });
    }
    await device.destroy();
    return res.json({ message: 'Товар удалён' });
}

}

module.exports = new DeviceController();