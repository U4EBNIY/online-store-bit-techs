// public/receipt-print.js

window.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('receipt-root');
    if (!root || !window.order) return;

    const order = window.order;

    const currentDate = new Date().toLocaleString();

    root.innerHTML = `
        <div style="
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            width: 600px;
            margin: auto;
            padding: 30px;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        ">
            <h1 style="text-align: center; margin-bottom: 10px;">🧾 Чек на заказ</h1>
            <p style="text-align: center; margin: 0;">Интернет-магазин "Мир Техники"</p>
            <p style="text-align: center; margin-bottom: 20px;">Дата: ${currentDate}</p>

            <p><strong>Номер заказа:</strong> ${order.id}</p>
            <p><strong>Количество товаров:</strong> ${order.devices.length}</p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <thead>
                    <tr style="background-color: #f4f4f4;">
                        <th style="border: 1px solid #ccc; padding: 8px;">#</th>
                        <th style="border: 1px solid #ccc; padding: 8px;">Товар</th>
                        <th style="border: 1px solid #ccc; padding: 8px;">Цена (руб.)</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.devices.map((device, idx) => `
                        <tr>
                            <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${idx + 1}</td>
                            <td style="border: 1px solid #ccc; padding: 8px;">${device.name}</td>
                            <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">${device.price}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <hr style="margin: 25px 0;">

            <h2 style="text-align: right;">Итого: ${order.totalPrice} руб.</h2>

            <p style="text-align: center; margin-top: 40px;">Спасибо за покупку! Надеемся увидеть вас снова ❤️</p>
        </div>
    `;

    setTimeout(() => {
        window.print();
    }, 300);
});
