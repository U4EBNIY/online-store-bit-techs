import React, { useEffect, useState } from 'react';
import { fetchBasket, removeFromBasket } from '../http/basketAPI';
import { Container, Row, Col, Button, Card, Image } from 'react-bootstrap';

const Basket = () => {
    const [basketDevices, setBasketDevices] = useState([]);

    useEffect(() => {
        fetchBasket().then(data => setBasketDevices(data));
    }, []);

    const handleRemove = async (id) => {
        await removeFromBasket(id);
        setBasketDevices(prev => prev.filter(item => item.id !== id));
    };

    return (
        <Container className="mt-3">
            <h2>Корзина</h2>
            {basketDevices.length === 0 && <p>Корзина пуста</p>}
            {basketDevices.map(item =>
                <Card key={item.id} className="mb-3 p-3">
                    <Row>
                        <Col md={2}>
                            <Image width={100} src={process.env.REACT_APP_API_URL + item.device.img} />
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
            )}
        </Container>
    );
};

export default Basket;
