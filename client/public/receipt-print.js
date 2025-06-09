// public/receipt-print.js

window.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('receipt-root');
    if (!root || !window.order) return;

    const order = window.order;
    const currentDate = new Date().toLocaleString();

    root.innerHTML = `
        <div style="
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            width: 750px;
            margin: auto;
            padding: 40px;
            border: 2px solid #000;
            box-shadow: 0 0 20px rgba(0,0,0,0.15);
            background-color: #fff;
        ">
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://i.pinimg.com/736x/2b/09/45/2b0945ca8be9d2e3ef6417cf2866e324.jpg" 
                     alt="Логотип" 
                     style="max-height: 160px; margin-bottom: 20px; border-radius: 10px;" />
                <h1 style="font-size: 36px; margin: 0;">🧾 Кассовый чек</h1>
                <p style="font-size: 18px;">Интернет-магазин <strong>«ТехноСфера»</strong></p>
                <p style="font-size: 18px;">${currentDate}</p>
            </div>

            <div style="font-size: 20px; margin-bottom: 20px;">
                <strong>Номер заказа:</strong> ${order.id}<br/>
                <strong>Позиций в заказе:</strong> ${order.devices.length}
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 18px;">
                <thead>
                    <tr style="background-color: #f0f0f0;">
                        <th style="border: 1px solid #ccc; padding: 10px;">№</th>
                        <th style="border: 1px solid #ccc; padding: 10px;">Товар</th>
                        <th style="border: 1px solid #ccc; padding: 10px;">Цена (₽)</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.devices.map((device, idx) => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${idx + 1}</td>
                            <td style="border: 1px solid #ddd; padding: 10px;">${device.name}</td>
                            <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${device.price}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div style="margin-top: 30px; text-align: right; font-size: 24px;">
                <strong>Итого к оплате:</strong> ${order.totalPrice} ₽
            </div>

            <div style="text-align: center; margin-top: 50px; font-size: 18px; color: #444;">
                <p>Спасибо за ваш заказ ❤️</p>
                <p>Вы сделали отличный выбор. Ждём вас снова!</p>
            </div>
        </div>
    `;

    setTimeout(() => {
        window.print();
    }, 400);
});
