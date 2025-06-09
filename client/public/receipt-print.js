// public/receipt-print.js

window.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('receipt-root');
  if (!root || !window.order) return;

  const order = window.order;

  root.innerHTML = `
    <h2>🧾 Чек на заказ #${order.id}</h2>
    <p><strong>Дата:</strong> ${new Date().toLocaleString()}</p>
    <hr />
    ${order.devices.map(d =>
        `<div><strong>Товар:</strong> ${d.name} — <strong>${d.price} руб.</strong></div>`
    ).join('')}
    <hr />
    <h3>💰 Итог: ${order.totalPrice} руб.</h3>
    <p>Спасибо за покупку!</p>
  `;

  setTimeout(() => {
    window.print();
  }, 300);
});
