import React, { useEffect, useState } from 'react';
import { fetchBasket, removeFromBasket } from '../http/basketAPI';
import { createOrder } from '../http/orderAPI';
import { Container, Row, Col, Button, Card, Image, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Basket = () => {
    const [basketDevices, setBasketDevices] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const loadBasket = async () => {
        try {
            const data = await fetchBasket();
            if (!Array.isArray(data)) throw new Error('Неверный формат данных корзины');
            setBasketDevices(data);
            calculateTotalPrice(data);
        } catch (e) {
            console.error('Ошибка при загрузке корзины:', e);
            setErrorMessage('Не удалось загрузить корзину. Попробуйте позже.');
        }
    };

    const calculateTotalPrice = (items) => {
        const sum = items.reduce((acc, item) => acc + (item.device?.price || 0), 0);
        setTotalPrice(sum);
    };

    useEffect(() => {
        loadBasket();
    }, []);

    const handleRemove = async (id) => {
        try {
            await removeFromBasket(id);
            const updated = basketDevices.filter(item => item.id !== id);
            setBasketDevices(updated);
            calculateTotalPrice(updated);
        } catch (e) {
            console.error('Ошибка при удалении из корзины:', e);
            setErrorMessage('Не удалось удалить товар. Попробуйте позже.');
        }
    };

    const handleOrder = async () => {
        try {
            const res = await createOrder(); // допустим, он вернёт orderId

            const receiptWindow = window.open('', '_blank', 'width=600,height=800');

            const orderDetails = {
                id: res.orderId,
                totalPrice,
                devices: basketDevices.map(item => ({
                    name: item.device.name,
                    price: item.device.price,
                    brand: { name: item.device.brand?.name || 'Без бренда' }
                }))
            };

            receiptWindow.document.write(`
                <html>
                  <head>
                    <title>Чек заказа</title>
                  </head>
                  <body>
                    <div id="receipt-root"></div>
                    <script>
                        window.order = ${JSON.stringify(orderDetails)};
                    </script>
                    <script src="/receipt-print.js"></script>
                  </body>
                </html>
            `);
            receiptWindow.document.close();

            setBasketDevices([]);
            setTotalPrice(0);
            navigate('/');
        } catch (e) {
            console.error('❌ Ошибка при оформлении заказа:', e?.response?.data || e.message);
            setErrorMessage('Не удалось оформить заказ. Попробуйте позже.');
        }
    };

    return (
        <Container className="mt-3">
            <h2>Корзина</h2>

            {errorMessage && (
                <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
                    {errorMessage}
                </Alert>
            )}

            {basketDevices.length === 0 ? (
                <p>Корзина пуста</p>
            ) : (
                <>
                    {basketDevices.map(item => {
                        if (!item.device) return null;

                        return (
                            <Card key={item.id} className="mb-3 p-3">
                                <Row>
                                    <Col md={2}>
                                        <Image
                                            width={100}
                                            src={process.env.REACT_APP_API_URL + item.device.img}
                                            alt={item.device.name}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <h4>{item.device.name}</h4>
                                        <p>Цена: {item.device.price} руб.</p>
                                    </Col>
                                    <Col md={4} className="d-flex align-items-center justify-content-end">
                                        <Button variant="danger" onClick={() => handleRemove(item.id)}>
                                            Удалить
                                        </Button>
                                    </Col>
                                </Row>
                            </Card>
                        );
                    })}

                    <Card className="p-3">
                        <h4>Итого: {totalPrice} руб.</h4>
                        <Button variant="success" onClick={handleOrder}>
                            Оформить заказ
                        </Button>
                    </Card>
                </>
            )}
        </Container>
    );
};

export default Basket;
