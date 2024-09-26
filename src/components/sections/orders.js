import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { deleteOrder } from '../functions/delete_functions';
import { addOrder} from '../functions/create_functions';
import { updateOrder } from '../functions/edit_functions';
import './section_style.scss';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    user_id: '',
    order_date: '',
    total_price: '',
    status: ''
  });
  const [orderToEdit, setOrderToEdit] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');  
        const response = await axios.get('https://vikingsdb.up.railway.app/orders/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders data', error);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      setOrders(orders.filter(order => order.id !== id));
    } catch (error) {
      console.error('Error deleting order', error);
    }
  };

  const handleAddOrder = async () => {
    try {
      const addedOrder = await addOrder(newOrder);
      setOrders([...orders, addedOrder]);
      setNewOrder({ user_id: '', order_date: '', total_price: '', status: '' });
    } catch (error) {
      console.error('Error adding order', error);
    }
  };

  const handleEditOrder = (order) => {
    setOrderToEdit(order);
    // Convertir la fecha al formato correcto
    setNewOrder({
      ...order,
      order_date: order.order_date.split('T')[0]
    });
  };

  const handleUpdateOrder = async () => {
    try {
      const updatedOrder = await updateOrder(orderToEdit.id, newOrder);
      setOrders(orders.map(order => (order.id === orderToEdit.id ? updatedOrder : order)));
      setOrderToEdit(null);
      setNewOrder({ user_id: '', order_date: '', total_price: '', status: '' });
      // Refrescar la lista de pedidos después de actualizar
      const token = localStorage.getItem('token');  
      const response = await axios.get('https://vikingsdb.up.railway.app/orders/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error updating order', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  return (
    <div className="container">
        <div className="section">
        <h2>Pedidos</h2>
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
                <span>{order.order_date.split('T')[0]}</span>
                <span>{order.total_price}</span>
                <span>{order.status}</span>
                <span>
                    <button className='edit-button' onClick={() => handleEditOrder(order)}>Editar</button>
                    <button className='delete-button' onClick={() => handleDelete(order.id)}>Eliminar</button>
                </span>
            </li>
            ))}
        </ul>
        </div>
        <div className="section">
          <h2>{orderToEdit ? 'Editar Pedido' : 'Añadir Pedido'}</h2>
          <form className="create-form">
            <label>Usuario ID:</label>
            <input type="text" name="user_id" value={newOrder.user_id} onChange={handleChange} />
            <label>Fecha:</label>
            <input type="date" name="order_date" value={newOrder.order_date} onChange={handleChange} />
            <label>Total:</label>
            <input type="number" name="total_price" value={newOrder.total_price} onChange={handleChange} />
            <label>Estado:</label>
            <input type="text" name="status" value={newOrder.status} onChange={handleChange} />
            <button type="button" onClick={orderToEdit ? handleUpdateOrder : handleAddOrder}>
              {orderToEdit ? 'Actualizar' : 'Crear'}
            </button>
          </form>
        </div>
    </div>
  );
};

export default Orders;