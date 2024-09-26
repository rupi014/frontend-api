import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import './section_style.scss';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://vikingsdb.up.railway.app/orders/', {
          headers: {
            Authorization: `Bearer ${token}` // Añade el token a los encabezados
          }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders data', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container">
        <div className="section">
        <h2>Pedidos 
          <button className="icon-button">
            <FontAwesomeIcon icon={faSquarePlus} />
          </button>
        </h2>
        <ul>
            <li className="header">
            <span>ID</span>
            <span>Usuario</span>
            <span>Fecha</span>
            <span>Total</span>
            <span>Estado</span>
            <span>Acciones</span>
            </li>
            {orders.map((order) => (
            <li key={order.id}>
                <span>{order.id}</span>
                <span>{order.user_id}</span>
                <span>{order.order_date}</span>
                <span>{order.total_price}</span>
                <span>{order.status}</span>
                <span>
                    <button className='edit-button'>Editar</button>
                    <button className='delete-button'>Eliminar</button>
                </span>
            </li>
            ))}
        </ul>
        </div>
    </div>
  );
};

export default Orders;