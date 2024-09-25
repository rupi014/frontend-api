import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://vikingsdb.up.railway.app/orders/');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders data', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="section">
      <h2>Orders</h2>
      <ul>
        <li className="header">
          <span>ID</span>
          <span>Cliente</span>
          <span>Producto</span>
          <span>Cantidad</span>
          <span>Precio Total</span>
          <span>Fecha</span>
        </li>
        {orders.map((order) => (
          <li key={order.id}>
            <span>{order.id}</span>
            <span>{order.customer}</span>
            <span>{order.product}</span>
            <span>{order.quantity}</span>
            <span>{order.totalPrice}</span>
            <span>{order.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;