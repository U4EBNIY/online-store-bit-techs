// src/components/Receipt.js
import React, { useEffect } from 'react';

const Receipt = ({ order }) => {
    useEffect(() => {
        setTimeout(() => {
            window.print();
        }, 500); // небольшая задержка, чтобы отрендерилось
    }, []);

    const currentDate = new Date().toLocaleString();

    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
            <h2>🧾 Чек на заказ #{order.id}</h2>
            <p><strong>Дата:</strong> {currentDate}</p>
            <hr />
            {order.devices.map((item, idx) => (
                <div key={idx} style={{ marginBottom: '10px' }}>
                    <div><strong>Товар:</strong> {item.name}</div>
                    <div><strong>Цена:</strong> {item.price} руб.</div>
                </div>
            ))}
            <hr />
            <h3>💰 Итог: {order.totalPrice} руб.</h3>
            <p>Спасибо за покупку!</p>
        </div>
    );
};

export default Receipt;
