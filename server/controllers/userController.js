const ApiError = require("../error/ApiError");
const {User, Basket} = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY, 
        {expiresIn: '24h'}
        );
}

class UserController {
    async registration(req, res) {
        const {email, password, role} = req.body;
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password!'));
        }
        const candidate = await User.findOne({where: {email}});
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует!'));
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({email, role, password: hashPassword});
        const basket = await Basket.create({userId: user.id});
        const token = generateJwt(user.id, user.email, user.role);
        return res.json({token});
    }

    async login(req, res, next) {
        const {email, password} = req.body;
        const user = await User.findOne({where: {email}});
        if (!user) {
            return next(ApiError.internal('Пользователь с таким email не найден!'));
        }
        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль!'));
        }
        const token = generateJwt(user.id, user.email, user.role);
        return res.json({token});
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role);
        return res.json({token});
    }

    async delete(req, res, next) {
        const {email} = req.body;
        if (!email) {
            return next(ApiError.badRequest('Email не указан!'));
        }
        const candidate = await User.findOne({where: {email}});
        if (candidate) {
            await Basket.destroy({ where: { userId: candidate.id } });
            await candidate.destroy();
        } else {
            return next(ApiError.badRequest('Пользователь с таким email не найден или не существует!'));
        }

        return res.json({message: 'Пользователь удален вместе со своими манатками (корзиной)!'});
    }
}

module.exports = new UserController();