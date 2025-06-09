import React, { useEffect, useState } from 'react';
import { fetchBasket, removeFromBasket } from '../http/basketAPI';
import { createOrder } from '../http/orderAPI';
import { Container, Row, Col, Button, Card, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Basket = () => {
    const [basketDevices, setBasketDevices] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();

    const loadBasket = async () => {
        const data = await fetchBasket();
        setBasketDevices(data);
        calculateTotalPrice(data);
    };

    const calculateTotalPrice = (items) => {
        const sum = items.reduce((acc, item) => acc + (item.device?.price || 0), 0);
        setTotalPrice(sum);
    };

    useEffect(() => {
        loadBasket();
    }, []);

    const handleRemove = async (id) => {
        await removeFromBasket(id);
        const updated = basketDevices.filter(item => item.id !== id);
        setBasketDevices(updated);
        calculateTotalPrice(updated);
    };

const handleOrder = async () => {
    try {
        const res = await createOrder();
        alert(`Заказ №${res.orderId} успешно оформлен!`);
        setBasketDevices([]);
        setTotalPrice(0);
        navigate('/');
    } catch (e) {
        console.error('❌ Ошибка при оформлении заказа:', e?.response?.data || e.message);
        alert('Ошибка при оформлении заказа');
    }
};


    return (
        <Container className="mt-3">
            <h2>Корзина</h2>

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
