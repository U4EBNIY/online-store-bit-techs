require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const router = require('./routes/index');
const fileUpload = require('express-fileupload');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');
const PORT = process.env.PORT || 7000;
const orderRouter = require('./routes/orderRouter');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload());
app.use('/api', router);
app.use('/api/order', orderRouter);
app.use(fileUpload({}));
// Обработка ошибок Middleware
app.use(errorHandler);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Сервер стартовал на порту ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();